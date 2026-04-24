import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import EditProfileModal from './EditProfileModal';
import AppPreferencesModal from './AppPreferencesModal';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { streak, xp, weeklyProgress, weeklyGoal } = useProgress();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate('/welcome');
  };

  if (!user) return null;

  // Derived/Mock data for display
  const totalMinutes = Math.floor(xp / 2); // Simulating minutes based on XP
  const movementProgress = 1; // Mock data for movement
  const movementGoal = 3;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Il tuo Profilo</h1>

      {/* Header Card */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-luminel-gold-soft to-luminel-taupe flex items-center justify-center text-5xl text-white font-bold shadow-xl shadow-luminel-gold-soft/30">
          {user.fullName.charAt(0).toLowerCase()}
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">{user.fullName}</h2>
          <p className="text-slate-500 font-medium">beginner • Membro dal 2024</p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-luminel-champagne text-luminel-smoke rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheckIcon className="w-4 h-4" />
            PIANO {user.plan ? user.plan.toUpperCase() : 'FREE'}
          </div>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
        >
          Modifica Profilo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Settings Column */}
        <div className="space-y-6">
          <h3 className="font-bold text-slate-700 text-lg">Impostazioni</h3>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group"
            >
              <div className="p-3 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-all"><UserCircleIcon className="w-6 h-6" /></div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-slate-800">Dati Personali</h4>
                <p className="text-xs text-slate-500 font-medium">Nome, Email, Password</p>
              </div>
            </button>

            <button
              onClick={() => setIsPreferencesModalOpen(true)}
              className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group"
            >
              <div className="p-3 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-all"><Cog6ToothIcon className="w-6 h-6" /></div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-slate-800">Preferenze App</h4>
                <p className="text-xs text-slate-500 font-medium">Notifiche, Tema, Lingua</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/plans')}
              className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group"
            >
              <div className="p-3 bg-luminel-champagne rounded-xl text-luminel-gold-soft group-hover:bg-white group-hover:shadow-sm transition-all"><CreditCardIcon className="w-6 h-6" /></div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-slate-800">Abbonamento</h4>
                <p className="text-xs text-slate-500 font-medium">Gestisci il tuo piano {user.plan || 'free'}</p>
              </div>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-red-500 bg-red-50 hover:bg-red-100 transition-colors font-bold"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" /> Esci
          </button>
        </div>

        {/* Stats Summary Column */}
        <div className="space-y-6">
          <h3 className="font-bold text-slate-700 text-lg">Le tue Statistiche</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
              <div className="text-slate-400"><ChartBarIcon className="w-6 h-6" /></div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{streak}</div>
                <div className="text-xs text-slate-500 font-medium">Giorni Streak</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
              <div className="text-slate-400"><ChartBarIcon className="w-6 h-6" /></div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{totalMinutes}</div>
                <div className="text-xs text-slate-500 font-medium">Minuti Totali</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-2">
              <h4 className="font-bold text-slate-800 mb-6">Obiettivi Settimanali</h4>
              <div className="space-y-6">
                {/* Meditation Goal */}
                <div>
                  <div className="flex justify-between text-xs mb-2 font-medium">
                    <span className="text-slate-500">Meditazione</span>
                    <span className="font-bold text-indigo-600">{weeklyProgress}/{weeklyGoal}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((weeklyProgress / weeklyGoal) * 100, 100)}%` }}
                      className="h-full bg-[#6366F1] rounded-full"
                    />
                  </div>
                </div>

                {/* Movement Goal */}
                <div>
                  <div className="flex justify-between text-xs mb-2 font-medium">
                    <span className="text-slate-500">Movimento</span>
                    <span className="font-bold text-green-600">{movementProgress}/{movementGoal}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(movementProgress / movementGoal) * 100}%` }}
                      className="h-full bg-[#22C55E] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <AppPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;