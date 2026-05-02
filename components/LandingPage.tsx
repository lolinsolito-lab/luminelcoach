import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * LandingPage — wrapper pubblico per LuminelLandingV3
 * - Utente NON loggato → serve la landing HTML statica via iframe
 * - Utente loggato → redirect diretto alla dashboard
 */
const LandingPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

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

  // Utente non loggato → mostriamo l'HTML statico tramite iframe per mantenere l'URL pulito "/"
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#06060F' }}>
      <iframe 
        src="/luminel-landing.html?v=5" 
        title="Luminel Transformational"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
  );
};

export default LandingPage;
