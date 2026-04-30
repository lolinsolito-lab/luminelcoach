
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneXMarkIcon, MicrophoneIcon, MicrophoneIcon as MicrophoneSolid, SparklesIcon } from '@heroicons/react/24/solid';
import { GoogleGenAI } from "@google/genai";
import { LUMINEL_SYSTEM_PROMPT as LUMINEL_SYSTEM_INSTRUCTION } from '../lib/coach/system-prompt';
import { supabase } from "../services/supabase";

interface AICallModalProps {
  onClose: () => void;
}

const AICallModal: React.FC<AICallModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'connecting' | 'listening' | 'processing' | 'speaking' | 'ended'>('connecting');
  const [transcript, setTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const currentMonth = new Date().toISOString().slice(0, 7);
          const { data: profile } = await supabase
            .from('profiles')
            .select('monthly_voice_count, last_voice_month, plan')
            .eq('id', user.id)
            .single();

          const count = profile?.last_voice_month === currentMonth 
            ? (profile?.monthly_voice_count ?? 0) 
            : 0;

          if (profile?.plan !== 'vip' && count >= 1) {
            alert('Hai già usato la tua demo vocale del mese. Passa a VIP per accesso illimitato.');
            onClose();
            return;
          }

          await supabase.from('profiles').upsert({
            id: user.id,
            monthly_voice_count: count + 1,
            last_voice_month: currentMonth,
            updated_at: new Date().toISOString(),
          });
        }

        aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Fix for TypeScript error: Property 'SpeechRecognition' does not exist on type 'Window'
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
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && status !== 'ended') {
      try { recognitionRef.current.start(); } catch (e) {}
    }
  };

  const speak = (text: string) => {
    if (!text) return;
    setStatus('speaking');
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = 0.95;
    
    const voices = synthesisRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang === 'it-IT' && v.name.includes('Google')) || voices.find(v => v.lang === 'it-IT');
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      if (status !== 'ended') {
        setStatus('listening');
        startListening();
      }
    };

    synthesisRef.current.speak(utterance);
  };

  const handleAIResponse = async (userText: string) => {
    setStatus('processing');
    if (!aiRef.current) return;

    try {
      // Updated to use the correct method from @google/genai
      const response = await aiRef.current.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userText,
        config: {
          systemInstruction: LUMINEL_SYSTEM_INSTRUCTION + "\n\nIMPORTANTE: Rispondi in VOCE. Sii breve (max 2 frasi), empatica e calda. Usa linguaggio parlato."
        }
      });

      // Updated to use the correct property access
      const responseText = response.text || "";
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
