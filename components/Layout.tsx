import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';

// Icone Native
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
const MenuIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
const XIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 18L18 6M6 6l12 12"/></svg>;
const MoreIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>;

interface LayoutProps { children: React.ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navTo = (path: string) => { navigate(path); setMobileMenuOpen(false); };

  const goldActive = { color: '#C9A84C' };
  const mutedColor = { color: '#6A6560' };

  // Bottom nav items (5 primary)
  const bottomNav = [
    { path: '/',        icon: <HomeIcon />,    label: 'Home' },
    { path: '/courses', icon: <CoursesIcon />, label: 'Corsi' },
    { path: '/chat',    icon: <ChatIcon />,    label: 'Chat' },
    { path: '/quests',  icon: <QuestsIcon />,  label: 'Quests' },
    { path: '/call',    icon: <CallIcon />,    label: 'Call' },
  ];

  // Full nav for drawer
  const allNav = [
    { group: 'Principale', items: [
      { path: '/',            icon: <HomeIcon />,       label: 'Home' },
      { path: '/quests',      icon: <QuestsIcon />,     label: 'Quests', badge: '3' },
      { path: '/courses',     icon: <CoursesIcon />,    label: 'Courses' },
      { path: '/experiences', icon: <ExpIcon />,        label: 'Experiences' },
    ]},
    { group: 'AI Coach', items: [
      { path: '/chat',    icon: <ChatIcon />,     label: 'Chat' },
      { path: '/council', icon: <CouncilIcon />,  label: 'Il Consiglio', badge: 'VIP' },
      { path: '/call',    icon: <CallIcon />,     label: 'Call' },
    ]},
    { group: 'Percorso', items: [
      { path: '/community',   icon: <CommunityIcon />, label: 'Community' },
      { path: '/my-journey',  icon: <JourneyIcon />,   label: 'My Journey' },
      { path: '/settings',    icon: <SettingsIcon />,  label: 'Settings' },
      { path: '/profile',     icon: <ProfileIcon />,   label: 'Profile' },
    ]},
  ];

  return (
    <div className="app">
      {/* â”€â”€ SIDEBAR (desktop only) â”€â”€ */}
      <aside className="sb hidden lg:flex">
        <div className="sb-logo">
          <div className="sb-logo-row">
            <div className="sb-diamond"></div>
            <div className="sb-name">LUMINEL</div>
          </div>
          <div className="sb-sub">Coach Transformational</div>
        </div>
        
        <nav className="sb-nav">
          <div className="sb-gl">Principale</div>
          <div className={cn("ni", isActive('/') && "on")} onClick={() => navigate('/')}><HomeIcon /> Home</div>
          <div className={cn("ni", isActive('/quests') && "on")} onClick={() => navigate('/quests')}><QuestsIcon /> Quests <span className="ni-badge">3</span></div>
          <div className={cn("ni", isActive('/courses') && "on")} onClick={() => navigate('/courses')}><CoursesIcon /> Courses</div>
          <div className={cn("ni", isActive('/experiences') && "on")} onClick={() => navigate('/experiences')}><ExpIcon /> Experiences</div>

          <div className="sb-gl">AI Coach</div>
          <div className={cn("ni", isActive('/chat') && "on")} onClick={() => navigate('/chat')}><ChatIcon /> Chat</div>
          <div className={cn("ni", isActive('/council') && "on")} onClick={() => navigate('/council')}><CouncilIcon /> Il Consiglio <span className="ni-badge vip">VIP</span></div>
          <div className={cn("ni", isActive('/call') && "on")} onClick={() => navigate('/call')}><CallIcon /> Call</div>

          <div className="sb-gl">Percorso</div>
          <div className={cn("ni", isActive('/community') && "on")} onClick={() => navigate('/community')}><CommunityIcon /> Community</div>
          <div className={cn("ni", isActive('/my-journey') && "on")} onClick={() => navigate('/my-journey')}><JourneyIcon /> My Journey</div>
          
          <div className="mt-auto"></div>
          <div className={cn("ni", isActive('/settings') && "on")} onClick={() => navigate('/settings')}><SettingsIcon /> Settings</div>
          <div className={cn("ni", isActive('/profile') && "on")} onClick={() => navigate('/profile')}><ProfileIcon /> Profile</div>
        </nav>

        <div className="sb-bottom">
          <div className="plan-card">
            <div className="plan-tier">Piano attuale</div>
            <div className="plan-name">{user?.plan === 'vip' ? 'VIP Â· Sovereign' : 'Free Â· Explorer'}</div>
            <button className="plan-btn" onClick={() => navigate('/plans')}>Gestisci â†’</button>
          </div>
        </div>
      </aside>

      {/* â”€â”€ MAIN CONTENT â”€â”€ */}
      <div className="main">
        {/* Ambient orbs */}
        <div className="amb">
          <div className="orb o1"></div>
          <div className="orb o2"></div>
          <div className="orb o3"></div>
        </div>

        {/* TOPBAR â€” desktop tabs */}
        <div className="tb">
          {/* Desktop tabs */}
          <div className="tb-tabs hidden lg:flex">
            <button className={cn("tt", isActive('/') && "on")} onClick={() => navigate('/')}>Home</button>
            <button className={cn("tt", isActive('/chat') && "on")} onClick={() => navigate('/chat')}>Chat AI</button>
            <button className={cn("tt", isActive('/council') && "on")} onClick={() => navigate('/council')}>Il Consiglio</button>
            <button className={cn("tt", isActive('/quests') && "on")} onClick={() => navigate('/quests')}>Quests</button>
          </div>

          {/* Mobile header left: hamburger + logo */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              style={{ width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8, border:'0.5px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'#6A6560' }}>
              {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
            <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <div className="sb-diamond" style={{ width:12, height:12 }}></div>
                <span style={{ fontFamily:"'Cinzel',serif", fontSize:14, letterSpacing:'0.2em', color:'#C9A84C' }}>LUMINEL</span>
              </div>
              <span style={{ fontSize:8, letterSpacing:'0.22em', textTransform:'uppercase', color:'#C9A84C', paddingLeft:19 }}>
                Coach Transformational
              </span>
            </div>
          </div>
          
          <div className="tb-r ml-auto">
            <span className="tb-date hidden lg:inline">
              {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            <div className="tb-av" onClick={() => navigate('/profile')}>
              {user?.user_metadata?.full_name?.charAt(0) || 'M'}
            </div>
          </div>
        </div>

        {/* MOBILE DRAWER MENU */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50"
            style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)' }}
            onClick={() => setMobileMenuOpen(false)}>
            <div
              style={{ position:'absolute', top:0, left:0, width:'72vw', maxWidth:280, height:'100%',
                background:'#09091A', borderRight:'0.5px solid rgba(255,255,255,0.07)',
                padding:'28px 0 100px', overflowY:'auto', display:'flex', flexDirection:'column' }}
              onClick={e => e.stopPropagation()}>
              {/* Logo */}
              <div style={{ padding:'0 20px', marginBottom:28 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <div className="sb-diamond"></div>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:17, letterSpacing:'0.2em', color:'#C9A84C' }}>LUMINEL</span>
                </div>
                <div style={{ fontSize:9, letterSpacing:'0.24em', textTransform:'uppercase', color:'#6A6560', paddingLeft:26 }}>
                  Coach Transformational
                </div>
              </div>
              {/* Nav groups */}
              {allNav.map(group => (
                <div key={group.group}>
                  <div style={{ fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', color:'#6A6560', padding:'12px 20px 5px', opacity:0.55 }}>
                    {group.group}
                  </div>
                  {group.items.map(item => (
                    <div key={item.path}
                      onClick={() => navTo(item.path)}
                      style={{
                        display:'flex', alignItems:'center', gap:11, padding:'10px 20px',
                        fontSize:13, cursor:'pointer', transition:'all .15s',
                        color: isActive(item.path) ? '#C9A84C' : '#6A6560',
                        background: isActive(item.path) ? 'rgba(201,168,76,0.08)' : 'transparent',
                        borderLeft: isActive(item.path) ? '2px solid #C9A84C' : '2px solid transparent',
                      }}>
                      <div style={{ width:16, height:16, flexShrink:0 }}>{item.icon}</div>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span style={{ marginLeft:'auto', fontSize:10, padding:'2px 7px', borderRadius:10,
                          background: item.badge==='VIP' ? 'rgba(155,116,224,0.12)' : 'rgba(201,168,76,0.12)',
                          color: item.badge==='VIP' ? '#9B74E0' : '#C9A84C',
                          border: `0.5px solid ${item.badge==='VIP' ? 'rgba(155,116,224,0.3)' : 'rgba(201,168,76,0.25)'}` }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              {/* Plan card at bottom */}
              <div style={{ marginTop:'auto', padding:'0 12px' }}>
                <div className="plan-card">
                  <div className="plan-tier">Piano attuale</div>
                  <div className="plan-name">{user?.plan === 'vip' ? 'VIP Â· Sovereign' : 'Free Â· Explorer'}</div>
                  <button className="plan-btn" onClick={() => navTo('/plans')}>Gestisci â†’</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW AREA */}
        <div className="view on relative h-full">
          {children}
        </div>
      </div>
      
      {/* â”€â”€ MOBILE BOTTOM NAV â”€â”€ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 w-full z-50"
        style={{ background:'rgba(9,9,26,0.95)', backdropFilter:'blur(24px)',
          borderTop:'0.5px solid rgba(255,255,255,0.07)',
          paddingBottom:'env(safe-area-inset-bottom,8px)' }}>
        <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center', padding:'8px 4px 4px' }}>
          {bottomNav.map(item => {
            const active = isActive(item.path);
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                  padding:'4px 2px', background:'none', border:'none', cursor:'pointer',
                  color: active ? '#C9A84C' : '#6A6560', transition:'color .15s' }}>
                <div style={{ width:22, height:22, position:'relative' }}>
                  {item.icon}
                  {active && (
                    <div style={{ position:'absolute', inset:0, background:'rgba(201,168,76,0.15)',
                      borderRadius:6, filter:'blur(4px)', zIndex:-1 }} />
                  )}
                </div>
                <span style={{ fontSize:10, letterSpacing:'0.03em', fontWeight: active ? 500 : 400,
                  color: active ? '#C9A84C' : '#6A6560' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};


export default Layout;
