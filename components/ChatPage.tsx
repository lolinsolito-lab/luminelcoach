
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  SparklesIcon,
  PlusIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { LUMINEL_SYSTEM_PROMPT as LUMINEL_SYSTEM_INSTRUCTION } from '../lib/coach/system-prompt';
import { ChatMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ChatIntroDemo from './ChatIntroDemo';

// --- INTERNAL COMPONENTS ---

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-luminel-champagne to-white flex items-center justify-center mr-3 flex-shrink-0 border border-white shadow-sm">
          <span className="text-sm font-bold text-luminel-gold-soft">L</span>
        </div>
      )}
      <div
        className={`max-w-[80%] md:max-w-[70%] p-5 rounded-2xl shadow-sm relative transition-all duration-300 ${isUser
          ? 'bg-[#E8F5E9] text-emerald-900 rounded-tr-none shadow-sm border border-emerald-100/50'
          : 'bg-white text-slate-700 rounded-tl-none border border-white shadow-slate-200/50'
          }`}
      >
        <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed font-medium">
          {message.text}
        </p>
        <span className={`text-[10px] mt-2 block font-medium opacity-70 ${isUser ? 'text-emerald-700' : 'text-slate-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start mb-6">
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-luminel-champagne to-white flex items-center justify-center mr-3 flex-shrink-0 border border-white shadow-sm">
      <span className="text-sm font-bold text-luminel-gold-soft">L</span>
    </div>
    <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-white shadow-sm flex gap-2 items-center">
      <div className="w-2 h-2 bg-luminel-gold-soft rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
      <div className="w-2 h-2 bg-luminel-gold-soft rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      <div className="w-2 h-2 bg-luminel-gold-soft rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const ChatPage: React.FC = () => {
  const { user } = useAuth();

  // States
  const [showIntro, setShowIntro] = useState(() => {
    const saved = localStorage.getItem('luminel_chat_intro_seen');
    return saved !== 'true';
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string>('new');
  const [messageCount, setMessageCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Limits based on plan
  const getDailyLimit = () => {
    if (user?.plan === 'vip') return 9999;
    if (user?.plan === 'premium') return 50;
    return 10; // Free
  };

  const limit = getDailyLimit();

  // Save intro seen state
  const handleIntroComplete = () => {
    localStorage.setItem('luminel_chat_intro_seen', 'true');
    setShowIntro(false);
  };

  // Initialize Chat Session
  useEffect(() => {
    if (!user || showIntro) return;

    const initChat = async () => {
      try {
        // Safe check for API key - in Vite use import.meta.env
        const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || '';

        if (apiKey) {
          const ai = new GoogleGenAI({ apiKey });
          const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction: LUMINEL_SYSTEM_INSTRUCTION },
          });
          setChatSession(chat);
        } else {
          console.warn("No API key found, running in mock mode");
        }

        if (messages.length === 0) {
          const greeting: ChatMessage = {
            id: 'init',
            role: 'model',
            text: `Ciao ${user?.fullName?.split(' ')[0] || 'Viaggiatore'}. Sono Luminel. Come posso illuminare il tuo percorso oggi?`,
            timestamp: new Date()
          };
          setMessages([greeting]);
        }
      } catch (error) {
        console.error("Failed to init chat", error);
        // Still set greeting even if init fails
        if (messages.length === 0) {
          setMessages([{
            id: 'init-fallback',
            role: 'model',
            text: `Ciao. Sono Luminel. Come posso aiutarti oggi?`,
            timestamp: new Date()
          }]);
        }
      }
    };

    initChat();
  }, [user, showIntro]);

  // Mock function to simulate loading an old conversation
  const loadConversation = (id: string) => {
    setActiveConversationId(id);
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (id === 'new') {
        setMessages([{
          id: 'init-new',
          role: 'model',
          text: `Ciao ${user?.fullName?.split(' ')[0] || 'Viaggiatore'}. Sono Luminel. Come posso illuminare il tuo percorso oggi?`,
          timestamp: new Date()
        }]);
      } else if (id === 'anxiety') {
        setMessages([
          { id: '1', role: 'user', text: 'Ho bisogno di aiuto per gestire l\'ansia prima di una riunione.', timestamp: new Date(Date.now() - 86400000) },
          { id: '2', role: 'model', text: 'Capisco perfettamente. L\'ansia da prestazione è molto comune. Proviamo una tecnica di respirazione quadrata?', timestamp: new Date(Date.now() - 86340000) },
          { id: '3', role: 'user', text: 'Grazie per il consiglio, ha funzionato.', timestamp: new Date(Date.now() - 3600000) }
        ]);
      }
      setIsLoading(false);
      if (window.innerWidth < 1024) setShowSidebar(false);
    }, 600);
  };

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    if (messageCount >= limit) {
      // In a real app, trigger upgrade modal here
      const limitMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: "Hai raggiunto il tuo limite giornaliero di messaggi. Passa a Premium per continuare la conversazione.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, limitMsg]);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      let responseText = '';
      let usedMock = false;

      if (chatSession) {
        try {
          const result: GenerateContentResponse = await chatSession.sendMessage({ message: userMessage.text });
          responseText = result.text;
        } catch (apiError) {
          console.warn("API call failed, switching to mock", apiError);
          usedMock = true;
        }
      } else {
        usedMock = true;
      }

      if (usedMock) {
        // Fallback Mock Response
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking
        const mockResponses = [
          "Capisco profondamente ciò che dici. Come ti fa sentire questo?",
          "È un'osservazione interessante. Raccontami di più.",
          "La tua consapevolezza è il primo passo verso il cambiamento. Cosa vorresti ottenere oggi?",
          "Sono qui per supportarti. Qual è la sfida più grande in questo momento?",
          "Respira profondamente. Insieme possiamo trovare una soluzione.",
          "Interessante. E cosa ne pensi di provare un approccio diverso?",
          "Sento che questo è importante per te. Continua pure."
        ];
        responseText = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      }

      if (responseText) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: responseText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message", error);
      // Fallback on error too
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Mi dispiace, ho avuto un momento di confusione. Potresti ripetere? (Modalità Offline)",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showIntro) {
    return <ChatIntroDemo onComplete={handleIntroComplete} />;
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-[#FDFBF7] rounded-[2.5rem] overflow-hidden shadow-sm border border-white/60 relative">

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-luminel-champagne/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-luminel-gold-soft/10 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Sidebar (Desktop & Mobile Overlay) */}
      <AnimatePresence>
        {(showSidebar || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`absolute lg:relative z-20 w-80 h-full bg-white/60 backdrop-blur-xl border-r border-white/50 flex flex-col ${window.innerWidth < 1024 ? 'shadow-2xl' : ''
              }`}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-100/50 flex justify-between items-center">
              <h3 className="font-serif font-bold text-slate-800 text-lg">Conversazioni</h3>
              <button
                onClick={() => {
                  setMessages([]);
                  setChatSession(null);
                  window.location.reload();
                }}
                className="p-2 bg-white rounded-xl hover:bg-luminel-champagne text-luminel-gold-soft transition-colors shadow-sm border border-slate-100"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
              {window.innerWidth < 1024 && (
                <button onClick={() => setShowSidebar(false)} className="lg:hidden">
                  <XMarkIcon className="w-6 h-6 text-slate-400" />
                </button>
              )}
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div
                onClick={() => loadConversation('new')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${activeConversationId === 'new' ? 'bg-white border-luminel-champagne shadow-md' : 'border-transparent hover:bg-white/50'}`}
              >
                <div className="flex justify-between mb-1">
                  <span className={`font-bold text-sm ${activeConversationId === 'new' ? 'text-slate-800' : 'text-slate-600'}`}>Nuova Sessione</span>
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">Ora</span>
                </div>
                <p className="text-xs text-slate-500 truncate">Ciao {user?.fullName}...</p>
              </div>

              {/* Mock History Items */}
              <div
                onClick={() => loadConversation('anxiety')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${activeConversationId === 'anxiety' ? 'bg-white border-luminel-champagne shadow-md' : 'border-transparent hover:bg-white/50'}`}
              >
                <div className="flex justify-between mb-1">
                  <span className={`font-medium text-sm ${activeConversationId === 'anxiety' ? 'text-slate-800' : 'text-slate-600'}`}>Gestione Ansia</span>
                  <span className="text-[10px] text-slate-400">Ieri</span>
                </div>
                <p className="text-xs text-slate-400 truncate">Grazie per il consiglio...</p>
              </div>
            </div>

            {/* Footer Info */}
            <div className="p-6 border-t border-slate-100/50 bg-white/40">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">
                <span>Messaggi oggi</span>
                <span className={`${messageCount >= limit ? 'text-red-500' : 'text-luminel-gold-soft'}`}>{messageCount}/{limit}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${messageCount >= limit ? 'bg-red-500' : 'bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark'}`}
                  style={{ width: `${Math.min((messageCount / limit) * 100, 100)}%` }}
                />
              </div>
              {user?.plan === 'free' && (
                <button className="w-full mt-4 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                  Passa a Premium
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {showSidebar && window.innerWidth < 1024 && (
        <div
          className="absolute inset-0 bg-black/20 z-10 lg:hidden backdrop-blur-sm"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative w-full z-10">
        {/* Header */}
        <div className="h-20 border-b border-white/50 flex items-center justify-between px-6 bg-white/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <Bars3Icon className="w-6 h-6 text-slate-600" />
            </button>
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-luminel-gold-soft to-luminel-gold-dark flex items-center justify-center text-white shadow-lg shadow-luminel-gold-soft/20">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-serif font-bold text-slate-800 text-lg leading-tight">Luminel</h2>
              <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">AI Transformational Coach</span>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-full transition-all">
            <EllipsisHorizontalIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/60 backdrop-blur-md border-t border-white/50">
          <form onSubmit={handleSend} className="flex gap-3 items-end max-w-4xl mx-auto">
            <div className="flex-1 bg-white border border-slate-100 rounded-[1.5rem] flex items-center p-1.5 focus-within:ring-2 focus-within:ring-luminel-gold-soft/20 focus-within:border-luminel-gold-soft transition-all shadow-sm hover:shadow-md">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Scrivi qualcosa a Luminel..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-slate-700 placeholder-slate-400 outline-none font-medium"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-4 bg-gradient-to-br from-luminel-gold-soft to-luminel-gold-dark text-white rounded-[1.5rem] hover:shadow-lg hover:shadow-luminel-gold-soft/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
            Luminel è un'AI e può commettere errori. Verifica le informazioni importanti.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
