
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneXMarkIcon, MicrophoneIcon, MicrophoneIcon as MicrophoneSolid, SparklesIcon } from '@heroicons/react/24/solid';
import { supabase } from "../services/supabase";

const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL + "/functions/v1";

interface AICallModalProps {
  onClose: () => void;
}

const AICallModal: React.FC<AICallModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'connecting' | 'listening' | 'processing' | 'speaking' | 'ended'>('connecting');
  const [transcript, setTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [memoryContext, setMemoryContext] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Setup Speech Recognition (microfono)
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
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

          recognitionRef.current.onerror = (event: any) => {
            console.log("Speech error, restarting...", event);
            if (status !== 'ended' && status !== 'speaking') {
              setTimeout(() => {
                try { recognitionRef.current?.start(); } catch(e) {}
              }, 1000);
            }
          };
        }

        setTimeout(() => {
          setStatus('listening');
          startListening();
          speak("Ciao, sono Luminel. Sono qui con te. Dimmi, come ti senti in questo momento?");
        }, 1500);

      } catch (error) {
        console.error("Init error", error);
      }
    };

    init();

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && status !== 'ended') {
      try { recognitionRef.current.start(); } catch (e) {}
    }
  };

  const speak = async (text: string) => {
    if (!text) return;
    setStatus('speaking');

    // Ferma audio precedente
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/luminel-voice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.error === 'accesso_negato') {
          alert('Il Voice Coach HD è esclusivo del piano VIP Sovereign.');
          onClose(); return;
        }
        if (err.error === 'saldo_esaurito') {
          alert('Hai esaurito i tuoi minuti HD. Ricarica dalla Dashboard con un Voice Boost.');
          onClose(); return;
        }
        throw new Error(err.error || 'Errore Edge Function');
      }

      // Aggiorna saldo mostrato (header X-Voice-Balance-Remaining)
      const remaining = res.headers.get('X-Voice-Balance-Remaining');
      if (remaining) console.log(`⏱ Minuti voce rimanenti: ${remaining}`);

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (status !== 'ended') {
          setStatus('listening');
          startListening();
        }
      };

      audio.play();
    } catch (err) {
      console.error('speak() error:', err);
      // Fallback: browser TTS se ElevenLabs non disponibile
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'it-IT';
      utt.onend = () => { setStatus('listening'); startListening(); };
      window.speechSynthesis.speak(utt);
    }
  };

  const handleAIResponse = async (userText: string) => {
    setStatus('processing');

    try {
      // Usa luminel-chat per generare la risposta testuale
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const chatRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/luminel-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          mode: 'voice', // modalità voce = risposte brevi e calde
        }),
      });

      let responseText = "Sono qui con te. Dimmi di più.";
      if (chatRes.ok) {
        const chatData = await chatRes.json();
        responseText = chatData.reply || responseText;
      }

      // Ora sintetizza la risposta con ElevenLabs (via luminel-voice)
      speak(responseText);
    } catch (error) {
      console.error(error);
      speak("Scusami, non ho capito. Puoi ripetere?");
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) recognitionRef.current?.stop();
    else if (status === 'listening') recognitionRef.current?.start();
  };

  return (
    <div style={{ position:"fixed", inset:0, top:0, left:0, right:0, bottom:0, zIndex:9999, background:"#0a0a1a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between", paddingTop:"48px", paddingBottom:"48px", paddingLeft:"24px", paddingRight:"24px" }}>
      <button onClick={onClose} style={{ position:"absolute", top:24, right:24, color:"rgba(255,255,255,0.5)", background:"none", border:"none", cursor:"pointer" }}>
        <PhoneXMarkIcon className="w-8 h-8" />
      </button>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white/80 mb-4 border border-white/5">
          <SparklesIcon className="w-3 h-3" /> Live Session
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Luminel Voice</h2>
        <p className="text-indigo-200 text-sm mt-1 font-medium uppercase tracking-widest">
          {status}
        </p>
      </div>

      {/* Visualizer */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="relative">
          <AnimatePresence>
            {status === 'speaking' && (
              <>
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-indigo-400/30"
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-2xl shadow-indigo-500/40">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative">
               <span className="text-6xl">🌸</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript */}
      {transcript && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="relative z-10 mb-8 text-white/60 text-sm italic text-center max-w-md"
        >
          "{transcript}"
        </motion.p>
      )}

      {/* Controls */}
      <div className="relative z-10 flex items-center gap-8 mb-8">
        <button onClick={toggleMute} className={`p-5 rounded-full transition-all ${isMuted ? 'bg-white text-slate-900' : 'bg-white/10 text-white'}`}>
          {isMuted ? <MicrophoneIcon className="w-7 h-7" /> : <MicrophoneSolid className="w-7 h-7" />}
        </button>
        <button onClick={onClose} className="p-6 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all">
          <PhoneXMarkIcon className="w-9 h-9" />
        </button>
      </div>
    </div>
  );
};

export default AICallModal;
