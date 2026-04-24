import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';

// Icone Native dal Prototipo (Sostituiscono le mock Heroicons)
const HomeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
const QuestsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>;
const CoursesIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>;
const ExpIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>;
const ChatIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>;
const CouncilIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="3"/><path d="M6 20v-2a6 6 0 0112 0v2"/><circle cx="20" cy="8" r="2"/><circle cx="4" cy="8" r="2"/></svg>;
const CallIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>;
const CommunityIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const JourneyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>;
const SettingsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const ProfileIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>;

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
          <div className={cn("ni", isActive('/') && "on")} onClick={() => navigate('/')}>
            <HomeIcon /> Home
          </div>
          <div className={cn("ni", isActive('/quests') && "on")} onClick={() => navigate('/quests')}>
            <QuestsIcon /> Quests <span className="ni-badge">3</span>
          </div>
          <div className={cn("ni", isActive('/courses') && "on")} onClick={() => navigate('/courses')}>
            <CoursesIcon /> Courses
          </div>
          <div className={cn("ni", isActive('/experiences') && "on")} onClick={() => navigate('/experiences')}>
            <ExpIcon /> Experiences
          </div>

          <div className="sb-gl">AI Coach</div>
          <div className={cn("ni", isActive('/chat') && "on")} onClick={() => navigate('/chat')}>
            <ChatIcon /> Chat
          </div>
          <div className={cn("ni", isActive('/council') && "on")} onClick={() => navigate('/council')}>
            <CouncilIcon /> Il Consiglio <span className="ni-badge vip">VIP</span>
          </div>
          <div className={cn("ni", isActive('/call') && "on")} onClick={() => navigate('/call')}>
            <CallIcon /> Call
          </div>

          <div className="sb-gl">Percorso</div>
          <div className={cn("ni", isActive('/community') && "on")} onClick={() => navigate('/community')}>
            <CommunityIcon /> Community
          </div>
          <div className={cn("ni", isActive('/my-journey') && "on")} onClick={() => navigate('/my-journey')}>
            <JourneyIcon /> My Journey
          </div>
          
          <div className="mt-auto"></div>
          <div className={cn("ni", isActive('/settings') && "on")} onClick={() => navigate('/settings')}>
            <SettingsIcon /> Settings
          </div>
          <div className={cn("ni", isActive('/profile') && "on")} onClick={() => navigate('/profile')}>
            <ProfileIcon /> Profile
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
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--surface)] border-t border-[var(--glass-b)] z-50 px-6 py-3 flex justify-between items-center safe-area-bottom">
        <div onClick={() => navigate('/')} className={cn("flex flex-col items-center gap-1", isActive('/') ? "text-[var(--gold)]" : "text-[var(--muted)]")}>
          <div className="w-5 h-5"><HomeIcon /></div>
        </div>
        <div onClick={() => navigate('/quests')} className={cn("flex flex-col items-center gap-1", isActive('/quests') ? "text-[var(--gold)]" : "text-[var(--muted)]")}>
          <div className="w-5 h-5"><QuestsIcon /></div>
        </div>
        <div onClick={() => navigate('/chat')} className={cn("flex flex-col items-center gap-1", isActive('/chat') ? "text-[var(--gold)]" : "text-[var(--muted)]")}>
          <div className="w-5 h-5"><ChatIcon /></div>
        </div>
        <div onClick={() => navigate('/profile')} className={cn("flex flex-col items-center gap-1", isActive('/profile') ? "text-[var(--gold)]" : "text-[var(--muted)]")}>
          <div className="w-5 h-5"><ProfileIcon /></div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

