import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import UpgradeModal from './UpgradeModal';

const PlansPage: React.FC = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<'premium' | 'vip'>('premium');

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: '€0',
      period: 'per sempre',
      description: 'Per iniziare il tuo viaggio di consapevolezza.',
      features: [
        'Accesso a 3 corsi base',
        '5 pratiche di meditazione',
        'Tracciamento umore base',
        'Accesso community (lettura)'
      ],
      color: 'bg-slate-100 text-slate-800',
      buttonColor: 'bg-slate-200 text-slate-800',
      icon: null
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingCycle === 'monthly' ? '€9.99' : '€99.99',
      period: billingCycle === 'monthly' ? '/mese' : '/anno',
      description: 'Sblocca il tuo potenziale completo.',
      features: [
        'Tutti i corsi Premium',
        'Pratiche illimitate',
        'Statistiche avanzate',
        'Community completa',
        'Nessuna pubblicità'
      ],
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white',
      buttonColor: 'bg-white text-indigo-600',
      popular: true,
      icon: <StarIcon className="w-6 h-6 text-yellow-300" />
    },
    {
      id: 'vip',
      name: 'VIP Coaching',
      price: billingCycle === 'monthly' ? '€19.99' : '€199.99',
      period: billingCycle === 'monthly' ? '/mese' : '/anno',
      description: 'L\'esperienza definitiva con supporto dedicato.',
      features: [
        'Tutto quello incluso in Premium',
        'Corsi VIP esclusivi',
        '1 sessione di coaching mensile',
        'Accesso prioritario ai nuovi contenuti',
        'Badge VIP nel profilo'
      ],
      color: 'bg-gradient-to-br from-rose-500 to-orange-500 text-white',
      buttonColor: 'bg-white text-rose-600',
      icon: <SparklesIcon className="w-6 h-6 text-yellow-100" />
    }
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') return;
    setSelectedPlanType(planId as 'premium' | 'vip');
    setShowUpgradeModal(true);
  };

  return (
    <div className="min-h-screen pb-20">
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        planType={selectedPlanType}
      />

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Scegli il tuo percorso</h1>
        <p className="text-slate-500 max-w-2xl mx-auto mb-8">
          Investi su te stesso con i nostri piani pensati per ogni livello di crescita.
        </p>

        {/* Toggle Billing */}
        <div className="inline-flex items-center bg-white p-1 rounded-full border border-slate-200 shadow-sm">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              billingCycle === 'monthly' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mensile
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              billingCycle === 'yearly' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Annuale <span className="text-[10px] ml-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">-16%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {plans.map((plan, idx) => {
          const isCurrentPlan = user?.plan === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col ${plan.color} ${
                plan.id === 'free' ? 'border border-slate-200 bg-white' : 'shadow-xl'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  PIÙ POPOLARE
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                {plan.icon}
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.id === 'free' ? 'text-slate-500' : 'text-white/80'}`}>
                  {plan.period}
                </span>
              </div>

              <p className={`text-sm mb-8 ${plan.id === 'free' ? 'text-slate-500' : 'text-white/90'}`}>
                {plan.description}
              </p>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.id === 'free' ? 'bg-indigo-100 text-indigo-600' : 'bg-white/20 text-white'
                    }`}>
                      <CheckIcon className="w-3 h-3" />
                    </div>
                    <span className={`text-sm ${plan.id === 'free' ? 'text-slate-600' : 'text-white'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-4 rounded-xl font-bold transition-transform active:scale-95 shadow-lg ${
                  isCurrentPlan 
                    ? 'bg-slate-200 text-slate-500 cursor-default' 
                    : plan.buttonColor
                }`}
              >
                {isCurrentPlan ? 'Piano Attuale' : 'Scegli Piano'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PlansPage;