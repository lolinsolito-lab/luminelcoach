import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  UserIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  RocketLaunchIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="app">
      {/* ── SIDEBAR ── */}
      <aside className="sb hidden md:flex">
        <div className="sb-logo">
          <div className="sb-logo-row">
            <div className="sb-diamond"></div>
            <div className="sb-name">LUMINEL</div>
          </div>
          <div className="sb-sub">Coach Transformational</div>
        </div>
        
        <nav className="sb-nav">
          <div className="sb-gl">Principale</div>
          <div 
            className={cn("ni", isActive('/') && "on")} 
            onClick={() => navigate('/')}
          >
            <HomeIcon /> Home
          </div>
          <div 
            className={cn("ni", isActive('/quests') && "on")} 
            onClick={() => navigate('/quests')}
          >
            <RocketLaunchIcon /> Quests <span className="ni-badge">3</span>
          </div>
          <div 
            className={cn("ni", isActive('/courses') && "on")} 
            onClick={() => navigate('/courses')}
          >
            <AcademicCapIcon /> Courses
          </div>
          <div 
            className={cn("ni", isActive('/experiences') && "on")} 
            onClick={() => navigate('/experiences')}
          >
            <SparklesIcon /> Experiences
          </div>

          <div className="sb-gl">AI Coach</div>
          <div 
            className={cn("ni", isActive('/chat') && "on")} 
            onClick={() => navigate('/chat')}
          >
            <ChatBubbleLeftRightIcon /> Chat
          </div>
          <div 
            className={cn("ni", isActive('/council') && "on")} 
            onClick={() => navigate('/council')}
          >
            <UserGroupIcon /> Il Consiglio <span className="ni-badge vip">VIP</span>
          </div>
          <div 
            className={cn("ni", isActive('/call') && "on")} 
            onClick={() => navigate('/call')}
          >
            <PhoneIcon /> Call
          </div>

          <div className="sb-gl">Percorso</div>
          <div 
            className={cn("ni", isActive('/community') && "on")} 
            onClick={() => navigate('/community')}
          >
            <UserGroupIcon /> Community
          </div>
          <div 
            className={cn("ni", isActive('/my-journey') && "on")} 
            onClick={() => navigate('/my-journey')}
          >
            {/* Using a generic icon for journey as an alternative */}
            <AcademicCapIcon /> My Journey
          </div>
          
          <div className="mt-auto"></div>
          <div 
            className={cn("ni", isActive('/settings') && "on")} 
            onClick={() => navigate('/settings')}
          >
            <Cog6ToothIcon /> Settings
          </div>
          <div 
            className={cn("ni", isActive('/profile') && "on")} 
            onClick={() => navigate('/profile')}
          >
            <UserIcon /> Profile
          </div>
        </nav>

        <div className="sb-bottom">
          <div className="plan-card">
            <div className="plan-tier">Piano attuale</div>
            <div className="plan-name">{user?.plan === 'vip' ? 'VIP · Sovereign' : 'Free · Explorer'}</div>
            <button className="plan-btn" onClick={() => navigate('/plans')}>Gestisci →</button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="main">
        {/* Ambient orbs */}
        <div className="amb">
          <div className="orb o1"></div>
          <div className="orb o2"></div>
          <div className="orb o3"></div>
        </div>

        {/* TOPBAR */}
        <div className="tb">
          <div className="tb-tabs hidden md:flex">
            <button className={cn("tt", isActive('/') && "on")} onClick={() => navigate('/')}>Home</button>
            <button className={cn("tt", isActive('/chat') && "on")} onClick={() => navigate('/chat')}>Chat AI</button>
            <button className={cn("tt", isActive('/council') && "on")} onClick={() => navigate('/council')}>Il Consiglio</button>
            <button className={cn("tt", isActive('/quests') && "on")} onClick={() => navigate('/quests')}>Quests</button>
          </div>
          
          <div className="tb-r ml-auto">
            <span className="tb-date hidden md:inline">
              {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <div className="tb-av" onClick={() => navigate('/profile')}>
              {user?.user_metadata?.full_name?.charAt(0) || 'M'}
            </div>
          </div>
        </div>

        {/* VIEW AREA */}
        <div className="view on relative h-full">
          {children}
        </div>
      </div>
      
      {/* ── MOBILE BOTTOM NAV ── */}
      {/* For MVP we keep a simple tailwind nav for mobile as in previous implementation but styled dark */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--surface)] border-t border-[var(--glass-b)] z-50 px-6 py-3 flex justify-between items-center safe-area-bottom">
        <div onClick={() => navigate('/')} className={cn("flex flex-col items-center gap-1", isActive('/') ? "text-[var(--gold)]" : "text-[var(--muted)]")}>
          <HomeIcon className="w-5 h-5" />
        </div>
        <div onClick={() => navigate('/quests')} className={cn("flex flex-col items-center gap-1", isActive('/quests') ? "text-[var(--gold)]" : "text-[var(--muted)]")}>
          <RocketLaunchIcon className="w-5 h-5" />
        </div>
        <div onClick={() => navigate('/chat')} className={cn("flex flex-col items-center gap-1", isActive('/chat') ? "text-[var(--gold)]" : "text-[var(--muted)]")}>
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
        </div>
        <div onClick={() => navigate('/profile')} className={cn("flex flex-col items-center gap-1", isActive('/profile') ? "text-[var(--gold)]" : "text-[var(--muted)]")}>
          <UserIcon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default Layout;
