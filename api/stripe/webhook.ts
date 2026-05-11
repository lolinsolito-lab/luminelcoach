import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Vercel raw body config per verificare la firma Stripe
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

// Helper per leggere il body raw (necessario per Stripe Signature)
async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      // Fallback: accetta l'evento senza verifica firma (NON SICURO, ma utile per test rapidi)
      console.warn("⚠️ STRIPE_WEBHOOK_SECRET mancante. Verifica disabilitata.");
      event = JSON.parse(buf.toString());
    } else {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    }
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Inizializza Supabase Service Role
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Gestione dell'evento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Recuperiamo l'ID utente e il piano dai metadata impostati in create-checkout
    const userId = session.client_reference_id || session.metadata?.userId;
    const plan = session.metadata?.plan || 'premium';

    if (userId) {
      if (plan.startsWith('boost_')) {
        console.log(`✅ Pagamento completato per utente ${userId}. Boost acquistato: ${plan}.`);
        let addedMinutes = 0;
        if (plan === 'boost_1h') addedMinutes = 60;
        if (plan === 'boost_3h') addedMinutes = 180;
        if (plan === 'boost_5h') addedMinutes = 300;

        const { data: profile } = await supabase.from('profiles').select('voice_balance_minutes').eq('id', userId).single();
        const currentMins = profile?.voice_balance_minutes || 0;
        
        const { error } = await supabase.from('profiles').update({ 
          voice_balance_minutes: currentMins + addedMinutes, 
          updated_at: new Date().toISOString() 
        }).eq('id', userId);

        if (error) console.error("Errore aggiornamento boost Supabase:", error);
      } else {
        console.log(`✅ Pagamento completato per utente ${userId}. Upgrade a ${plan}.`);

        // Recupera il prezzo pagato per tracciare il prezzo Fondatore
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
        const pricePaid = lineItems.data[0]?.price?.unit_amount
          ? lineItems.data[0].price.unit_amount / 100
          : null;

        const updateData: Record<string, any> = {
          plan,
          updated_at: new Date().toISOString(),
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          // Assegna minuti voce iniziali in base al piano acquistato
          ...(plan === 'vip'     && { voice_balance_minutes: 120 }),
          ...(plan === 'premium' && { voice_balance_minutes: 30 }),
        };

        // Salva il prezzo bloccato Fondatore solo al primo acquisto
        if (pricePaid && plan !== 'free') {
          updateData.founder_plan_price = pricePaid;
          updateData.is_founder = true;
        }

        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId);

        if (error) {
          console.error("Errore aggiornamento profilo Supabase:", error);
        }
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    // Downgrade a 'free' quando l'abbonamento viene annullato e scade
    const customerId = subscription.customer as string;
    if (customerId) {
      console.log(`❌ Abbonamento cancellato per customer: ${customerId}. Downgrade a free.`);
      await supabase.from('profiles').update({ plan: 'free' }).eq('stripe_customer_id', customerId);
    }
  }

  // 🔴 LA MAGIA DEL RINNOVO MENSILE (MRR)
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    // Se è il rinnovo mensile di un abbonamento (e non l'acquisto iniziale o un boost)
    if (invoice.billing_reason === 'subscription_cycle' && invoice.customer) {
      const customerId = invoice.customer as string;
      
      // Cerchiamo l'utente nel DB tramite il customer_id
      const { data: profile } = await supabase.from('profiles').select('id, plan').eq('stripe_customer_id', customerId).single();
      
      if (profile) {
        if (profile.plan === 'vip') {
          console.log(`🔄 Rinnovo mensile VIP per utente ${profile.id}. Ricarica 120 minuti HD.`);
          // Reset a 120 — si parte da zero ogni mese (come GB telefonici)
          // I Boost acquistati si sommano sopra questo via checkout.session.completed
          await supabase.from('profiles').update({ 
            voice_balance_minutes: 120,
            updated_at: new Date().toISOString()
          }).eq('id', profile.id);
        } else if (profile.plan === 'premium') {
          console.log(`🔄 Rinnovo mensile Premium per utente ${profile.id}. Ricarica 30 minuti voce.`);
          // Reset a 30 — i Boost non vengono azzerati, si sommano
          // Logica: prendiamo il MAX tra 30 e il saldo attuale se l'utente ha Boost non usati
          const { data: currentProfile } = await supabase
            .from('profiles')
            .select('voice_balance_minutes')
            .eq('id', profile.id)
            .single();
          const currentMins = currentProfile?.voice_balance_minutes ?? 0;
          const newMins = Math.max(30, currentMins); // non toglie Boost non usati
          await supabase.from('profiles').update({ 
            voice_balance_minutes: newMins,
            updated_at: new Date().toISOString()
          }).eq('id', profile.id);
        }
      }
    }
  }

  res.status(200).json({ received: true });
}
