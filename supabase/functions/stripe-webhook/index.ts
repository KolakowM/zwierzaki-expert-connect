
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
        
        if (session.mode === 'subscription') {
          const userId = session.metadata?.user_id;
          const packageId = session.metadata?.package_id;
          
          if (userId && packageId) {
            // Update subscriber status
            await supabase.from("subscribers").upsert({
              user_id: userId,
              email: session.customer_email,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              subscribed: true,
              subscription_tier: packageId,
            });

            // Create or update user subscription
            await supabase.from("user_subscriptions").upsert({
              user_id: userId,
              package_id: packageId,
              status: 'active',
              start_date: new Date().toISOString(),
              payment_id: session.id,
            });

            // Log successful payment
            await supabase.from("payment_logs").insert({
              user_id: userId,
              stripe_session_id: session.id,
              stripe_subscription_id: session.subscription as string,
              package_id: packageId,
              amount_cents: session.amount_total,
              currency: session.currency,
              status: 'completed',
              metadata: { event_type: 'checkout.session.completed' }
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by stripe customer ID
        const { data: subscriber } = await supabase
          .from("subscribers")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (subscriber) {
          const isActive = subscription.status === 'active';
          const isCanceled = subscription.status === 'canceled';

          // Update subscriber status
          await supabase.from("subscribers").update({
            subscribed: isActive,
            subscription_end: isCanceled ? new Date().toISOString() : null,
          }).eq("user_id", subscriber.user_id);

          // Update user subscription status
          await supabase.from("user_subscriptions").update({
            status: isCanceled ? 'cancelled' : subscription.status,
            end_date: isCanceled ? new Date().toISOString() : null,
          }).eq("user_id", subscriber.user_id);

          // Log the event
          await supabase.from("payment_logs").insert({
            user_id: subscriber.user_id,
            stripe_subscription_id: subscription.id,
            status: event.type === 'customer.subscription.deleted' ? 'cancelled' : 'updated',
            metadata: { 
              event_type: event.type,
              subscription_status: subscription.status 
            }
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          const { data: subscriber } = await supabase
            .from("subscribers")
            .select("user_id")
            .eq("stripe_subscription_id", invoice.subscription as string)
            .single();

          if (subscriber) {
            await supabase.from("payment_logs").insert({
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
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          const { data: subscriber } = await supabase
            .from("subscribers")
            .select("user_id")
            .eq("stripe_subscription_id", invoice.subscription as string)
            .single();

          if (subscriber) {
            await supabase.from("payment_logs").insert({
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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
