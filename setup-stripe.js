import Stripe from 'stripe';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Inserisci la tua STRIPE_SECRET_KEY (inizia con sk_test_ o sk_live_): ', async (secretKey) => {
  if (!secretKey || !secretKey.startsWith('sk_')) {
    console.error('\nErrore: Chiave non valida. Deve iniziare con sk_test_ o sk_live_');
    rl.close();
    return;
  }

  const stripe = new Stripe(secretKey.trim(), {
    apiVersion: '2025-02-24.acacia',
  });

  const tiers = [
    { name: 'Luminel Starter', price: 999, description: 'Le fondamenta del metodo Luminel' },
    { name: 'Luminel Premium', price: 4900, description: 'L\'esperienza completa con il Coach AI' },
    { name: 'Luminel VIP', price: 19900, description: 'Accesso esclusivo Sovereign' }
  ];

  console.log('\nCreazione dei prodotti su Stripe in corso...\n');

  const envVars = [];

  try {
    for (const tier of tiers) {
      // Create Product
      const product = await stripe.products.create({
        name: tier.name,
        description: tier.description,
      });

      // Create Price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: tier.price,
        currency: 'eur',
        recurring: { interval: 'month' },
      });

      console.log(`✅ ${tier.name} creato!`);
      
      const envName = `STRIPE_${tier.name.split(' ')[1].toUpperCase()}_PRICE_ID`;
      envVars.push(`${envName}=${price.id}`);
    }

    console.log('\n🎉 PRODOTTI CREATI CON SUCCESSO!\n');
    console.log('Copia e incolla queste 3 righe nelle tue variabili d\'ambiente su Vercel (e nel tuo .env locale se lo usi):\n');
    console.log('----------------------------------------------------');
    envVars.forEach(v => console.log(v));
    console.log('----------------------------------------------------\n');

  } catch (error) {
    console.error('Si è verificato un errore durante la comunicazione con Stripe:', error);
  } finally {
    rl.close();
  }
});
