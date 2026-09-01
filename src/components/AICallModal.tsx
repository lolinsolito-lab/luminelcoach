// src/components/AICallModal.tsx
// Voice Coach Modal — Free Demo + Premium Live
// Dark Luxury · Allineato al Metodo Michael Luminels · EU AI Act compliant

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneXMarkIcon, MicrophoneIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { supabase } from "../services/supabase";
import { useNavigate } from 'react-router-dom';

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────────
const DL = {
  void: '#06060F', deep: '#09091A', surface: '#0D0D20',
  gold: '#C9A84C', goldBr: '#EDD980', goldDim: 'rgba(201,168,76,0.12)',
  goldB: 'rgba(201,168,76,0.28)', alch: '#9B74E0',
  white: '#F0EBE0', muted: '#6A6560', glassB: 'rgba(255,255,255,0.07)',
};

const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL + "/functions/v1";

// ── MP3 DEMO: Sostituire con URL Supabase Storage dopo la registrazione
// → Supabase Dashboard → Storage → bucket "audio" → upload "luminel-demo-trailer.mp3"
// → Poi sostituire: const DEMO_TRAILER_URL = "https://byszehdinjlejkzsbwvi.supabase.co/storage/v1/object/public/audio/luminel-demo-trailer.mp3"
const DEMO_TRAILER_URL = "/audio/luminel-demo-trailer.mp3";

// ── SCRIPT DEMO (utilizzato quando il file MP3 non è disponibile)
// Questo è il testo che Michael Luminels deve REGISTRARE per il trailer vocale.
// Tono: caldo, profondo, assertivo — Metodo Michael Luminels — nessuna emoji.
const DEMO_TTS_SCRIPT = [
  "Benvenuto. Sono Luminel.",
  "Non sono un chatbot. Sono uno specchio.",
  "Quello che stai per sentire è solo un assaggio.",
  "Con il piano Premium, avrai trenta minuti al mese con la mia voce reale.",
  "Una domanda, e poi ti lascio andare.",
  "In questo preciso momento — cosa stai evitando di guardare?",
  "Questa è la voce di Luminel. Il resto lo costruiamo insieme.",
].join(' ');

// ── STATUS LABELS ITALIANI ─────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
  connecting: 'Connessione...',
  listening: 'In ascolto',
  processing: 'Elaboro...',
  speaking: 'Luminel sta parlando',
  ended: 'Sessione terminata',
};

interface AICallModalProps {
  onClose: () => void;
  plan?: string;
}

// ── WAVEFORM COMPONENT ────────────────────────────────────────────────────────
const LuminelOrb: React.FC<{ status: string }> = ({ status }) => {
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';

  return (
    <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Pulse rings when speaking */}
      <AnimatePresence>
        {isSpeaking && [0, 0.4, 0.8].map((delay, i) => (
          <motion.div key={i}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.2 + i * 0.3, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `0.5px solid ${DL.goldB}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Listening ring */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -12, borderRadius: '50%',
              border: `1px solid ${DL.goldB}`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Core orb */}
      <div style={{
        width: 128, height: 128, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${DL.goldDim}, rgba(6,6,15,0.9))`,
        border: `0.5px solid ${DL.goldB}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: isSpeaking ? `0 0 60px ${DL.goldDim}, 0 0 120px rgba(201,168,76,0.06)` : 'none',
        transition: 'box-shadow 0.5s ease',
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, color: DL.gold, fontWeight: 300 }}>L</span>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
const AICallModal: React.FC<AICallModalProps> = ({ onClose, plan = 'free' }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'connecting' | 'listening' | 'processing' | 'speaking' | 'ended'>('connecting');
  const [transcript, setTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [demoEnded, setDemoEnded] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const statusRef = useRef(status);
  statusRef.current = status;

  const isFreeOrStarter = plan === 'free' || plan === 'starter';

  // ── Check voce TTS disponibile ─────────────────────────────────────────────
  useEffect(() => {
    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const itVoice = voices.find(v => v.lang.startsWith('it'));
      setVoiceAvailable(!!itVoice);
    };
    checkVoices();
    window.speechSynthesis.onvoiceschanged = checkVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Setup Speech Recognition (solo per Premium/VIP live)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && !isFreeOrStarter) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'it-IT';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onstart = () => setStatus('listening');
      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleAIResponse(text);
      };
      recognitionRef.current.onerror = () => {
        if (statusRef.current !== 'ended' && statusRef.current !== 'speaking') {
          setTimeout(() => { try { recognitionRef.current?.start(); } catch (e) {} }, 1200);
        }
      };
    }

    // Avvio dopo breve pausa per effetto "connessione"
    const timer = setTimeout(() => {
      if (isFreeOrStarter) {
        startDemoMode();
      } else {
        setStatus('listening');
        startListening();
        speakLive("Bentornato. Sono Luminel. Come posso illuminare il tuo percorso oggi?");
      }
    }, 1800);

    return () => {
      clearTimeout(timer);
      recognitionRef.current?.stop();
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      window.speechSynthesis.cancel();
    };
  }, []);

  // ── DEMO MODE ──────────────────────────────────────────────────────────────
  const startDemoMode = () => {
    setStatus('speaking');

    // Prima prova il file MP3 preregistrato (€0 in hosting, massima qualità)
    const audio = new Audio(DEMO_TRAILER_URL);
    audioRef.current = audio;

    audio.onended = () => {
      setStatus('ended');
      setDemoEnded(true);
    };

    audio.play().catch(() => {
      // MP3 non ancora disponibile → usa il TTS del browser con lo script ufficiale
      // ⚠️ Nota per Michael Luminels: registrare DEMO_TTS_SCRIPT e caricare come MP3
      playTTSDemo();
    });
  };

  const playTTSDemo = () => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(DEMO_TTS_SCRIPT);
    utt.lang = 'it-IT';
    utt.rate = 0.88;   // leggermente più lento — tono riflessivo
    utt.pitch = 0.95;  // leggermente più basso — autorevolezza
    utt.volume = 1;

    // Cerca la voce italiana migliore disponibile
    const voices = window.speechSynthesis.getVoices();
    const itVoice = voices.find(v => v.lang === 'it-IT' && v.localService)
                  || voices.find(v => v.lang.startsWith('it'));
    if (itVoice) utt.voice = itVoice;

    utt.onstart = () => setStatus('speaking');
    utt.onend = () => {
      setStatus('ended');
      setDemoEnded(true);
    };
    utt.onerror = () => {
      setStatus('ended');
      setDemoEnded(true);
    };

    synthRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  // ── LIVE MODE (Premium/VIP) ────────────────────────────────────────────────
  const startListening = () => {
    if (recognitionRef.current && statusRef.current !== 'ended') {
      try { recognitionRef.current.start(); } catch (e) {}
    }
  };

  const speakLive = async (text: string) => {
    if (!text) return;
    setStatus('speaking');
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/luminel-voice`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.error === 'accesso_negato') { alert('Il Voice Coach live richiede il piano Premium.'); onClose(); return; }
        if (err.error === 'saldo_esaurito') { alert('Hai esaurito i minuti voce del mese. Acquista un Voice Boost dalla Dashboard.'); onClose(); return; }
        throw new Error(err.error || 'Errore Edge Function');
      }

      const remaining = res.headers.get('X-Voice-Balance-Remaining');
      if (remaining) console.log(`⏱ Minuti voce rimanenti: ${remaining}`);

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(audioUrl); if (statusRef.current !== 'ended') { setStatus('listening'); startListening(); } };
      audio.play();
    } catch {
      // Fallback TTS browser
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'it-IT'; utt.rate = 0.9; utt.pitch = 0.95;
      const itVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('it'));
      if (itVoice) utt.voice = itVoice;
      utt.onend = () => { if (statusRef.current !== 'ended') { setStatus('listening'); startListening(); } };
      window.speechSynthesis.speak(utt);
    }
  };

  const handleAIResponse = async (userText: string) => {
    setStatus('processing');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/luminel-chat`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, mode: 'voice' }),
      });
      const data = res.ok ? await res.json() : null;
      speakLive(data?.reply || "Sono qui con te. Dimmi di più.");
    } catch {
      speakLive("Scusami, non ho capito. Puoi ripetere?");
    }
  };

  const toggleMute = () => {
    setIsMuted(m => !m);
    if (!isMuted) recognitionRef.current?.stop();
    else if (statusRef.current === 'listening') recognitionRef.current?.start();
  };

  const handleUpgrade = () => { onClose(); navigate('/plans'); };
  const handleClose = () => { window.speechSynthesis.cancel(); onClose(); };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: DL.void,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
      padding: '48px 24px',
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'rgba(201,168,76,0.04)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'rgba(155,116,224,0.05)', filter: 'blur(100px)' }} />
      </div>

      {/* Close */}
      <button onClick={handleClose} style={{ position: 'absolute', top: 24, right: 24, color: DL.muted, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.color = DL.white)} onMouseLeave={e => (e.currentTarget.style.color = DL.muted)}>
        <PhoneXMarkIcon style={{ width: 28, height: 28 }} />
      </button>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 20, background: DL.goldDim, border: `0.5px solid ${DL.goldB}`, marginBottom: 16 }}>
          <SparklesIcon style={{ width: 12, height: 12, color: DL.gold }} />
          <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: DL.gold }}>
            {isFreeOrStarter ? 'Demo Voice Coach' : 'Voice Coach · Live'}
          </span>
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: DL.white, margin: 0 }}>Luminel</h2>
        <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: DL.muted, marginTop: 6 }}>
          {STATUS_LABELS[status] || status}
        </p>
      </div>

      {/* Orb */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LuminelOrb status={status} />
      </div>

      {/* Transcript (solo live mode) */}
      <AnimatePresence>
        {transcript && !isFreeOrStarter && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'relative', zIndex: 1, color: 'rgba(240,235,224,0.45)', fontSize: 13, fontStyle: 'italic', textAlign: 'center', maxWidth: 340, marginBottom: 16 }}>
            "{transcript}"
          </motion.p>
        )}
      </AnimatePresence>

      {/* Demo ended — CTA upgrade */}
      <AnimatePresence>
        {demoEnded && isFreeOrStarter && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: 16, maxWidth: 320 }}>
            <p style={{ color: 'rgba(240,235,224,0.6)', fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
              Questa era solo un'anticipazione.<br />
              La vera sessione ti aspetta.
            </p>
            <button onClick={handleUpgrade}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                background: DL.gold, border: 'none', color: DL.void,
                fontWeight: 600, fontSize: 13, letterSpacing: '0.04em',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = DL.goldBr)}
              onMouseLeave={e => (e.currentTarget.style.background = DL.gold)}>
              Scopri il piano Premium
              <ArrowRightIcon style={{ width: 14, height: 14 }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Mute (solo live mode) */}
        {!isFreeOrStarter && (
          <button onClick={toggleMute}
            style={{
              width: 52, height: 52, borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s',
              background: isMuted ? DL.goldDim : DL.glassB,
              border: `0.5px solid ${isMuted ? DL.goldB : 'rgba(255,255,255,0.1)'}`,
              color: isMuted ? DL.gold : DL.muted, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <MicrophoneIcon style={{ width: 22, height: 22 }} />
          </button>
        )}

        {/* Hang up */}
        <button onClick={handleClose}
          style={{
            width: 64, height: 64, borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s',
            background: '#C0392B', border: 'none', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(192,57,43,0.4)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#E74C3C')}
          onMouseLeave={e => (e.currentTarget.style.background = '#C0392B')}>
          <PhoneXMarkIcon style={{ width: 28, height: 28 }} />
        </button>
      </div>

      {/* Footer */}
      <p style={{ position: 'relative', zIndex: 1, fontSize: 10, color: DL.muted, marginTop: 16, opacity: 0.5 }}>
        Sistema AI · Luminel Voice Coach · Non sostituisce supporto professionale
      </p>
    </div>
  );
};

export default AICallModal;
