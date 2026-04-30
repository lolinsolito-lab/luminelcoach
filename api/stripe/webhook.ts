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
      console.log(`✅ Pagamento completato per utente ${userId}. Upgrade a ${plan}.`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ plan, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error("Errore aggiornamento profilo Supabase:", error);
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    // Qui andrebbe gestito il downgrade a 'free' quando l'abbonamento scade o viene annullato
    // Per trovarlo, occorre o mappare il customer_id di Stripe al nostro utente,
    // o passare un metadata nell'abbonamento. Per ora lo ignoriamo o facciamo in base all'email se la abbiamo.
    console.log(`❌ Abbonamento cancellato: ${subscription.id}`);
  }

  res.status(200).json({ received: true });
}
