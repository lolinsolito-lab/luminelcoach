import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!isStandaloneMode);

    if (isStandaloneMode) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // For iOS, there is no beforeinstallprompt. We manually show it after a delay if not standalone.
      const hasSeenPrompt = localStorage.getItem('luminel_pwa_prompt_seen');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 5000); // show after 5s
      }
    }

    // Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const hasSeenPrompt = localStorage.getItem('luminel_pwa_prompt_seen');
      if (!hasSeenPrompt) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        localStorage.setItem('luminel_pwa_prompt_seen', 'true');
      }
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('luminel_pwa_prompt_seen', 'true');
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: 400,
          background: '#09091A',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: 16,
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 4 }}>
              Esperienza Nativa
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: '#F0EBE0', lineHeight: 1.1 }}>
              Installa Luminel
            </h3>
          </div>
          <button onClick={handleClose} style={{ color: '#6A6560', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>
            &times;
          </button>
        </div>
        
        <p style={{ fontSize: 13, color: 'rgba(240,235,224,0.7)', lineHeight: 1.4 }}>
          {isIOS 
            ? 'Tocca l\'icona Condividi in basso e seleziona "Aggiungi alla schermata Home" per un\'esperienza immersiva.' 
            : 'Per l\'esperienza completa del Metodo Luminels, installa l\'App sulla tua Home.'}
        </p>

        {!isIOS && (
          <button
            onClick={handleInstallClick}
            style={{
              marginTop: 8,
              background: 'rgba(201,168,76,0.1)',
              border: '0.5px solid #C9A84C',
              color: '#C9A84C',
              padding: '10px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '.1em'
            }}
          >
            Installa Ora
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
