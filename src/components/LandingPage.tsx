import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * LandingPage — wrapper per la Landing Page statica (LuminelLandingV4)
 * - Gestisce i redirect per utente loggato
 * - Ascolta i messaggi di postMessage dall'iframe per effettuare routing client-side (es: login, piani, onboarding)
 */
const LandingPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Puoi aggiungere controlli di sicurezza sull'origin se necessario
      if (event.data && event.data.type === 'NAVIGATE' && event.data.path) {
        navigate(event.data.path);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#06060F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', animation: 'pulse 1.5s infinite' }} />
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#06060F' }}>
      <iframe 
        src="/luminel-landing.html?v=7" 
        title="Luminel Transformational"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
  );
};

export default LandingPage;
