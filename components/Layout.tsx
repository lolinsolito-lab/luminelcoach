import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  UserIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  AcademicCapIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { id: '/', icon: <HomeIcon className="w-6 h-6" />, label: 'Home' },
    { id: '/quests', icon: <RocketLaunchIcon className="w-6 h-6" />, label: 'Quests' },
    { id: '/courses', icon: <AcademicCapIcon className="w-6 h-6" />, label: 'Courses' },
    { id: '/experiences', icon: <SparklesIcon className="w-6 h-6" />, label: 'Experiences' },
    { id: '/chat', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, label: 'Chat' },
    { id: '/call', icon: <PhoneIcon className="w-6 h-6" />, label: 'Call' },
    { id: '/community', icon: <UserGroupIcon className="w-6 h-6" />, label: 'Community' },
    { id: '/my-journey', icon: <ChartBarIcon className="w-6 h-6" />, label: 'My Journey' },
    { id: '/settings', icon: <Cog6ToothIcon className="w-6 h-6" />, label: 'Settings' },
    { id: '/profile', icon: <UserIcon className="w-6 h-6" />, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-luminel-smoke font-sans">
      {/* Sidebar for Desktop - Luxury Wellness */}
      <aside className="hidden md:flex flex-col w-72 h-full bg-luminel-champagne border-r border-luminel-taupe/20 z-20 shadow-sm">

        <div className="p-8 pb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {/* Custom Diamond Icon - Soft Gold */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-luminel-gold-soft rotate-45 rounded-sm"></div>
                <div className="absolute inset-2 border border-luminel-gold-soft/60 rotate-45 rounded-sm"></div>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-serif font-medium text-luminel-gold-soft tracking-widest leading-none">
                  LUMINEL
                </span>
                <span className="text-[0.6rem] font-sans font-bold text-luminel-taupe tracking-[0.2em] uppercase mt-1">
                  Coach Transformational
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  "group relative w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300",
                  active
                    ? "text-luminel-smoke bg-white shadow-md"
                    : "text-slate-600 hover:bg-white/60 hover:text-luminel-smoke hover:shadow-sm"
                )}
              >
                {/* Icona */}
                <div className={cn(
                  "transition-colors duration-300 w-6 h-6 flex items-center justify-center",
                  active ? "text-luminel-gold-soft" : "text-slate-500 group-hover:text-luminel-gold-soft"
                )}>
                  {item.icon}
                </div>

                {/* Label */}
                <span className={cn(
                  "font-semibold text-base tracking-tight transition-all duration-300",
                  active ? "text-luminel-smoke" : "text-slate-700 group-hover:text-luminel-smoke"
                )}>
                  {item.label}
                </span>

                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-luminel-gold-soft rounded-r-full shadow-[0_0_10px_rgba(214,194,155,0.4)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Upgrade Card (Bottom) */}
        {user?.plan === 'free' && (
          <div className="p-6 mt-auto">
            <div className="relative p-5 rounded-3xl bg-gradient-to-br from-luminel-gold-soft to-luminel-taupe text-luminel-smoke shadow-xl shadow-luminel-gold-soft/20 overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300" onClick={() => navigate('/plans')}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-2xl opacity-30 -mr-10 -mt-10 group-hover:opacity-50 transition-opacity"></div>

              <p className="relative z-10 text-xs font-medium text-luminel-smoke/70 mb-1 uppercase tracking-wider">Piano Free</p>
              <h4 className="relative z-10 font-bold text-lg mb-4 text-luminel-smoke">Sblocca Tutto</h4>
              <button
                className="relative z-10 w-full py-3 bg-white text-luminel-smoke rounded-xl text-xs font-bold hover:bg-luminel-porcelain transition-colors shadow-lg"
              >
                Diventa Premium
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-white">
        {/* Background decorative blobs - Luxury Wellness */}
        <div className="fixed top-0 left-64 w-full h-96 bg-gradient-to-b from-luminel-champagne/30 to-transparent pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-luminel-gold-soft/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-luminel-champagne/95 backdrop-blur-lg border-t border-luminel-taupe/20 z-50 px-6 py-3 flex justify-between items-center safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const active = isActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={cn(
                "relative flex flex-col items-center gap-1 p-2 transition-colors",
                active ? "text-luminel-gold-soft" : "text-luminel-taupe"
              )}
            >
              {active && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute -top-3 w-8 h-1 bg-luminel-gold-soft rounded-full shadow-[0_0_8px_rgba(214,194,155,0.5)]"
                />
              )}
              {React.cloneElement(item.icon as React.ReactElement, { className: "w-6 h-6" })}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Layout;
