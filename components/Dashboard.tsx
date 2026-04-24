import React from 'react';
import { motion } from 'framer-motion';
import {
  FireIcon,
  TrophyIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Components
import LuminelInsightCard from './dashboard/LuminelInsightCard';
import QuickStatsCard from './dashboard/QuickStatsCard';
import ProgressChart from './dashboard/ProgressChart';
import TodayFocus from './dashboard/TodayFocus';
import ActiveCourses from './dashboard/ActiveCourses';
import RecommendedContent from './dashboard/RecommendedContent';
import QuickActions from './dashboard/QuickActions';
import CommunityPulse from './dashboard/CommunityPulse';
import EmotionalCheckin from './dashboard/EmotionalCheckin';
import AICompanion from './dashboard/AICompanion';
import TransformationInsights from './dashboard/TransformationInsights';
import GrowthJourneyMap from './dashboard/GrowthJourneyMap';
import SakuraEffect from './SakuraEffect';

const Dashboard: React.FC = () => {
  // Mock user data - in real app would come from context/auth
  const user = {
    name: "Alex",
    streak: 12,
    level: 5,
    totalMinutes: 340,
    communityRank: 8
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <SakuraEffect />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luminel-lavender-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-luminel-sage-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* === HERO SECTION === */}
        <div className="space-y-6 mb-16">
          {/* Emotional Check-in */}
          <EmotionalCheckin />

          {/* Luminel Insight Card */}
          <LuminelInsightCard userName={user.name} />
        </div>

        {/* === QUICK STATS === */}
        <div className="mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <QuickStatsCard title="Giorni di Fila" value={user.streak} icon={<FireIcon className="w-6 h-6" />} color="gold" trend={{ value: 2, isPositive: true }} delay={0.1} />
            <QuickStatsCard title="Livello Attuale" value={`Lvl ${user.level}`} icon={<TrophyIcon className="w-6 h-6" />} color="lavender" delay={0.2} />
            <QuickStatsCard title="Minuti Totali" value={user.totalMinutes} icon={<ClockIcon className="w-6 h-6" />} color="sage" trend={{ value: 15, isPositive: true }} delay={0.3} />
            <QuickStatsCard title="Community Rank" value={`#${user.communityRank}`} icon={<UserGroupIcon className="w-6 h-6" />} color="blue" trend={{ value: 3, isPositive: true }} delay={0.4} />
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-16">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-luminel-gold-soft/20" />
          </div>
        </div>

        {/* === TODAY'S FOCUS & JOURNEY MAP === */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <span className="text-4xl">🌳</span>
              Il Tuo Percorso Oggi
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Today's Focus */}
            <div className="order-2 lg:order-1">
              <TodayFocus />
            </div>

            {/* Right: Growth Journey Map */}
            <div className="order-1 lg:order-2">
              <GrowthJourneyMap />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-16">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-luminel-gold-soft/20" />
          </div>
        </div>

        {/* === YOUR COURSES === */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <span className="text-4xl">📚</span>
              I Tuoi Corsi
            </h2>
          </div>

          <div className="space-y-8">
            <ActiveCourses />
            <RecommendedContent />
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-16">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-luminel-gold-soft/20" />
          </div>
        </div>

        {/* === TRANSFORMATION INSIGHTS === */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <span className="text-4xl">✨</span>
              La Tua Trasformazione
            </h2>
            <div className="hidden md:block px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <span className="text-sm font-bold text-green-600">+18% questa settimana</span>
            </div>
          </div>

          <TransformationInsights />
        </div>

        {/* Divider */}
        <div className="relative mb-16">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-luminel-gold-soft/20" />
          </div>
        </div>

        {/* === QUICK ACTIONS === */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <span className="text-4xl">⚡</span>
              Azioni Rapide
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <QuickActions />
            </div>
            <div className="lg:col-span-1">
              <CommunityPulse />
            </div>
          </div>
        </div>

        {/* AI Companion */}
        <AICompanion />

      </div>
    </div>
  );
};

export default Dashboard;
