import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { plan, userId, successUrl, cancelUrl } = req.body;

    if (!plan || !userId) {
      return res.status(400).json({ error: 'Missing plan or userId' });
    }

    // AUTOMAZIONE PREZZI: Dal 1° Settembre 2026 scattano i prezzi a regime
    const isLaunch = Date.now() < new Date('2026-09-01T00:00:00Z').getTime();
    
    let priceId = '';
    let mode: 'subscription' | 'payment' = 'subscription';

    if (plan.startsWith('boost_')) {
      mode = 'payment';
      if (plan === 'boost_1h') priceId = process.env.STRIPE_PRICE_BOOST_1H!;
      else if (plan === 'boost_3h') priceId = process.env.STRIPE_PRICE_BOOST_3H!;
      else if (plan === 'boost_5h') priceId = process.env.STRIPE_PRICE_BOOST_5H!;
    } else {
      if (plan === 'vip') {
        priceId = isLaunch ? process.env.STRIPE_PRICE_VIP_LAUNCH! : process.env.STRIPE_PRICE_VIP_FULL!;
      } else if (plan === 'starter') {
        priceId = isLaunch ? process.env.STRIPE_PRICE_STARTER_LAUNCH! : process.env.STRIPE_PRICE_STARTER_FULL!;
      } else {
        priceId = isLaunch ? process.env.STRIPE_PRICE_PREMIUM_LAUNCH! : process.env.STRIPE_PRICE_PREMIUM_FULL!;
      }
    }

    if (!priceId) {
      return res.status(500).json({ error: 'Stripe Price ID configuration missing for this plan/date' });
    }

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Recupera l'email dell'utente
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    const email = userData?.user?.email;

    if (userError || !email) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        userId,
        plan
      }
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
}
