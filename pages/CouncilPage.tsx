import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon, LockClosedIcon, ArrowRightIcon,
  XMarkIcon, ClockIcon, ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon as SparklesSolid } from "@heroicons/react/24/solid";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// ─── DARK LUXURY TOKENS ───────────────────────────────────────────────────────
const DL = {
  gold:"#C9A84C", goldBr:"#EDD980", goldDim:"rgba(201,168,76,0.12)",
  goldB:"rgba(201,168,76,0.25)", alch:"#9B74E0", stra:"#4A9ED4",
  guer:"#D4603A", sovr:"#C9A84C", white:"#F0EBE0", muted:"#6A6560",
  glass:"rgba(255,255,255,0.035)", glassB:"rgba(255,255,255,0.07)",
  dim:"#252330", surface:"#0D0D20", deep:"#09091A",
};

// ─── ARCHETYPES ───────────────────────────────────────────────────────────────
const ARCHETYPES = [
  {
    id: "alchimista",
    name: "L'Alchimista",
    glyph: "🜔",
    color: DL.alch,
    border: "rgba(155,116,224,0.3)",
    bg: "rgba(155,116,224,0.06)",
    role: "Gestione Emotiva · Shadow Work",
    desc: "Porta alla luce i pattern nascosti che sabotano la crescita. Trasforma le ferite in combustibile evolutivo. L'Alchimista vede ciò che gli altri evitano.",
    voice: "sottile, poetico, profondo",
    thinkingTime: 1200,
    responses: {
      default: [
        "Quello che descrivi come problema esterno è spesso il riflesso di qualcosa che non vuoi guardare internamente. Cosa senti nel corpo in questo momento, mentre parli di questa situazione?",
        "C'è un pattern che si ripete — lo vedo chiaramente. Non è la prima volta che arrivi a questo punto e poi ti fermi. Cosa temi di scoprire se vai oltre?",
        "Le tue emozioni non sono ostacoli alla soluzione. Sono la soluzione. Cosa sta cercando di dirti questa sensazione che provi?",
        "Interessante. Stai descrivendo il sintomo con grande precisione, ma la radice è più antica. Quando hai sentito questa stessa sensazione per la prima volta nella tua vita?",
      ],
      procrastination: "Il rimandare non è pigrizia — è paura mascherata da saggezza. Parte di te crede che non meriti il successo, o teme il fallimento che potrebbe seguire. Quale delle due risuona di più?",
      relationship: "Le relazioni sono specchi. Ciò che ti disturba dell'altro è spesso ciò che non accetti in te stesso. Cosa vedi in questa persona che non vuoi guardare in te?",
      career: "Una carriera che non soddisfa è un Ikigai interrotto. Stai vivendo per le aspettative altrui o per il tuo scopo autentico? La risposta è già dentro di te.",
    }
  },
  {
    id: "stratega",
    name: "Lo Stratega",
    glyph: "◈",
    color: DL.stra,
    border: "rgba(74,158,212,0.3)",
    bg: "rgba(74,158,212,0.06)",
    role: "Visione · Business · Carriera",
    desc: "Analisi fredda, piano perfetto. Converte l'intuizione in sistemi eseguibili con precisione chirurgica. Lo Stratega non opera sulle emozioni — opera sui dati.",
    voice: "preciso, analitico, diretto",
    thinkingTime: 1800,
    responses: {
      default: [
        "Concretizziamo. Quali sono le 3 variabili principali che controllano questa situazione? Senza dati, stiamo operando nel buio. Definisci le metriche.",
        "Vedo 3 scenari possibili. Scenario A: agisci ora con le risorse attuali — rischio medio, impatto alto. Scenario B: aspetti 60 giorni — rischio basso, opportunità persa. Scenario C: deleghi e supervisioni. Qual è la tua priorità: velocità, sicurezza, o scalabilità?",
        "Il problema che descrivi ha una soluzione tecnica, ma la stai affrontando con strumenti emotivi. Ti serve un framework decisionale. Ecco il mio: priorità × urgenza ÷ energia richiesta. Appliciamolo.",
        "Prima di procedere: qual è il tuo runway? Quanto tempo e risorse hai disponibili? Senza sapere questi numeri, qualsiasi strategia è inutile.",
      ],
      procrastination: "La procrastinazione è un problema di sistema, non di carattere. Il tuo sistema di priorità è rotto. Implementiamo oggi: 1 task critica al giorno, eseguita entro le prime 2 ore. Il resto è rumore.",
      relationship: "Le relazioni hanno una struttura. Qual è il tuo obiettivo reale in questa relazione? Definisci 'successo'. Senza un obiettivo chiaro, stai ottimizzando per niente.",
      career: "Analisi rapida: sei sottopagato, sotto-valorizzato, o nel posto sbagliato? Sono problemi diversi con soluzioni diverse. Quale dei tre descrive meglio la tua situazione?",
    }
  },
  {
    id: "guerriero",
    name: "Il Guerriero",
    glyph: "⚔",
    color: DL.guer,
    border: "rgba(212,96,58,0.3)",
    bg: "rgba(212,96,58,0.06)",
    role: "Azione · Focus · Disciplina",
    desc: "Nessuna scusa. Trasforma la volontà in abitudine e l'abitudine in identità indistruttibile. Il Guerriero non aspetta di sentirsi pronto.",
    voice: "diretto, energico, senza filtri",
    thinkingTime: 900,
    responses: {
      default: [
        "Basta analisi. Hai già abbastanza informazioni per agire. La vera domanda è: perché non lo stai facendo? Dai, una risposta onesta — nessuna scusa.",
        "Ogni giorno che aspetti è un giorno che regali al tuo vecchio sé. Il tuo futuro sé ti sta guardando in questo momento. Cosa vede?",
        "La disciplina non è motivazione — la motivazione è temporanea. La disciplina è un'identità. Decidi chi sei, poi agisci come quella persona. Oggi. Non domani.",
        "Smettila di cercare condizioni perfette. Le condizioni perfette non esistono. I vincitori agiscono in condizioni imperfette. Cosa faresti adesso se sapessi di non poter fallire?",
      ],
      procrastination: "La procrastinazione è una scelta. Ogni volta che rimandi, stai scegliendo attivamente di non avanzare. Imposta un timer per 25 minuti. Apri il documento. Inizia. Ora.",
      relationship: "Le relazioni difficili richiedono conversazioni difficili. Stai evitando quella conversazione per rispetto o per paura? Sii onesto. Il rispetto vero richiede coraggio.",
      career: "Se non sei soddisfatto del tuo lavoro, hai due opzioni: cambiarlo dall'interno o cambiarlo dall'esterno. Non c'è una terza opzione. Scegli e agisci.",
    }
  },
  {
    id: "sovrano",
    name: "Il Sovrano",
    glyph: "♛",
    color: DL.sovr,
    border: "rgba(201,168,76,0.3)",
    bg: "rgba(201,168,76,0.06)",
    role: "Integrazione · Leadership · Purpose",
    desc: "L'orchestratore finale. Integra le tre forze in una visione unitaria e produce il Master Plan. Il Sovrano vede l'intera scacchiera.",
    voice: "calmo, autorevole, integrativo",
    thinkingTime: 2800,
    responses: {
      default: [
        "Ho ascoltato le tre prospettive. La verità è nell'intersezione: hai bisogno di guarire qualcosa (L'Alchimista ha ragione), di costruire un sistema (Lo Stratega ha ragione), e di agire subito (Il Guerriero ha ragione). Il Master Plan: questa settimana, un'azione da ciascuna dimensione.",
        "La sintesi è questa: stai operando da un'identità limitata. Non è un problema di strategia o di forza di volontà — è un problema di chi credi di essere. Il cambiamento inizia con una nuova decisione identitaria: da oggi, sei la persona che...",
        "Il Consiglio ha parlato. Il verdetto: le tue risorse sono più che sufficienti. Quello che manca è la permissione che ti dai. Qual è la versione di te che non chiede permesso?",
        "Integrazione finale: l'emozione ti dice dove guardare, la strategia ti dice come muoverti, il coraggio ti dà l'energia. Adesso metti insieme i tre. Qual è la prima azione che le unifica tutte e tre?",
      ],
      procrastination: "Master Plan anti-procrastinazione: 1) Identifica la paura sottostante (L'Alchimista). 2) Crea un sistema di piccoli passi (Lo Stratega). 3) Imposta una scadenza reale oggi (Il Guerriero). Il tuo unico compito: inizia nei primi 10 minuti.",
      relationship: "La relazione che descrivi richiede tre cose: guarire il tuo pattern di reazione (L'Alchimista), definire confini chiari e obiettivi (Lo Stratega), avere la conversazione difficile (Il Guerriero). Quale dei tre inizi oggi?",
      career: "Il tuo Ikigai professionale è all'intersezione di ciò che ami, ciò che sai fare, ciò di cui il mondo ha bisogno e ciò per cui puoi essere pagato. Il tuo percorso attuale soddisfa tutti e 4 i criteri? Se no, quale manca?",
    }
  },
];

// ─── PAST SESSIONS ────────────────────────────────────────────────────────────
const PAST_SESSIONS = [
  { id:"s1", date:"22 Apr 2026", topic:"Non riesco a smettere di procrastinare sul mio progetto principale", archs:["alchimista","stratega","guerriero","sovrano"], summary:"Master Plan in 3 azioni: shadow work sulla paura, sistema di priorità, deadline oggi." },
  { id:"s2", date:"18 Apr 2026", topic:"Devo decidere se lasciare il mio lavoro attuale", archs:["stratega","sovrano"], summary:"Analisi runway finanziario + identità sovrana. Decisione entro 30 giorni." },
  { id:"s3", date:"12 Apr 2026", topic:"Il mio rapporto con mia madre è sempre stato difficile", archs:["alchimista","sovrano"], summary:"Pattern transgenerazionale identificato. Lavoro di shadow work assegnato." },
];

// ─── DEBATE MESSAGE ───────────────────────────────────────────────────────────
interface DebateMsg { archId: string; text: string; isThinking?: boolean; }

// ─── HELPER — get response ────────────────────────────────────────────────────
const getResponse = (arch: typeof ARCHETYPES[0], question: string): string => {
  const q = question.toLowerCase();
  if (q.includes("procrastin") || q.includes("rimand") || q.includes("aspetto")) return arch.responses.procrastination || arch.responses.default[0];
  if (q.includes("relazion") || q.includes("partner") || q.includes("famiglia") || q.includes("madr") || q.includes("padr")) return arch.responses.relationship || arch.responses.default[1];
  if (q.includes("lavoro") || q.includes("carriera") || q.includes("lavoras") || q.includes("business") || q.includes("progetto")) return arch.responses.career || arch.responses.default[2];
  return arch.responses.default[Math.floor(Math.random() * arch.responses.default.length)];
};

// ─── ARCHETYPE CARD ───────────────────────────────────────────────────────────
const ArchCard: React.FC<{ arch: typeof ARCHETYPES[0]; active: boolean; onClick: () => void }> = ({ arch, active, onClick }) => (
  <motion.div onClick={onClick} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
    className="group relative rounded-xl p-5 cursor-pointer transition-all duration-200 overflow-hidden"
    style={{ background: active ? arch.bg : "rgba(255,255,255,0.022)", border: `0.5px solid ${active ? arch.color : "rgba(255,255,255,0.07)"}` }}>
    <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ background: `linear-gradient(90deg,transparent,${arch.color}60,transparent)` }} />
    {active && (
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg,transparent,${arch.color}60,transparent)` }} />
    )}
    <div className="text-[24px] mb-3" style={{ color: arch.color, filter: `drop-shadow(0 0 8px ${arch.color}40)` }}>{arch.glyph}</div>
    <div className="text-[16px] font-normal mb-0.5" style={{ color: DL.white, fontFamily: "'Cormorant Garamond',serif" }}>{arch.name}</div>
    <div className="text-[9px] tracking-[0.12em] uppercase mb-2" style={{ color: arch.color }}>{arch.role}</div>
    <p className="text-[11px] leading-relaxed" style={{ color: DL.muted }}>{arch.desc}</p>
    {active && (
      <div className="mt-3 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: arch.color }} />
        <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: arch.color }}>In ascolto</span>
      </div>
    )}
  </motion.div>
);

// ─── DEBATE BUBBLE ────────────────────────────────────────────────────────────
const DebateBubble: React.FC<{ msg: DebateMsg }> = ({ msg }) => {
  const arch = ARCHETYPES.find(a => a.id === msg.archId)!;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className="flex gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[16px]"
        style={{ background: `${arch.color}18`, border: `0.5px solid ${arch.color}35`, color: arch.color }}>
        {arch.glyph}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[12px] font-medium" style={{ color: arch.color }}>{arch.name}</span>
          <span className="text-[9px] tracking-[0.1em] uppercase" style={{ color: DL.muted }}>{arch.role.split("·")[0].trim()}</span>
        </div>
        <div className="rounded-xl px-4 py-3" style={{ background: `${arch.color}08`, border: `0.5px solid ${arch.color}20`, borderRadius: "2px 10px 10px 10px" }}>
          {msg.isThinking ? (
            <div className="flex items-center gap-1.5">
              {[0,0.18,0.36].map((delay,i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: arch.color, animationDelay:`${delay}s`, opacity:0.7 }} />
              ))}
            </div>
          ) : (
            <p className="text-[13px] leading-relaxed" style={{ color: "rgba(240,235,224,0.82)" }}>{msg.text}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const CouncilPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userPlan = (user as any)?.plan ?? "free";
  const isVIP = userPlan === "vip";

  const [question, setQuestion]       = useState("");
  const [debating, setDebating]       = useState(false);
  const [messages, setMessages]       = useState<DebateMsg[]>([]);
  const [activeArchs, setActiveArchs] = useState<string[]>(ARCHETYPES.map(a => a.id));
  const [showHistory, setShowHistory] = useState(false);
  const [sessionCount, setSessionCount] = useState(3); // mock
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const convoke = async () => {
    if (!question.trim() || debating || !isVIP) return;
    setDebating(true);
    setMessages([]);

    const selectedArchs = ARCHETYPES.filter(a => activeArchs.includes(a.id));
    // Sort: alch → stra → guer → sovr (Sovrano sempre ultimo)
    const ordered = [...selectedArchs.filter(a=>a.id!=="sovrano"), ...selectedArchs.filter(a=>a.id==="sovrano")];

    for (const arch of ordered) {
      // Add thinking indicator
      setMessages(prev => [...prev, { archId: arch.id, text: "", isThinking: true }]);
      await new Promise(r => setTimeout(r, arch.thinkingTime));
      // Replace thinking with response
      const response = getResponse(arch, question);
      setMessages(prev => [...prev.slice(0,-1), { archId: arch.id, text: response }]);
      // Pause between archetypes
      if (arch.id !== ordered[ordered.length-1].id) await new Promise(r => setTimeout(r, 600));
    }

    setSessionCount(c => c+1);
    setDebating(false);
  };

  const reset = () => { setMessages([]); setQuestion(""); setDebating(false); };

  const EXAMPLE_QUESTIONS = [
    "Non riesco a smettere di procrastinare sul mio progetto principale",
    "Devo decidere se lasciare il mio lavoro attuale",
    "Ho paura di fallire prima ancora di iniziare",
    "Come trovo il coraggio di avere una conversazione difficile?",
    "Mi sento bloccato nel mio sviluppo professionale",
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-20 right-0 w-96 h-96 rounded-full" style={{ background:"rgba(155,116,224,0.05)", filter:"blur(100px)" }} />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full" style={{ background:"rgba(201,168,76,0.04)", filter:"blur(100px)" }} />
      </div>

      {/* ── HEADER ── */}
      <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} className="mb-10">
        <div className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color:DL.alch }}>VIP Sovereign · Esclusivo</div>
        <h1 className="font-serif text-[40px] font-normal leading-tight mb-2" style={{ color:DL.white }}>
          Il Consiglio degli <em className="italic" style={{ color:DL.gold }}>Archetipi</em>
        </h1>
        <p className="text-[13px] leading-relaxed max-w-xl" style={{ color:DL.muted }}>
          Quattro intelligenze distinte analizzano la tua sfida da prospettive complementari e producono un Master Plan. Un mastermind virtuale senza precedenti.
        </p>
      </motion.div>

      {/* ── VIP LOCK ── */}
      {!isVIP && (
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="mb-10 rounded-2xl p-8 text-center relative overflow-hidden"
          style={{ background:"linear-gradient(135deg,rgba(155,116,224,0.08),rgba(201,168,76,0.06))", border:"0.5px solid rgba(155,116,224,0.3)" }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(155,116,224,0.5),transparent)" }} />
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background:"rgba(155,116,224,0.08)", filter:"blur(40px)" }} />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background:"rgba(155,116,224,0.12)", border:"0.5px solid rgba(155,116,224,0.3)" }}>
              <LockClosedIcon className="w-8 h-8" style={{ color:"#9B74E0" }} />
            </div>
            <div className="font-serif text-[26px] font-normal mb-3" style={{ color:DL.white }}>
              Il Consiglio è <em className="italic" style={{ color:"#9B74E0" }}>esclusivo VIP</em>
            </div>
            <p className="text-[13px] leading-relaxed mb-6 max-w-md mx-auto" style={{ color:DL.muted }}>
              I 4 archetipi AI (Alchimista, Stratega, Guerriero, Sovrano) che dibattono in real-time la tua sfida sono disponibili solo con il piano VIP Sovereign.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
              <button onClick={() => navigate("/plans")}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[13px] font-medium tracking-wide transition-all"
                style={{ background:DL.gold, color:"#06060F" }}>
                <SparklesSolid className="w-4 h-4" />
                Diventa VIP Sovereign · €199/mese
                <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button onClick={() => navigate("/plans")}
                className="text-[12px] transition-all" style={{ color:DL.muted }}
                onMouseEnter={e=>e.currentTarget.style.color=DL.white}
                onMouseLeave={e=>e.currentTarget.style.color=DL.muted}>
                Confronta tutti i piani →
              </button>
            </div>
            <p className="text-[10px]" style={{ color:DL.muted }}>
              Include anche: Voice Coach illimitato HD · Corsi VIP · 1 sessione mensile con Michael Jara
            </p>
          </div>
          {/* Preview blurred archetypes */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 opacity-30 pointer-events-none" style={{ filter:"blur(1px)" }}>
            {ARCHETYPES.map(arch => (
              <div key={arch.id} className="rounded-xl p-4" style={{ background:arch.bg, border:`0.5px solid ${arch.border}` }}>
                <div className="text-[22px] mb-2">{arch.glyph}</div>
                <div className="text-[13px]" style={{ color:arch.color }}>{arch.name}</div>
                <div className="text-[9px]" style={{ color:DL.muted }}>{arch.role}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── COUNCIL INTERFACE (VIP only) ── */}
      {isVIP && (
        <>
          {/* Archetype cards */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] tracking-[0.18em] uppercase" style={{ color:DL.muted }}>
                I quattro archetipi · {activeArchs.length} selezionati
              </div>
              <div className="flex gap-2">
                <button onClick={() => setActiveArchs(ARCHETYPES.map(a=>a.id))}
                  className="text-[11px] px-3 py-1 rounded-lg transition-all"
                  style={{ background:DL.goldDim, border:`0.5px solid ${DL.goldB}`, color:DL.gold }}>
                  Tutti
                </button>
                <button onClick={() => setShowHistory(h=>!h)}
                  className="text-[11px] px-3 py-1 rounded-lg transition-all flex items-center gap-1"
                  style={{ background:DL.glass, border:`0.5px solid ${DL.glassB}`, color:DL.muted }}>
                  <ClockIcon className="w-3 h-3" />Sessioni ({sessionCount})
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ARCHETYPES.map(arch => (
                <ArchCard key={arch.id} arch={arch}
                  active={activeArchs.includes(arch.id)}
                  onClick={() => setActiveArchs(prev =>
                    prev.includes(arch.id) ? prev.filter(id=>id!==arch.id) : [...prev,arch.id]
                  )} />
              ))}
            </div>
          </motion.div>

          {/* Session history drawer */}
          <AnimatePresence>
            {showHistory && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                transition={{ duration:0.2 }} className="overflow-hidden mb-8">
                <div className="rounded-xl p-5" style={{ background:DL.glass, border:`0.5px solid ${DL.glassB}` }}>
                  <div className="text-[10px] tracking-[0.18em] uppercase mb-4" style={{ color:DL.muted }}>Sessioni passate</div>
                  <div className="flex flex-col gap-3">
                    {PAST_SESSIONS.map(s => (
                      <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                        style={{ background:"rgba(255,255,255,0.02)", border:`0.5px solid rgba(255,255,255,0.06)` }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor=DL.goldB}
                        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-medium mb-1 truncate" style={{ color:DL.white }}>{s.topic}</div>
                          <div className="text-[11px] mb-1.5" style={{ color:DL.muted }}>{s.summary}</div>
                          <div className="flex items-center gap-2">
                            {s.archs.map(id => {
                              const a = ARCHETYPES.find(x=>x.id===id)!;
                              return <span key={id} className="text-[12px]" style={{ color:a.color }}>{a.glyph}</span>;
                            })}
                            <span className="text-[9px]" style={{ color:DL.muted }}>{s.date}</span>
                          </div>
                        </div>
                        <button className="text-[11px] flex-shrink-0 px-2.5 py-1 rounded-lg"
                          style={{ background:DL.goldDim, color:DL.gold, border:`0.5px solid ${DL.goldB}` }}>
                          Riprendi
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question input */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="mb-6">
            <div className="rounded-xl p-5" style={{ background:`${DL.alch}06`, border:`0.5px solid rgba(155,116,224,0.25)` }}>
              <div className="text-[10px] tracking-[0.18em] uppercase mb-3" style={{ color:DL.alch }}>
                La tua sfida · Il Consiglio ascolterà
              </div>
              <textarea value={question} onChange={e=>setQuestion(e.target.value)}
                placeholder="Descrivi la situazione che vuoi analizzare con il Consiglio. Più sei specifico, più la risposta sarà chirurgica..."
                rows={3} disabled={debating}
                className="w-full bg-transparent outline-none resize-none text-[14px] leading-relaxed mb-4"
                style={{ color:DL.white, fontFamily:"'Cormorant Garamond',serif", fontSize:"17px", fontStyle:"italic" }} />
              {/* Example prompts */}
              {!question && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {EXAMPLE_QUESTIONS.map((eq,i) => (
                    <button key={i} onClick={() => setQuestion(eq)}
                      className="text-[11px] px-3 py-1.5 rounded-lg transition-all"
                      style={{ background:"rgba(255,255,255,0.03)", border:`0.5px solid ${DL.glassB}`, color:DL.muted }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(155,116,224,0.3)";e.currentTarget.style.color="#9B74E0"}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=DL.glassB;e.currentTarget.style.color=DL.muted}}>
                      {eq}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="text-[11px]" style={{ color:DL.muted }}>
                  {activeArchs.length} {activeArchs.length===1?"archetipo":"archetipi"} selezionati
                </div>
                <div className="flex gap-2">
                  {messages.length>0 && !debating && (
                    <button onClick={reset}
                      className="px-4 py-2.5 rounded-xl text-[12px] transition-all"
                      style={{ background:DL.glass, border:`0.5px solid ${DL.glassB}`, color:DL.muted }}>
                      Nuova sessione
                    </button>
                  )}
                  <button onClick={convoke}
                    disabled={!question.trim() || debating || activeArchs.length===0}
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[13px] font-medium tracking-wide transition-all"
                    style={{
                      background: question.trim() && !debating && activeArchs.length>0 ? "#9B74E0" : "rgba(255,255,255,0.04)",
                      color: question.trim() && !debating && activeArchs.length>0 ? "#FFFFFF" : DL.muted,
                      border:`0.5px solid ${question.trim() && !debating ? "rgba(155,116,224,0.5)" : DL.glassB}`,
                      cursor: !question.trim() || debating || activeArchs.length===0 ? "not-allowed" : "pointer",
                    }}>
                    <span className="text-[14px]">⬡</span>
                    {debating ? "Il Consiglio sta deliberando..." : "Convoca Il Consiglio"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Debate output */}
          <AnimatePresence>
            {messages.length > 0 && (
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="rounded-xl overflow-hidden"
                style={{ background:DL.glass, border:`0.5px solid ${DL.glassB}` }}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3"
                  style={{ borderBottom:`0.5px solid ${DL.dim}`, background:"rgba(255,255,255,0.015)" }}>
                  <div>
                    <div className="text-[10px] tracking-[0.18em] uppercase mb-0.5" style={{ color:DL.alch }}>
                      {debating ? "Il Consiglio sta deliberando..." : "Deliberazione completata"}
                    </div>
                    <div className="text-[12px] italic max-w-md truncate" style={{ color:DL.muted }}>"{question}"</div>
                  </div>
                  {!debating && (
                    <button onClick={reset} className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background:DL.glass, color:DL.muted, border:`0.5px solid ${DL.glassB}` }}>
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {/* Messages */}
                <div className="p-5">
                  {messages.map((msg, i) => <DebateBubble key={i} msg={msg} />)}
                  <div ref={messagesEndRef} />
                </div>
                {/* Footer (when done) */}
                {!debating && messages.length >= activeArchs.length && (
                  <div className="px-5 pb-5">
                    <div className="rounded-xl p-4" style={{ background:DL.goldDim, border:`0.5px solid ${DL.goldB}` }}>
                      <div className="text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color:DL.gold }}>Prossimo passo · Il Consiglio ha parlato</div>
                      <p className="text-[12px] leading-relaxed mb-3" style={{ color:"rgba(240,235,224,0.7)" }}>
                        Il Consiglio ha deliberato. Il tuo compito adesso: scegli UNA delle azioni suggerite e implementala nelle prossime 2 ore. Non analizzare. Agisci.
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => navigate("/chat")}
                          className="flex-1 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                          style={{ background:DL.gold, color:"#06060F" }}>
                          Continua con Luminel →
                        </button>
                        <button onClick={reset}
                          className="px-4 py-2.5 rounded-xl text-[12px] transition-all"
                          style={{ background:DL.glass, color:DL.muted, border:`0.5px solid ${DL.glassB}` }}>
                          Nuova sfida
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state (no messages yet) */}
          {messages.length === 0 && !debating && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
              className="text-center py-12 rounded-xl"
              style={{ background:DL.glass, border:`0.5px solid ${DL.glassB}` }}>
              <div className="flex justify-center gap-3 mb-4 text-[28px]">
                {ARCHETYPES.filter(a=>activeArchs.includes(a.id)).map(a => (
                  <span key={a.id} style={{ color:a.color, filter:`drop-shadow(0 0 6px ${a.color}40)` }}>{a.glyph}</span>
                ))}
              </div>
              <div className="font-serif text-[18px] font-normal mb-2" style={{ color:DL.white }}>
                Il Consiglio è in attesa
              </div>
              <p className="text-[12px] max-w-sm mx-auto" style={{ color:DL.muted }}>
                Descrivi la tua sfida nel campo sopra e convoca il Consiglio. I 4 archetipi analizzeranno la situazione da ogni angolazione.
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default CouncilPage;
