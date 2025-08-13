
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
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

            // Update subscriber status (z onConflict po email)
            if (email) {
              const { error: subErr } = await supabase.from("subscribers").upsert({
                user_id: userId,
                email,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: session.subscription as string,
                subscribed: true,
                subscription_tier: packageId,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'email' });
              if (subErr) console.error('[WEBHOOK] subscribers upsert error:', subErr);
            }

            // Create or update user subscription (z onConflict po user_id)
            const { error: upsertErr } = await supabase.from("user_subscriptions").upsert({
              user_id: userId,
              package_id: packageId,
              status: 'active',
              start_date: new Date().toISOString(),
              payment_id: session.id,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
            if (upsertErr) console.error('[WEBHOOK] user_subscriptions upsert error:', upsertErr);

            // Log successful payment
            const { error: logErr } = await supabase.from("payment_logs").insert({
              user_id: userId,
              stripe_session_id: session.id,
              stripe_subscription_id: session.subscription as string,
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

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('[WEBHOOK] subscription change', {
          type: event.type,
          subscription_id: subscription.id,
          status: subscription.status,
        });
        
        // Find user by stripe subscription ID
        const { data: subscriber, error: findErr } = await supabase
          .from("subscribers")
          .select("user_id, email")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle();

        if (findErr) {
          console.error('[WEBHOOK] error fetching subscriber by stripe_subscription_id:', findErr);
        }

        if (subscriber) {
          const isActive = subscription.status === 'active';
          const isCanceled = subscription.status === 'canceled';

          // Update subscriber status
          const { error: subUpdateErr } = await supabase.from("subscribers").update({
            subscribed: isActive,
            subscription_end: isCanceled ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          }).eq("user_id", subscriber.user_id);
          if (subUpdateErr) console.error('[WEBHOOK] subscriber update error:', subUpdateErr);

          // Update user subscription status
          const mappedStatus = isCanceled ? 'cancelled' : (isActive ? 'active' : 'expired');
          const { error: usUpdateErr } = await supabase.from("user_subscriptions").update({
            status: mappedStatus,
            end_date: isCanceled ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          }).eq("user_id", subscriber.user_id);
          if (usUpdateErr) console.error('[WEBHOOK] user_subscriptions update error:', usUpdateErr);

          // Log the event
          const { error: logErr } = await supabase.from("payment_logs").insert({
            user_id: subscriber.user_id,
            stripe_subscription_id: subscription.id,
            status: event.type === 'customer.subscription.deleted' ? 'cancelled' : 'updated',
            metadata: { 
              event_type: event.type,
              subscription_status: subscription.status 
            }
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
