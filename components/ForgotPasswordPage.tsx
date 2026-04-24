
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 font-medium"
        >
            <ArrowLeftIcon className="w-4 h-4" /> Torna al Login
        </button>

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center"
        >
          {isSent ? (
            <div className="py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Controlla la tua email</h2>
              <p className="text-slate-500 mb-6">
                Abbiamo inviato un link di recupero a <strong>{email}</strong>
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl"
              >
                Torna al Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Dimenticata?</h2>
              <p className="text-slate-500 mb-8">
                Nessun problema. Inserisci la tua email e ti invieremo le istruzioni per reimpostarla.
              </p>

              <div className="text-left mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    placeholder="nome@esempio.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-70"
              >
                {isLoading ? 'Invio in corso...' : 'Invia Istruzioni'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
