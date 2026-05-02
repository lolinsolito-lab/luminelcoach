import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaperAirplaneIcon, SparklesIcon, PlusIcon,
  EllipsisHorizontalIcon, Bars3Icon, XMarkIcon,
  LockClosedIcon, ArrowUpTrayIcon,
} from "@heroicons/react/24/solid";
import { supabase } from "../services/supabase";
import { ChatMessage } from "../types";
import { useAuth } from "../contexts/AuthContext";
import ChatIntroDemo from "./ChatIntroDemo";

// ─── DARK LUXURY TOKENS ───────────────────────────────────────────────────────
const DL = {
  void: "#06060F",
  deep: "#09091A",
  surface: "#0D0D20",
  glass: "rgba(255,255,255,0.035)",
  glassB: "rgba(255,255,255,0.07)",
  gold: "#C9A84C",
  goldBr: "#EDD980",
  goldDim: "rgba(201,168,76,0.12)",
  goldB: "rgba(201,168,76,0.25)",
  white: "#F0EBE0",
  muted: "#6A6560",
  dim: "#252330",
};

// ─── CHAT BUBBLE ─────────────────────────────────────────────────────────────
const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-5 group`}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-2.5 flex-shrink-0 mt-0.5"
          style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}` }}>
          <span className="text-[12px] font-medium" style={{ fontFamily: "'Cormorant Garamond',serif", color: DL.gold }}>L</span>
        </div>
      )}

      <div className={`max-w-[75%] md:max-w-[65%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        {/* Sender label */}
        <span className="text-[10px] mb-1 px-1" style={{ color: DL.muted }}>
          {isUser ? "Tu" : "Luminel AI Coach"}
        </span>

        {/* Bubble */}
        <div className="px-4 py-3 rounded-xl"
          style={isUser
            ? { background: DL.goldDim, border: `0.5px solid ${DL.goldB}`, borderRadius: "10px 2px 10px 10px" }
            : { background: "rgba(201,168,76,0.06)", border: "0.5px solid rgba(201,168,76,0.14)", borderRadius: "2px 10px 10px 10px" }
          }>
          <p className="text-[13px] leading-relaxed whitespace-pre-wrap"
            style={{ color: isUser ? DL.goldBr : "rgba(240,235,224,0.85)" }}>
            {message.text}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-[9px] mt-1 px-1" style={{ color: DL.muted }}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center ml-2.5 flex-shrink-0 mt-0.5"
          style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
          <span className="text-[11px]" style={{ color: DL.muted }}>Tu</span>
        </div>
      )}
    </motion.div>
  );
};

// ─── TYPING INDICATOR ─────────────────────────────────────────────────────────
const TypingIndicator: React.FC = () => (
  <div className="flex justify-start mb-5">
    <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-2.5 flex-shrink-0"
      style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}` }}>
      <span className="text-[12px]" style={{ fontFamily: "'Cormorant Garamond',serif", color: DL.gold }}>L</span>
    </div>
    <div className="px-4 py-3 rounded-xl flex items-center gap-1.5"
      style={{ background: "rgba(201,168,76,0.06)", border: "0.5px solid rgba(201,168,76,0.14)", borderRadius: "2px 10px 10px 10px" }}>
      {[0, 0.18, 0.36].map((delay, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{ background: DL.gold, animationDelay: `${delay}s`, opacity: 0.7 }} />
      ))}
    </div>
  </div>
);

// ─── CONVERSATION ITEM ────────────────────────────────────────────────────────
const ConvItem: React.FC<{ label: string; preview: string; time: string; active: boolean; onClick: () => void }> = ({ label, preview, time, active, onClick }) => (
  <div onClick={onClick} className="px-3 py-3 rounded-xl cursor-pointer transition-all"
    style={{ background: active ? DL.goldDim : "transparent", border: `0.5px solid ${active ? DL.goldB : "transparent"}` }}
    onMouseEnter={e => !active && (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
    onMouseLeave={e => !active && (e.currentTarget.style.background = "transparent")}>
    <div className="flex justify-between items-baseline mb-0.5">
      <span className="text-[13px] font-medium truncate" style={{ color: active ? DL.goldBr : DL.white }}>{label}</span>
      <span className="text-[9px] flex-shrink-0 ml-2" style={{ color: DL.muted }}>{time}</span>
    </div>
    <p className="text-[11px] truncate" style={{ color: DL.muted }}>{preview}</p>
  </div>
);

// ─── QUICK PROMPTS ────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "Come posso trovare il mio Ikigai?",
  "Aiutami con la mia Reality Quest",
  "Voglio parlare dei miei obiettivi",
  "Ho bisogno di chiarezza su una decisione",
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ChatPage: React.FC = () => {
  const { user } = useAuth();

  const [showIntro, setShowIntro] = useState(() => localStorage.getItem("luminel_chat_intro_seen") !== "true");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState("new");
  const [messageCount, setMessageCount] = useState(0);
  const [mode, setMode] = useState<"coach" | "shadow" | "strategy">("coach");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const getDailyLimit = () => user?.plan === "vip" ? 9999 : user?.plan === "premium" ? 100 : user?.plan === "starter" ? 30 : 5;
  const limit = getDailyLimit();
  const limitPct = Math.min((messageCount / limit) * 100, 100);
  const nearLimit = messageCount >= limit * 0.8;

  const handleIntroComplete = () => { localStorage.setItem("luminel_chat_intro_seen", "true"); setShowIntro(false); };

  // Init chat
  useEffect(() => {
    if (!user || showIntro) return;
    if (messages.length === 0) {
      setMessages([{ id: "init", role: "model", text: `Bentornato, ${user?.fullName?.split(" ")[0] || "Viaggiatore"}. Sono Luminel. Ho riletto le nostre ultime sessioni. Come posso illuminare il tuo percorso oggi?`, timestamp: new Date() }]);
    }
  }, [user, showIntro, messages.length]);

  // Load conversation
  const loadConversation = (id: string) => {
    setActiveConversationId(id);
    setIsLoading(true);
    setTimeout(() => {
      if (id === "new") {
        setMessages([{ id: "init-new", role: "model", text: `Ciao ${user?.fullName?.split(" ")[0] || "Viaggiatore"}. Sono Luminel. Come posso illuminare il tuo percorso oggi?`, timestamp: new Date() }]);
      } else if (id === "anxiety") {
        setMessages([
          { id: "1", role: "user", text: "Ho bisogno di aiuto per gestire l'ansia prima di una riunione.", timestamp: new Date(Date.now() - 86400000) },
          { id: "2", role: "model", text: "Capisco. L'ansia da prestazione è un segnale del tuo sistema nervoso che vuole proteggerti. Proviamo una tecnica di respirazione 4-7-8?", timestamp: new Date(Date.now() - 86340000) },
          { id: "3", role: "user", text: "Grazie, ha funzionato!", timestamp: new Date(Date.now() - 3600000) },
        ]);
      } else if (id === "ikigai") {
        setMessages([
          { id: "1", role: "user", text: "Voglio trovare il mio Ikigai ma non so da dove iniziare.", timestamp: new Date(Date.now() - 172800000) },
          { id: "2", role: "model", text: "Perfetto. L'Ikigai non è un punto di arrivo ma un processo. Partiamo dalla prima domanda: cosa faresti anche senza essere pagato?", timestamp: new Date(Date.now() - 172740000) },
        ]);
      }
      setIsLoading(false);
      if (window.innerWidth < 1024) setShowSidebar(false);
    }, 500);
  };

  // Auto scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  // Auto resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleSend = async (e?: React.FormEvent, quickPrompt?: string) => {
    e?.preventDefault();
    const text = quickPrompt || input.trim();
    if (!text) return;

    if (messageCount >= limit) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "model", text: "Hai raggiunto il limite giornaliero. Passa a Premium per continuare la sessione.", timestamp: new Date() }]);
      return;
    }

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setIsLoading(true);
    setMessageCount(p => p + 1);

    try {
      const history = messages
        .filter(m => m.id !== "init" && m.id !== "init-fallback" && m.id !== "init-new" && !["1","2","3"].includes(m.id))
        .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

      const { data, error } = await supabase.functions.invoke("luminel-chat", {
        body: {
          message: text,
          history: history,
          mode: mode,
          sessionId: activeConversationId !== "new" ? activeConversationId : undefined,
          source: "chat"
        }
      });

      if (error) throw error;
      
      const responseText = data?.text || "Mi dispiace, ho avuto un momento. Puoi ripetere?";
      if (data?.sessionId && activeConversationId === "new") {
        setActiveConversationId(data.sessionId);
      }

      setMessages(prev => [...prev, { id: data?.id || (Date.now() + 1).toString(), role: "model", text: responseText, timestamp: new Date() }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "model", text: "Si è verificato un errore di connessione con il Cervello AI. Riprova tra poco.", timestamp: new Date() }]);
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (showIntro) return <ChatIntroDemo onComplete={handleIntroComplete} />;

  return (
    <div className="flex rounded-2xl overflow-hidden relative"
      style={{ height: "calc(100vh - 6rem)", background: DL.deep, border: `0.5px solid ${DL.glassB}` }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full" style={{ background: "rgba(201,168,76,0.04)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full" style={{ background: "rgba(155,116,224,0.05)", filter: "blur(80px)" }} />
      </div>

      {/* ── SIDEBAR ── */}
      <AnimatePresence>
        {(showSidebar || typeof window !== "undefined" && window.innerWidth >= 1024) && (
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ duration: 0.2 }}
            className="absolute lg:relative z-20 w-64 h-full flex flex-col flex-shrink-0"
            style={{ background: DL.void, borderRight: `0.5px solid ${DL.glassB}` }}>

            {/* Sidebar header */}
            <div className="flex items-center justify-between px-4 py-4 flex-shrink-0"
              style={{ borderBottom: `0.5px solid ${DL.glassB}` }}>
              <span className="text-[11px] tracking-[0.18em] uppercase" style={{ color: DL.muted }}>Sessioni</span>
              <div className="flex items-center gap-2">
                <button onClick={() => loadConversation("new")}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}` }}
                  title="Nuova sessione">
                  <PlusIcon className="w-4 h-4" style={{ color: DL.gold }} />
                </button>
                <button onClick={() => setShowSidebar(false)} className="lg:hidden">
                  <XMarkIcon className="w-4 h-4" style={{ color: DL.muted }} />
                </button>
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <ConvItem label="Nuova Sessione" preview={`Ciao ${user?.fullName?.split(" ")[0]}...`} time="Ora"
                active={activeConversationId === "new"} onClick={() => loadConversation("new")} />
              <ConvItem label="Gestione Ansia" preview="Grazie per il consiglio, ha funzionato!" time="Ieri"
                active={activeConversationId === "anxiety"} onClick={() => loadConversation("anxiety")} />
              <ConvItem label="Ikigai Discovery" preview="Voglio trovare il mio Ikigai..." time="3g fa"
                active={activeConversationId === "ikigai"} onClick={() => loadConversation("ikigai")} />
            </div>

            {/* Usage + upgrade */}
            <div className="p-4 flex-shrink-0" style={{ borderTop: `0.5px solid ${DL.glassB}` }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] tracking-[0.12em] uppercase" style={{ color: DL.muted }}>Messaggi oggi</span>
                <span className="text-[11px] font-medium" style={{ color: nearLimit ? "#D4603A" : DL.gold }}>
                  {messageCount}/{limit === 9999 ? "∞" : limit}
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${limit === 9999 ? 5 : limitPct}%`, background: nearLimit ? "#D4603A" : DL.gold }} />
              </div>
              {user?.plan === "free" && (
                <button className="w-full py-2.5 rounded-xl text-[11px] font-medium tracking-wide transition-all"
                  style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}`, color: DL.gold }}>
                  Passa a Premium →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {showSidebar && (
        <div className="absolute inset-0 z-10 lg:hidden" style={{ background: "rgba(6,6,15,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowSidebar(false)} />
      )}

      {/* ── MAIN CHAT ── */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
          style={{ borderBottom: `0.5px solid ${DL.glassB}`, background: "rgba(9,9,26,0.8)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSidebar(true)} className="lg:hidden mr-1">
              <Bars3Icon className="w-5 h-5" style={{ color: DL.muted }} />
            </button>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}` }}>
                <SparklesIcon className="w-5 h-5" style={{ color: DL.gold }} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{ background: "#3DB87A", borderColor: DL.deep }} />
            </div>
            <div>
              <div className="text-[14px] font-medium" style={{ color: DL.white }}>Luminel</div>
              <div className="text-[10px] tracking-[0.1em] uppercase" style={{ color: DL.muted }}>Coach Trasformativo · Online</div>
            </div>
          </div>

          {/* Mode selector */}
          <div className="flex items-center gap-1.5 hidden md:flex">
            {(["coach", "shadow", "strategy"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="px-3 py-1.5 rounded-lg text-[11px] transition-all border capitalize"
                style={mode === m
                  ? { background: DL.goldDim, borderColor: DL.goldB, color: DL.gold }
                  : { background: "transparent", borderColor: "transparent", color: DL.muted }}>
                {m === "coach" ? "Coach" : m === "shadow" ? "Shadow Work" : "Strategia"}
              </button>
            ))}
          </div>

          <button className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: DL.muted }}>
            <EllipsisHorizontalIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-1">

          {/* Quick prompts (show only at start) */}
          {messages.length <= 1 && !isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mb-6">
              <p className="text-[11px] tracking-[0.14em] uppercase mb-3" style={{ color: DL.muted }}>Suggerimenti</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button key={i} onClick={() => handleSend(undefined, prompt)}
                    className="text-left px-4 py-3 rounded-xl text-[12px] transition-all border"
                    style={{ background: DL.glass, borderColor: DL.glassB, color: "rgba(240,235,224,0.65)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = DL.goldB; e.currentTarget.style.color = DL.white; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = DL.glassB; e.currentTarget.style.color = "rgba(240,235,224,0.65)"; }}>
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 px-5 pb-5 pt-3"
          style={{ borderTop: `0.5px solid ${DL.glassB}`, background: "rgba(9,9,26,0.6)", backdropFilter: "blur(12px)" }}>
          <form onSubmit={handleSend} className="flex gap-3 items-end max-w-3xl mx-auto">
            <div className="flex-1 flex items-end rounded-xl transition-all"
              style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}
              onFocus={() => { }} >
              <textarea ref={inputRef} rows={1} value={input}
                onChange={handleInputChange} onKeyDown={handleKeyDown}
                placeholder="Parla con Luminel…"
                disabled={isLoading}
                className="flex-1 bg-transparent border-none outline-none resize-none px-4 py-3 text-[13px] leading-relaxed"
                style={{ color: DL.white, minHeight: "44px", maxHeight: "120px" }}
                onFocus={e => e.currentTarget.parentElement!.style.borderColor = DL.goldB}
                onBlur={e => e.currentTarget.parentElement!.style.borderColor = DL.glassB}
              />
            </div>
            <button type="submit" disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{ background: input.trim() && !isLoading ? DL.gold : "rgba(255,255,255,0.05)", border: `0.5px solid ${input.trim() && !isLoading ? DL.gold : DL.glassB}` }}>
              <PaperAirplaneIcon className="w-5 h-5" style={{ color: input.trim() && !isLoading ? "#06060F" : DL.muted }} />
            </button>
          </form>

          {/* Limit warning */}
          {nearLimit && messageCount < limit && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-[10px] mt-2" style={{ color: "#D4603A" }}>
              {limit - messageCount} messaggi rimanenti · <span style={{ color: DL.gold, cursor: "pointer" }}>Passa a Premium</span>
            </motion.p>
          )}

          <p className="text-center text-[10px] mt-2" style={{ color: DL.muted }}>
            Luminel AI Coach · Sviluppo personale ai sensi della Legge 4/2013 · Non è un servizio medico · <span style={{ color: DL.muted }}>Invio: Enter · A capo: Shift+Enter</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;