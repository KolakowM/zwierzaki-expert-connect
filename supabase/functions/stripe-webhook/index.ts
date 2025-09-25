
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@17.3.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-07-30",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  let body: Uint8Array;
  try {
    const arrayBuffer = await req.arrayBuffer();
    body = new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error("Error reading request body:", error);
    return new Response("Invalid request body", { status: 400 });
  }

  try {
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[WEBHOOK] checkout.session.completed', {
          id: session.id,
          mode: session.mode,
          customer: session.customer,
          customer_email: session.customer_email,
          customer_details_email: session.customer_details?.email,
          metadata: session.metadata,
        });
        
        if (session.mode === 'subscription') {
          const userId = session.metadata?.user_id;
          const packageId = session.metadata?.package_id;

          // Ustal pewny e-mail klienta
          const email = session.customer_details?.email || session.customer_email || undefined;

          if (userId && packageId) {
            if (!email) {
              console.warn('[WEBHOOK] Missing email in checkout.session.completed; proceeding without subscriber upsert based on email.');
            }

            // Pobierz dane pakietu
            let packageName: string | null = null;
            let isPaidPackage = false;
            const { data: pkg, error: pkgErr } = await supabase
              .from('packages')
              .select('name, price_pln')
              .eq('id', packageId)
              .maybeSingle();
            if (pkgErr) {
              console.error('[WEBHOOK] Error fetching package data:', pkgErr);
            } else {
              packageName = pkg?.name ?? null;
              // Sprawdź czy to płatny pakiet (Zaawansowany lub Zawodowiec)
              isPaidPackage = packageName === 'Zaawansowany' || packageName === 'Zawodowiec';
            }

            // AUTO-WERYFIKACJA: Sprawdź czy to pierwsza płatność i zweryfikuj użytkownika
            if (isPaidPackage) {
              console.log(`[WEBHOOK] Processing paid package (${packageName}) for user ${userId}`);
              
              // Sprawdź czy użytkownik ma już płatne subskrypcje
              const { data: existingPaidSubs, error: checkErr } = await supabase
                .from('user_subscriptions')
                .select(`
                  id,
                  packages!inner(name, price_pln)
                `)
                .eq('user_id', userId)
                .eq('status', 'active')
                .neq('packages.name', 'Testowy');

              if (checkErr) {
                console.error('[WEBHOOK] Error checking existing paid subscriptions:', checkErr);
              }

              const isFirstPaidSubscription = !existingPaidSubs || existingPaidSubs.length === 0;
              console.log(`[WEBHOOK] Is first paid subscription: ${isFirstPaidSubscription}`);

              // Zaktualizuj status weryfikacji dla płatnych pakietów
              const { error: roleUpdateErr } = await supabase
                .from('user_roles')
                .update({
                  status: 'zweryfikowany'
                })
                .eq('user_id', userId)
                .eq('role', 'specialist');

              if (roleUpdateErr) {
                console.error('[WEBHOOK] Error updating user role status:', roleUpdateErr);
              } else {
                console.log(`[WEBHOOK] User ${userId} verified due to paid subscription (${packageName})`);
              }
            }

            // Pobierz szczegóły subskrypcji, aby ustawić end_date
            let endDateIso: string | null = null;
            const subscriptionId = session.subscription as string | null;
            if (subscriptionId) {
              try {
                const sub = await stripe.subscriptions.retrieve(subscriptionId);
                if (sub.current_period_end) {
                  endDateIso = new Date(sub.current_period_end * 1000).toISOString();
                }
              } catch (e) {
                console.warn('[WEBHOOK] Unable to retrieve subscription for end date:', e);
              }
            }

            // Update subscribers (onConflict: email) – zapisuj nazwę pakietu jako tier
            if (email) {
              const { error: subErr } = await supabase.from('subscribers').upsert({
                user_id: userId,
                email,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: subscriptionId || undefined,
                subscribed: true,
                subscription_tier: packageName, // nazwa pakietu
                subscription_end: endDateIso,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'email' });
              if (subErr) console.error('[WEBHOOK] subscribers upsert error:', subErr);
            }

            // Create or update user subscription with enhanced debugging
            console.log(`[WEBHOOK] Creating/updating subscription for user: ${userId}, package: ${packageId}`);
            console.log(`[WEBHOOK] Using Service Role Key: ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ? "YES" : "NO"}`);
            
            const subscriptionData = {
              user_id: userId,
              package_id: packageId,
              status: 'active',
              start_date: new Date().toISOString(),
              end_date: endDateIso,
              payment_id: subscriptionId || undefined,
              updated_at: new Date().toISOString(),
            };
            console.log('[WEBHOOK] Subscription data:', JSON.stringify(subscriptionData, null, 2));
            
            // Check existing subscription first
            const { data: existingSubscription, error: checkErr } = await supabase
              .from('user_subscriptions')
              .select('*')
              .eq('user_id', userId);
            
            if (checkErr) {
              console.error('[WEBHOOK] Error checking existing subscription:', checkErr);
            } else {
              console.log('[WEBHOOK] Existing subscriptions:', existingSubscription);
            }
            
            const { data: upsertResult, error: upsertErr } = await supabase
              .from('user_subscriptions')
              .upsert(subscriptionData, { onConflict: 'user_id' })
              .select();
            
            if (upsertErr) {
              console.error('[WEBHOOK] user_subscriptions upsert error:', JSON.stringify(upsertErr, null, 2));
              console.error('[WEBHOOK] Failed subscription data:', JSON.stringify(subscriptionData, null, 2));
              
              // Try a different approach - update if exists, insert if not
              console.log('[WEBHOOK] Trying alternative approach...');
              if (existingSubscription && existingSubscription.length > 0) {
                const { data: updateResult, error: updateErr } = await supabase
                  .from('user_subscriptions')
                  .update({
                    package_id: packageId,
                    status: 'active',
                    end_date: endDateIso,
                    payment_id: subscriptionId || undefined,
                    updated_at: new Date().toISOString(),
                  })
                  .eq('user_id', userId)
                  .select();
                
                if (updateErr) {
                  console.error('[WEBHOOK] Update failed too:', updateErr);
                } else {
                  console.log('[WEBHOOK] Update successful:', updateResult);
                }
              } else {
                const { data: insertResult, error: insertErr } = await supabase
                  .from('user_subscriptions')
                  .insert(subscriptionData)
                  .select();
                
                if (insertErr) {
                  console.error('[WEBHOOK] Insert failed too:', insertErr);
                } else {
                  console.log('[WEBHOOK] Insert successful:', insertResult);
                }
              }
            } else {
              console.log('[WEBHOOK] Subscription upsert successful:', upsertResult);
            }

            // Log successful payment
            const { error: logErr } = await supabase.from('payment_logs').insert({
              user_id: userId,
              stripe_session_id: session.id,
              stripe_subscription_id: subscriptionId || undefined,
              package_id: packageId,
              amount_cents: session.amount_total,
              currency: session.currency,
              status: 'completed',
              metadata: { event_type: 'checkout.session.completed' }
            });
            if (logErr) console.error('[WEBHOOK] payment_logs insert error:', logErr);
          } else {
            console.warn('[WEBHOOK] Missing user_id/package_id in session.metadata');
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('[WEBHOOK] subscription change', {
          type: event.type,
          subscription_id: subscription.id,
          status: subscription.status,
        });

        // Spróbuj wywnioskować package_id z price.id
        let inferredPackageId: string | null = null;
        let inferredPackageName: string | null = null;
        try {
          const priceId = subscription.items?.data?.[0]?.price?.id as string | undefined;
          if (priceId) {
            const { data: priceMap, error: priceErr } = await supabase
              .from('package_stripe_prices')
              .select('package_id')
              .eq('stripe_price_id', priceId)
              .eq('is_active', true)
              .maybeSingle();
            if (!priceErr && priceMap?.package_id) {
              inferredPackageId = priceMap.package_id as string;
              const { data: pkg, error: pkgErr } = await supabase
                .from('packages')
                .select('name')
                .eq('id', inferredPackageId)
                .maybeSingle();
              if (!pkgErr) inferredPackageName = pkg?.name ?? null;
            }
          }
        } catch (e) {
          console.warn('[WEBHOOK] price->package mapping failed:', e);
        }

        // Find user by stripe subscription ID
        const { data: subscriber, error: findErr } = await supabase
          .from('subscribers')
          .select('user_id, email')
          .eq('stripe_subscription_id', subscription.id)
          .maybeSingle();

        if (findErr) {
          console.error('[WEBHOOK] error fetching subscriber by stripe_subscription_id:', findErr);
        }

        if (subscriber) {
          const status = subscription.status;
          const isActive = status === 'active' || status === 'trialing';
          const isCanceled = status === 'canceled' || status === 'unpaid';
          const endDateIso = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null;

          // Update subscriber status
          const subscriberUpdate: Record<string, unknown> = {
            subscribed: isActive,
            subscription_end: isCanceled ? new Date().toISOString() : endDateIso,
            updated_at: new Date().toISOString(),
          };
          if (inferredPackageName) subscriberUpdate.subscription_tier = inferredPackageName;

          const { error: subUpdateErr } = await supabase
            .from('subscribers')
            .update(subscriberUpdate)
            .eq('user_id', subscriber.user_id);
          if (subUpdateErr) console.error('[WEBHOOK] subscriber update error:', subUpdateErr);

          // Update user subscription status (+ opcjonalnie package_id)
          const mappedStatus = isCanceled ? 'cancelled' : isActive ? 'active' : 'expired';
          const usUpdate: Record<string, unknown> = {
            status: mappedStatus,
            end_date: isCanceled ? new Date().toISOString() : endDateIso,
            updated_at: new Date().toISOString(),
          };
          if (inferredPackageId) usUpdate.package_id = inferredPackageId;

          const { error: usUpdateErr } = await supabase
            .from('user_subscriptions')
            .update(usUpdate)
            .eq('user_id', subscriber.user_id);
          if (usUpdateErr) console.error('[WEBHOOK] user_subscriptions update error:', usUpdateErr);

          // AUTO-WERYFIKACJA: Sprawdź czy cofnąć weryfikację przy anulowaniu płatnych pakietów
          if (isCanceled || !isActive) {
            console.log(`[WEBHOOK] Checking if user ${subscriber.user_id} should lose verification due to subscription change`);
            
            // Sprawdź czy użytkownik ma jeszcze jakieś aktywne płatne pakiety
            const { data: remainingPaidSubs, error: paidCheckErr } = await supabase
              .from('user_subscriptions')
              .select(`
                id,
                packages!inner(name, price_pln)
              `)
              .eq('user_id', subscriber.user_id)
              .eq('status', 'active')
              .in('packages.name', ['Zaawansowany', 'Zawodowiec']);

            if (paidCheckErr) {
              console.error('[WEBHOOK] Error checking remaining paid subscriptions:', paidCheckErr);
            } else {
              const hasActivePaidPackages = remainingPaidSubs && remainingPaidSubs.length > 0;
              console.log(`[WEBHOOK] User ${subscriber.user_id} has active paid packages: ${hasActivePaidPackages}`);

              // Jeśli nie ma aktywnych płatnych pakietów, cofnij weryfikację
              if (!hasActivePaidPackages) {
                const { error: roleRevertErr } = await supabase
                  .from('user_roles')
                  .update({
                    status: 'niezweryfikowany'
                  })
                  .eq('user_id', subscriber.user_id)
                  .eq('role', 'specialist');

                if (roleRevertErr) {
                  console.error('[WEBHOOK] Error reverting user role status:', roleRevertErr);
                } else {
                  console.log(`[WEBHOOK] User ${subscriber.user_id} verification reverted - no active paid packages`);
                }
              }
            }
          }

          // Log the event
          const logStatus = event.type === 'customer.subscription.deleted' ? 'cancelled' : (isActive ? 'updated' : 'expired');
          const { error: logErr } = await supabase.from('payment_logs').insert({
            user_id: subscriber.user_id,
            stripe_subscription_id: subscription.id,
            status: logStatus,
            metadata: {
              event_type: event.type,
              subscription_status: status,
            },
          });
          if (logErr) console.error('[WEBHOOK] payment_logs insert error:', logErr);
        } else {
          console.warn('[WEBHOOK] No subscriber matched for stripe_subscription_id:', subscription.id);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('[WEBHOOK] invoice.payment_succeeded', {
          invoice_id: invoice.id,
          subscription: invoice.subscription,
          amount_paid: invoice.amount_paid,
        });
        
        if (invoice.subscription) {
          const { data: subscriber, error: findErr } = await supabase
            .from("subscribers")
            .select("user_id")
            .eq("stripe_subscription_id", invoice.subscription as string)
            .maybeSingle();

          if (findErr) {
            console.error('[WEBHOOK] error fetching subscriber for invoice:', findErr);
          }

          if (subscriber) {
            const { error: logErr } = await supabase.from("payment_logs").insert({
              user_id: subscriber.user_id,
              stripe_subscription_id: invoice.subscription as string,
              amount_cents: invoice.amount_paid,
              currency: invoice.currency,
              status: 'completed',
              metadata: { 
                event_type: 'invoice.payment_succeeded',
                invoice_id: invoice.id 
              }
            });
            if (logErr) console.error('[WEBHOOK] payment_logs insert error:', logErr);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('[WEBHOOK] invoice.payment_failed', {
          invoice_id: invoice.id,
          subscription: invoice.subscription,
          amount_due: invoice.amount_due,
        });
        
        if (invoice.subscription) {
          const { data: subscriber, error: findErr } = await supabase
            .from("subscribers")
            .select("user_id")
            .eq("stripe_subscription_id", invoice.subscription as string)
            .maybeSingle();

          if (findErr) {
            console.error('[WEBHOOK] error fetching subscriber for failed invoice:', findErr);
          }

          if (subscriber) {
            const { error: logErr } = await supabase.from("payment_logs").insert({
              user_id: subscriber.user_id,
              stripe_subscription_id: invoice.subscription as string,
              amount_cents: invoice.amount_due,
              currency: invoice.currency,
              status: 'failed',
              metadata: { 
                event_type: 'invoice.payment_failed',
                invoice_id: invoice.id 
              }
            });
            if (logErr) console.error('[WEBHOOK] payment_logs insert error:', logErr);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
