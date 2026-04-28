import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, LockClosedIcon, ClockIcon, BoltIcon, SparklesIcon, ArrowRightIcon, PlayIcon, ChevronRightIcon, StarIcon, HeartIcon, RocketLaunchIcon, LightBulbIcon, ShieldCheckIcon, UserGroupIcon, SunIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckSolid, FireIcon as FireSolid } from "@heroicons/react/24/solid";

type Plan = "free" | "premium" | "vip";
type Difficulty = "Principiante" | "Intermedio" | "Avanzato";

interface DayContent { day: number; title: string; theme: string; exercise: string; duration: string; realityQuest: string; reflection: string; }
interface Quest { id: string; title: string; subtitle: string; description: string; longDescription: string; duration: number; timePerDay: string; difficulty: Difficulty; category: string; icon: React.ReactNode; accentColor: string; accentBg: string; requiredPlan: Plan; xpReward: number; rating: number; completions: number; tags: string[]; whatYouLearn: string[]; days: DayContent[]; progress?: number; currentDay?: number; completedDays?: number[]; }

const planOrder: Record<Plan, number> = { free: 0, premium: 1, vip: 2 };
const planLabel: Record<Plan, string> = { free: "FREE", premium: "PREMIUM", vip: "VIP" };
const canAccess = (u: Plan, r: Plan) => planOrder[u] >= planOrder[r];
const diffStyle: Record<Difficulty, string> = { Principiante: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10", Intermedio: "text-sky-400 border-sky-500/25 bg-sky-500/10", Avanzato: "text-violet-400 border-violet-500/25 bg-violet-500/10" };
const planStyle: Record<Plan, string> = { free: "text-sky-400 border-sky-500/25 bg-sky-500/10", premium: "text-[#C9A84C] border-[#C9A84C]/25 bg-[#C9A84C]/10", vip: "text-violet-400 border-violet-500/25 bg-violet-500/10" };
const CATS = ["Tutte", "Mindfulness", "Leadership", "Identita", "Relazioni", "Salute", "Ikigai"];

// Simulated user account (produzione: da Supabase profiles)
const useAccount = () => ({ userPlan: "vip" as Plan, userXP: 2340, userStreak: 12 });

const QUESTS: Quest[] = [
    {
        id: "mindful-living", title: "The Art of Mindful Living", subtitle: "21 giorni per trasformare le tue abitudini", description: "Un viaggio strutturato per coltivare la pace interiore attraverso il metodo Ikigai.", longDescription: "In questo percorso di 21 giorni, Michael Jara ti guida attraverso le pratiche fondamentali della mindfulness applicata all'Ikigai. Ogni giorno e progettato per essere accessibile — 15-20 minuti che cambieranno il modo in cui percepisci te stesso e il mondo.", duration: 21, timePerDay: "15-20 min", difficulty: "Principiante", category: "Mindfulness", icon: <HeartIcon className="w-5 h-5" />, accentColor: "#C9A84C", accentBg: "rgba(201,168,76,0.07)", requiredPlan: "free", xpReward: 300, rating: 4.9, completions: 2100, tags: ["Ikigai", "Abitudini", "Meditazione", "Respiro"], whatYouLearn: ["Tecnica del respiro consapevole per reset istantaneo", "Come costruire un rituale mattutino sostenibile", "Il metodo Ikigai per trovare senso nel quotidiano", "Mindful eating: mangiare con presenza e gratitudine", "Tecnica STOP per gestire i momenti di stress"], progress: 85, currentDay: 18, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], days: [
            { day: 1, title: "Il Respiro Come Ancora", theme: "Presenza", exercise: "Tecnica 4-7-8: inspira 4 sec, trattieni 7, espira 8. Ripeti 4 volte al mattino, 4 alla sera.", duration: "10 min", realityQuest: "Identifica UN momento oggi in cui hai reagito automaticamente. Scrivilo.", reflection: "In cosa ti sei sentito presente oggi?" },
            { day: 18, title: "Integrazione Profonda", theme: "Sintesi", exercise: "Meditazione di 15 minuti: visualizza la versione di te che ha completato questo percorso. Come si muove? Come decide?", duration: "20 min", realityQuest: "Fai UNA cosa oggi che quella versione di te farebbe — e tu normalmente rimandi.", reflection: "Quanto sei vicino a quella versione di te?" },
            { day: 19, title: "La Gratitudine come Pratica", theme: "Abbondanza", exercise: "Scrivi 10 cose per cui sei grato. Non le solite — vai in profondita. Trova 3 che ti sorprendono.", duration: "15 min", realityQuest: "Ringrazia verbalmente qualcuno che non lo sente spesso da te.", reflection: "Come cambia la tua percezione della giornata?" },
            { day: 20, title: "Il Corpo Presente", theme: "Embodiment", exercise: "Body scan completo: 15 minuti di attenzione sistematica da piedi a testa. Senza giudizio.", duration: "20 min", realityQuest: "Cammina 10 minuti senza telefono, notando 5 cose che normalmente non noti.", reflection: "Cosa ha comunicato il tuo corpo oggi?" },
            { day: 21, title: "La Cerimonia della Fine", theme: "Completamento", exercise: "Scrivi una lettera a te stesso di 21 giorni fa. Cosa vorresti dirgli? Cosa hai scoperto?", duration: "20 min", realityQuest: "Scegli UNA pratica da questi 21 giorni e impegnati a mantenerla per i prossimi 30 giorni.", reflection: "Chi sei diventato attraverso questo percorso?" },
        ]
    },
    {
        id: "emotional-intelligence", title: "Emotional Intelligence Mastery", subtitle: "30 giorni per una leadership emotiva autentica", description: "Sviluppa la capacita di leggere, comprendere e guidare le emozioni per relazioni straordinarie.", longDescription: "L'intelligenza emotiva e il fattore predittivo numero uno del successo professionale. Questo percorso di 30 giorni ti insegna a utilizzare le emozioni come informazioni, non come ostacoli. Ogni settimana si focalizza su uno dei 4 pilastri: autoconsapevolezza, autoregolazione, empatia, gestione relazioni.", duration: 30, timePerDay: "20-25 min", difficulty: "Intermedio", category: "Leadership", icon: <LightBulbIcon className="w-5 h-5" />, accentColor: "#4A9ED4", accentBg: "rgba(74,158,212,0.07)", requiredPlan: "premium", xpReward: 450, rating: 4.8, completions: 950, tags: ["EQ", "Leadership", "Comunicazione", "Empatia"], whatYouLearn: ["I 4 pilastri dell'intelligenza emotiva secondo Goleman", "Tecnica del nome per domare: nominare l'emozione per gestirla", "Come ricevere e dare feedback senza attivare difese", "La finestra di Johari: espandere la consapevolezza di se", "Comunicazione non violenta in situazioni difficili"], progress: 65, currentDay: 19, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], days: [
            { day: 19, title: "La Tecnica dello Spazio", theme: "Autoregolazione", exercise: "Pratica STOP: Fermati. Respira. Osserva. Procedi consapevolmente. 5 applicazioni oggi.", duration: "20 min", realityQuest: "In una conversazione difficile, fai una pausa di 10 secondi prima di rispondere.", reflection: "Quando la pausa ha cambiato l'esito di una situazione?" },
            { day: 20, title: "Empatia Attiva", theme: "Connessione", exercise: "In ogni conversazione focalizzati solo sull'ascoltare — non preparare la risposta mentre l'altro parla.", duration: "25 min", realityQuest: "Fai UNA domanda di follow-up a qualcuno che di solito non approfondirebbe.", reflection: "Cosa hai scoperto di qualcuno che gia pensavi di conoscere?" },
        ]
    },
    {
        id: "deep-transformation", title: "Deep Transformation", subtitle: "60 giorni di metamorfosi identitaria completa", description: "Il percorso piu intenso del metodo Jara. Per chi e pronto a superare i propri blocchi profondi.", longDescription: "Deep Transformation e il cuore del metodo Jara. 60 giorni in 4 fasi: Scoperta (1-15), Destrutturazione (16-30), Ricostruzione (31-45), Integrazione (46-60). Richiede coraggio, onesta radicale e disponibilita a incontrare parti di se che di solito si evitano.", duration: 60, timePerDay: "25-30 min", difficulty: "Avanzato", category: "Identita", icon: <RocketLaunchIcon className="w-5 h-5" />, accentColor: "#9B74E0", accentBg: "rgba(155,116,224,0.07)", requiredPlan: "vip", xpReward: 800, rating: 5.0, completions: 320, tags: ["Shadow Work", "Identita", "PNL", "Resilienza"], whatYouLearn: ["Shadow work: integrare le parti di se che si evitano", "Come identificare e superare le credenze limitanti radicate", "Il metodo delle 3 identita: passato, presente, futuro", "Tecnica dell'ancora per stati emotivi ottimali", "Costruire una routine di alta performance sostenibile"], progress: 38, currentDay: 22, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], days: [
            { day: 22, title: "L'Ombra Come Alleata", theme: "Shadow Work", exercise: "Scrivi 5 tratti che NON ti piacciono negli altri. Spesso sono cio che non accettiamo in noi stessi. Dialoga con ognuno.", duration: "30 min", realityQuest: "Scegli UN tratto della tua ombra e trova come puo diventare una forza.", reflection: "Cosa hai trovato nell'ombra che non ti aspettavi?" },
            { day: 23, title: "La Mappa delle Credenze", theme: "Belief Work", exercise: "Lista le 10 credenze che guidano le tue decisioni. Divide: mi supporta / mi limita. Sfida quelle limitanti.", duration: "25 min", realityQuest: "Agisci in modo contrario a UNA credenza limitante oggi.", reflection: "Quale credenza e piu difficile da sfidare? Perche?" },
        ]
    },
    {
        id: "ikigai-discovery", title: "Ikigai Discovery Journey", subtitle: "14 giorni per trovare il tuo scopo di vita", description: "Il framework Ikigai di Michael Jara applicato in 14 sessioni per scoprire l'intersezione perfetta tra passione, talento, bisogno e valore.", longDescription: "L'Ikigai non e un concetto astratto — e un sistema pratico per prendere decisioni allineate con chi sei davvero. In 14 giorni esplori i 4 cerchi con esercizi concreti e riflessioni guidate. Al termine avrai una mappa chiara del tuo scopo.", duration: 14, timePerDay: "20-30 min", difficulty: "Principiante", category: "Ikigai", icon: <SunIcon className="w-5 h-5" />, accentColor: "#F59E0B", accentBg: "rgba(245,158,11,0.07)", requiredPlan: "free", xpReward: 250, rating: 4.9, completions: 1800, tags: ["Ikigai", "Scopo", "Valori", "Carriera"], whatYouLearn: ["I 4 cerchi dell'Ikigai e come mapparli sulla tua vita", "Come tradurre le passioni in opportunita concrete", "Identificare i tuoi talenti nascosti attraverso il feedback", "Allineare lavoro e scopo senza rivoluzionare tutto subito", "Costruire un piano d'azione per vivere il tuo Ikigai"], days: [
            { day: 1, title: "Cosa Ami Fare", theme: "Passione", exercise: "Lista 20 attivita che ti fanno perdere la nozione del tempo. Non filtrare. Poi cerchia le 5 che ti emozionano di piu.", duration: "25 min", realityQuest: "Passa 30 minuti oggi a fare qualcosa che ami senza scopo produttivo.", reflection: "Quando ti sei sentito piu vivo oggi?" },
            { day: 2, title: "In Cosa Sei Bravo", theme: "Talento", exercise: "Scrivi 10 cose in cui sei bravo. Poi chiedi a 3 persone di aggiungere alla lista. Confronta.", duration: "20 min", realityQuest: "Usa uno dei tuoi talenti per aiutare qualcuno oggi.", reflection: "Cosa ti hanno detto gli altri che non avevi considerato?" },
        ]
    },
    {
        id: "relationships", title: "Authentic Relationships", subtitle: "21 giorni per connessioni profonde e significative", description: "Trasforma le tue relazioni attraverso la comunicazione autentica e la presenza emotiva.", longDescription: "Le relazioni sono il contesto in cui diventiamo chi siamo. Questo percorso insegna a comunicare con vulnerabilita sicura, a gestire i conflitti come opportunita di crescita e a costruire connessioni che nutrono. Basato sulla Comunicazione Non Violenta di Rosenberg.", duration: 21, timePerDay: "15-25 min", difficulty: "Intermedio", category: "Relazioni", icon: <UserGroupIcon className="w-5 h-5" />, accentColor: "#EC4899", accentBg: "rgba(236,72,153,0.07)", requiredPlan: "premium", xpReward: 350, rating: 4.7, completions: 670, tags: ["CNV", "Ascolto", "Conflitto", "Intimita"], whatYouLearn: ["Comunicazione Non Violenta (CNV) di Marshall Rosenberg", "Come esprimere bisogni senza accusare", "La differenza tra ascoltare e aspettare di parlare", "Gestire il conflitto come danza, non come guerra", "Costruire intimita autentica attraverso la vulnerabilita"], days: [
            { day: 1, title: "L'Ascolto Radicale", theme: "Presenza", exercise: "In ogni conversazione oggi: non interrompere, non preparare la risposta mentre l'altro parla.", duration: "15 min", realityQuest: "Fai una conversazione di 20 minuti con qualcuno a cui tieni, senza guardare il telefono.", reflection: "Cosa hai sentito che di solito ti sfugge?" },
        ]
    },
    {
        id: "energy", title: "Energy & Vitality Reset", subtitle: "7 giorni per ripristinare energia e vitalita", description: "Un programma per resettare il sistema nervoso, migliorare il sonno e ripristinare energia sostenibile.", longDescription: "Questo percorso non e sulla dieta o sull'esercizio tradizionale. E sulla gestione dell'energia come risorsa primaria. Imparerai tecniche di respiro per il sistema nervoso, protocolli di sonno efficaci e micro-abitudini che moltiplicano la vitalita.", duration: 7, timePerDay: "10-15 min", difficulty: "Principiante", category: "Salute", icon: <BoltIcon className="w-5 h-5" />, accentColor: "#10B981", accentBg: "rgba(16,185,129,0.07)", requiredPlan: "free", xpReward: 150, rating: 4.8, completions: 1450, tags: ["Sonno", "Energia", "Respiro", "Routine"], whatYouLearn: ["Tecnica Wim Hof semplificata per energia immediata", "Il protocollo 10-3-2-1-0 per il sonno perfetto", "Come la luce mattutina regola il tuo orologio biologico", "Micro-pause che ripristinano la concentrazione in 5 minuti", "Il ruolo dell'idratazione sulla chiarezza mentale"], days: [
            { day: 1, title: "Il Grande Reset", theme: "Fondamenta", exercise: "Traccia il tuo livello di energia su 10 ogni 2 ore. Niente da cambiare ancora — solo osservare.", duration: "10 min", realityQuest: "Vai a letto 30 minuti prima del solito stasera.", reflection: "A che ora hai il picco di energia? A che ora cali?" },
        ]
    },
    {
        id: "leadership-presence", title: "Leadership Through Presence", subtitle: "30 giorni per diventare il leader che sei", description: "Un percorso avanzato per sviluppare la presenza autentica del leader attraverso la conoscenza di se.", longDescription: "La vera leadership non si impara — si incarna. 30 giorni strutturati in 4 dimensioni: visione, autenticita, coraggio e servizio. Ogni settimana sfida una dimensione con esercizi pratici e riflessioni che cambiano il modo in cui ti presenti al mondo.", duration: 30, timePerDay: "20-30 min", difficulty: "Avanzato", category: "Leadership", icon: <ShieldCheckIcon className="w-5 h-5" />, accentColor: "#D4603A", accentBg: "rgba(212,96,58,0.07)", requiredPlan: "vip", xpReward: 600, rating: 4.9, completions: 280, tags: ["Leadership", "Visione", "Autorita", "Servizio"], whatYouLearn: ["Come costruire e comunicare una visione che ispira", "La differenza tra autorita e autorevolezza", "Prendere decisioni difficili con chiarezza e velocita", "Dare feedback che trasforma senza distruggere", "Il paradosso del servizio: piu dai, piu sei potente"], days: [
            { day: 1, title: "Chi E Il Tuo Leader Interiore", theme: "Identita", exercise: "Scrivi 3 leader che ammiri. Elenca 5 qualita di ognuno. Cerchia quelle che riconosci in te.", duration: "25 min", realityQuest: "Prendi UNA decisione oggi che hai rimandato perche non eri sicuro.", reflection: "Qual e la tua idea di leadership prima di questo percorso?" },
        ]
    },
];

// ─── MODAL ─────────────────────────────────────────────────────────────────
function QuestModal({ quest, hasAccess, onClose }: { quest: Quest; hasAccess: boolean; onClose: () => void }) {
    const [tab, setTab] = useState<"overview" | "oggi" | "curriculum">(quest.progress ? "oggi" : "overview");
    const today = quest.days.find(d => d.day === quest.currentDay) ?? quest.days[0];
    const tabs = ["overview", ...(quest.progress ? ["oggi"] : []), "curriculum"] as const;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(6,6,15,0.9)", backdropFilter: "blur(12px)" }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl flex flex-col"
                style={{ background: "#0D0D20", border: `0.5px solid ${quest.accentColor}30` }}>

                <div className="p-6 pb-0 flex-shrink-0">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `${quest.accentColor}18`, color: quest.accentColor }}>{quest.icon}</div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[9px] tracking-[0.14em] uppercase px-2 py-0.5 rounded border ${planStyle[quest.requiredPlan]}`}>{planLabel[quest.requiredPlan]}</span>
                                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded border ${diffStyle[quest.difficulty]}`}>{quest.difficulty}</span>
                                </div>
                                <h2 className="font-serif text-[20px] leading-tight" style={{ color: "#F0EBE0" }}>{quest.title}</h2>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.08)", color: "#6A6560" }}>
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center flex-wrap gap-4 mb-5 text-[11px]" style={{ color: "#6A6560" }}>
                        <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" />{quest.duration} giorni</span>
                        <span className="flex items-center gap-1"><BoltIcon className="w-3.5 h-3.5" />{quest.timePerDay}</span>
                        <span className="flex items-center gap-1"><StarIcon className="w-3.5 h-3.5" style={{ color: quest.accentColor }} /><span style={{ color: quest.accentColor }}>{quest.rating}</span></span>
                        <span className="flex items-center gap-1"><CheckCircleIcon className="w-3.5 h-3.5" />{quest.completions.toLocaleString()} completamenti</span>
                        <span className="flex items-center gap-1"><SparklesIcon className="w-3.5 h-3.5" style={{ color: quest.accentColor }} /><span style={{ color: quest.accentColor }}>+{quest.xpReward} xp</span></span>
                    </div>

                    {quest.progress !== undefined && (
                        <div className="mb-5 p-4 rounded-xl" style={{ background: `${quest.accentColor}09`, border: `0.5px solid ${quest.accentColor}28` }}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[11px]" style={{ color: "#F0EBE0" }}>Progresso</span>
                                <span className="text-[11px] font-medium" style={{ color: quest.accentColor }}>Giorno {quest.currentDay}/{quest.duration} · {quest.progress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                                <motion.div className="h-full rounded-full" style={{ background: quest.accentColor }}
                                    initial={{ width: 0 }} animate={{ width: `${quest.progress}%` }} transition={{ duration: 0.7, ease: "easeOut" }} />
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {Array.from({ length: quest.duration }, (_, i) => i + 1).map(day => {
                                    const done = quest.completedDays?.includes(day);
                                    const isToday = day === quest.currentDay;
                                    return (
                                        <div key={day} className="w-5 h-5 rounded flex items-center justify-center text-[8px]"
                                            style={{ background: done ? `${quest.accentColor}20` : isToday ? `${quest.accentColor}40` : "rgba(255,255,255,0.03)", color: done ? quest.accentColor : isToday ? "#F0EBE0" : "#6A6560", border: `0.5px solid ${isToday ? quest.accentColor + "55" : "rgba(255,255,255,0.06)"}` }}>
                                            {done ? "✓" : day}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                        {tabs.map(t => (
                            <button key={t} onClick={() => setTab(t as any)}
                                className="px-4 py-2.5 text-[12px] capitalize border-b-2 -mb-px transition-all"
                                style={{ color: tab === t ? quest.accentColor : "#6A6560", borderBottomColor: tab === t ? quest.accentColor : "transparent" }}>
                                {t === "oggi" ? `Giorno ${quest.currentDay}` : t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 flex-1">
                    <AnimatePresence mode="wait">
                        {tab === "overview" && (
                            <motion.div key="ov" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
                                <p className="text-[12px] leading-relaxed mb-5" style={{ color: "rgba(240,235,224,0.6)" }}>{quest.longDescription}</p>
                                <div className="text-[9px] tracking-[0.18em] uppercase mb-3" style={{ color: "#6A6560" }}>Cosa imparerai</div>
                                <div className="flex flex-col gap-2 mb-5">
                                    {quest.whatYouLearn.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-[12px]" style={{ color: "rgba(240,235,224,0.7)" }}>
                                            <CheckSolid className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: quest.accentColor }} />{item}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {quest.tags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 rounded-full text-[10px]"
                                            style={{ background: `${quest.accentColor}10`, color: quest.accentColor, border: `0.5px solid ${quest.accentColor}25` }}>{tag}</span>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {tab === "oggi" && today && (
                            <motion.div key="og" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
                                <div className="rounded-xl p-4 mb-4" style={{ background: `${quest.accentColor}08`, border: `0.5px solid ${quest.accentColor}25` }}>
                                    <div className="text-[9px] tracking-[0.18em] uppercase mb-1" style={{ color: quest.accentColor }}>Giorno {today.day} · {today.theme}</div>
                                    <div className="font-serif text-[18px] mb-3" style={{ color: "#F0EBE0" }}>{today.title}</div>
                                    <div className="text-[9px] tracking-[0.12em] uppercase mb-1.5" style={{ color: "#6A6560" }}>Esercizio · {today.duration}</div>
                                    <p className="text-[12px] leading-relaxed mb-4" style={{ color: "rgba(240,235,224,0.7)" }}>{today.exercise}</p>
                                    <div className="p-3 rounded-lg mb-3" style={{ background: "rgba(201,168,76,0.07)", border: "0.5px solid rgba(201,168,76,0.22)" }}>
                                        <div className="text-[9px] tracking-[0.12em] uppercase mb-1.5 flex items-center gap-1.5" style={{ color: "#C9A84C" }}>
                                            <FireSolid className="w-3 h-3" />Reality Quest
                                        </div>
                                        <p className="text-[12px] leading-relaxed" style={{ color: "rgba(240,235,224,0.8)" }}>{today.realityQuest}</p>
                                    </div>
                                    <div className="text-[9px] tracking-[0.12em] uppercase mb-1.5" style={{ color: "#6A6560" }}>Domanda di riflessione</div>
                                    <p className="text-[12px] italic leading-relaxed" style={{ color: "rgba(240,235,224,0.55)" }}>"{today.reflection}"</p>
                                </div>
                                <button className="w-full py-3 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2"
                                    style={{ background: quest.accentColor, color: "#06060F" }}>
                                    <PlayIcon className="w-4 h-4" />Inizia la sessione di oggi
                                </button>
                            </motion.div>
                        )}
                        {tab === "curriculum" && (
                            <motion.div key="cu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
                                <div className="flex flex-col gap-2">
                                    {quest.days.map(day => {
                                        const done = quest.completedDays?.includes(day.day);
                                        const isToday = day.day === quest.currentDay;
                                        return (
                                            <div key={day.day} className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                                                style={{ background: isToday ? `${quest.accentColor}0A` : "rgba(255,255,255,0.02)", border: `0.5px solid ${isToday ? quest.accentColor + "30" : "rgba(255,255,255,0.06)"}` }}>
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                                    style={{ background: done ? `${quest.accentColor}20` : isToday ? quest.accentColor : "rgba(255,255,255,0.04)", color: done ? quest.accentColor : isToday ? "#06060F" : "#6A6560", border: `0.5px solid ${done || isToday ? quest.accentColor + "40" : "rgba(255,255,255,0.06)"}` }}>
                                                    {done ? <CheckCircleIcon className="w-4 h-4" /> : <span className="text-[10px] font-medium">{day.day}</span>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-[12px]" style={{ color: "#F0EBE0" }}>{day.title}</span>
                                                        {isToday && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${quest.accentColor}22`, color: quest.accentColor }}>oggi</span>}
                                                    </div>
                                                    <div className="text-[10px]" style={{ color: "#6A6560" }}>{day.theme} · {day.duration}</div>
                                                </div>
                                                <ChevronRightIcon className="w-3.5 h-3.5 flex-shrink-0 mt-1.5" style={{ color: "#6A6560" }} />
                                            </div>
                                        );
                                    })}
                                    {quest.duration > quest.days.length && (
                                        <div className="text-center text-[11px] py-2" style={{ color: "#6A6560" }}>+ altri {quest.duration - quest.days.length} giorni di contenuto</div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="px-6 pb-6 flex-shrink-0">
                    {hasAccess ? (
                        <button className="w-full py-3.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2"
                            style={{ background: quest.accentColor, color: "#06060F" }}>
                            {quest.progress ? <><PlayIcon className="w-4 h-4" />Continua · Giorno {quest.currentDay}</> : <><RocketLaunchIcon className="w-4 h-4" />Inizia il percorso</>}
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <button className="w-full py-3.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2"
                                style={{ background: "#C9A84C", color: "#06060F" }}>
                                <SparklesIcon className="w-4 h-4" />Sblocca con piano {planLabel[quest.requiredPlan]}
                            </button>
                            <p className="text-center text-[10px]" style={{ color: "#6A6560" }}>Accedi a questa e tutte le quest {planLabel[quest.requiredPlan]}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
const QuestsPage: React.FC = () => {
    const { userPlan, userXP, userStreak } = useAccount();
    const [cat, setCat] = useState("Tutte");
    const [selected, setSelected] = useState<Quest | null>(null);

    const active = QUESTS.filter(q => (q.progress ?? 0) > 0);
    const filtered = QUESTS.filter(q => cat === "Tutte" || q.category === cat);
    const featured = QUESTS[0];

    const cV = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
    const iV = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.26, ease: "easeOut" } } };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full" style={{ background: "rgba(201,168,76,0.035)", filter: "blur(120px)" }} />
                <div className="absolute -bottom-10 -left-10 w-[380px] h-[380px] rounded-full" style={{ background: "rgba(155,116,224,0.04)", filter: "blur(120px)" }} />
            </div>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <p className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color: "#C9A84C" }}>Metodo Jara · Percorsi di trasformazione</p>
                <h1 className="font-serif text-[40px] font-normal leading-tight mb-2" style={{ color: "#F0EBE0" }}>
                    Le tue <em className="italic" style={{ color: "#C9A84C" }}>Quests</em>
                </h1>
                <div className="flex items-center gap-4 text-[12px]" style={{ color: "#6A6560" }}>
                    <span>{active.length} percorsi attivi</span>
                    <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
                    <span className="flex items-center gap-1"><FireSolid className="w-3.5 h-3.5 text-orange-400" />{userStreak} giorni streak</span>
                    <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
                    <span style={{ color: "#C9A84C" }}>{userXP.toLocaleString()} xp totali</span>
                </div>
            </motion.div>

            {/* Attivi */}
            {active.length > 0 && (
                <motion.section variants={cV} initial="hidden" animate="visible" className="mb-12">
                    <div className="text-[9px] tracking-[0.2em] uppercase mb-4" style={{ color: "#6A6560" }}>In corso</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {active.map(q => (
                            <motion.div key={q.id} variants={iV} onClick={() => setSelected(q)}
                                className="group relative rounded-xl p-4 cursor-pointer overflow-hidden"
                                style={{ background: q.accentBg, border: `0.5px solid ${q.accentColor}28` }}
                                whileHover={{ y: -2, borderColor: `${q.accentColor}55` }} transition={{ duration: 0.16 }}>
                                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${q.accentColor}55,transparent)` }} />
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${q.accentColor}20`, color: q.accentColor }}>{q.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[12px] font-medium truncate leading-tight" style={{ color: "#F0EBE0" }}>{q.title}</div>
                                        <div className="text-[10px] mt-0.5" style={{ color: q.accentColor }}>Giorno {q.currentDay}/{q.duration}</div>
                                    </div>
                                    <span className="text-[11px] font-medium flex-shrink-0" style={{ color: q.accentColor }}>{q.progress}%</span>
                                </div>
                                <div className="h-[3px] rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <motion.div className="h-full rounded-full" style={{ background: q.accentColor }}
                                        initial={{ width: 0 }} animate={{ width: `${q.progress}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} />
                                </div>
                                <button className="w-full py-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5"
                                    style={{ background: `${q.accentColor}14`, color: q.accentColor, border: `0.5px solid ${q.accentColor}35` }}>
                                    <PlayIcon className="w-3 h-3" />Continua
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Featured */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.32, delay: 0.1 }}
                onClick={() => setSelected(featured)}
                className="relative overflow-hidden rounded-2xl p-8 md:p-10 mb-10 cursor-pointer group"
                style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.08) 0%,rgba(90,50,180,0.1) 100%)", border: "0.5px solid rgba(201,168,76,0.28)" }}
                whileHover={{ scale: 1.004 }} transition={{ duration: 0.16 }}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.55),transparent)" }} />
                <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full pointer-events-none" style={{ background: "rgba(201,168,76,0.06)", filter: "blur(40px)" }} />
                <div className="relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] tracking-[0.18em] uppercase font-medium mb-5"
                        style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "0.5px solid rgba(201,168,76,0.3)" }}>
                        <SparklesIcon className="w-3 h-3" />Quest in Evidenza · {featured.completions.toLocaleString()} completamenti
                    </div>
                    <h2 className="font-serif text-[34px] font-normal mb-3 leading-tight" style={{ color: "#F0EBE0" }}>
                        The Art of <em className="italic" style={{ color: "#C9A84C" }}>Mindful Living</em>
                    </h2>
                    <p className="text-[13px] mb-6 leading-relaxed max-w-md" style={{ color: "rgba(240,235,224,0.55)" }}>{featured.description}</p>
                    <div className="flex flex-wrap items-center gap-2.5 mb-7">
                        {[`${featured.duration} Giorni`, featured.difficulty, `${featured.timePerDay}/giorno`, `+${featured.xpReward} XP`, `★ ${featured.rating}`].map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full text-[11px]"
                                style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.09)", color: "rgba(240,235,224,0.6)" }}>{tag}</span>
                        ))}
                    </div>
                    <button className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[13px] font-medium tracking-wide transition-all group-hover:gap-4"
                        style={{ background: "#C9A84C", color: "#06060F" }}>
                        {featured.progress ? <><PlayIcon className="w-4 h-4" />Continua · Giorno {featured.currentDay}</> : <><RocketLaunchIcon className="w-4 h-4" />Inizia il Tuo Viaggio</>}
                        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </motion.div>

            {/* Filtri */}
            <div className="mb-7">
                <div className="text-[9px] tracking-[0.2em] uppercase mb-3" style={{ color: "#6A6560" }}>Esplora per categoria</div>
                <div className="flex flex-wrap gap-2">
                    {CATS.map((c, i) => (
                        <motion.button key={c} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.04 }}
                            onClick={() => setCat(c)}
                            className="px-4 py-2 rounded-lg text-[12px] tracking-wide border transition-all"
                            style={cat === c ? { background: "rgba(201,168,76,0.1)", borderColor: "rgba(201,168,76,0.35)", color: "#EDD980" } : { background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)", color: "#6A6560" }}>
                            {c}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
                <motion.div key={cat} variants={cV} initial="hidden" animate="visible" exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(q => {
                        const ok = canAccess(userPlan, q.requiredPlan);
                        return (
                            <motion.div key={q.id} variants={iV} onClick={() => setSelected(q)}
                                className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 ${!ok ? "opacity-60" : ""}`}
                                style={{ background: "rgba(255,255,255,0.022)", borderColor: "rgba(255,255,255,0.07)" }}
                                whileHover={ok ? { y: -3, borderColor: `${q.accentColor}40`, background: q.accentBg } : { scale: 0.99 }}>
                                <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ background: `linear-gradient(90deg,transparent,${q.accentColor}65,transparent)` }} />
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3.5">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ background: `${q.accentColor}18`, color: ok ? q.accentColor : "#6A6560" }}>
                                            {ok ? q.icon : <LockClosedIcon className="w-5 h-5" />}
                                        </div>
                                        <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 rounded border ${planStyle[q.requiredPlan]}`}>{planLabel[q.requiredPlan]}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <span className={`text-[9px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded border ${diffStyle[q.difficulty]}`}>{q.difficulty}</span>
                                        <span className="text-[10px]" style={{ color: "#6A6560" }}>{q.category}</span>
                                    </div>
                                    <h4 className="font-serif text-[16px] font-normal mb-1.5 leading-snug" style={{ color: "#F0EBE0" }}>{q.title}</h4>
                                    <p className="text-[11px] leading-relaxed mb-4" style={{ color: "#6A6560" }}>{q.subtitle}</p>
                                    {(q.progress ?? 0) > 0 && (
                                        <div className="mb-3">
                                            <div className="flex justify-between text-[10px] mb-1.5">
                                                <span style={{ color: "#6A6560" }}>Giorno {q.currentDay}/{q.duration}</span>
                                                <span style={{ color: q.accentColor }}>{q.progress}%</span>
                                            </div>
                                            <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                                                <motion.div className="h-full rounded-full" style={{ background: q.accentColor }}
                                                    initial={{ width: 0 }} animate={{ width: `${q.progress}%` }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }} />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-[10px] mb-4" style={{ color: "#6A6560" }}>
                                        <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" />{q.duration}g</span>
                                        <span className="flex items-center gap-1"><BoltIcon className="w-3 h-3" />{q.timePerDay}</span>
                                        <span className="flex items-center gap-1"><StarIcon className="w-3 h-3" style={{ color: q.accentColor }} /><span style={{ color: q.accentColor }}>{q.rating}</span></span>
                                        <span className="flex items-center gap-1"><SparklesIcon className="w-3 h-3" style={{ color: q.accentColor }} /><span style={{ color: q.accentColor }}>+{q.xpReward}</span></span>
                                    </div>
                                    <button className="w-full py-2.5 rounded-lg text-[11px] font-medium tracking-wide border transition-all"
                                        style={!ok ? { background: "rgba(255,255,255,0.03)", color: "#6A6560", borderColor: "rgba(255,255,255,0.06)" }
                                            : (q.progress ?? 0) > 0 ? { background: `${q.accentColor}16`, color: q.accentColor, borderColor: `${q.accentColor}38` }
                                                : { background: "rgba(201,168,76,0.1)", color: "#C9A84C", borderColor: "rgba(201,168,76,0.28)" }}>
                                        {!ok ? `🔒 Sblocca ${planLabel[q.requiredPlan]}` : (q.progress ?? 0) > 0 ? `Continua · Giorno ${q.currentDay} →` : "Inizia Quest →"}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

            {filtered.some(q => !canAccess(userPlan, q.requiredPlan)) && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="mt-8 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                    style={{ background: "rgba(155,116,224,0.06)", border: "0.5px solid rgba(155,116,224,0.2)" }}>
                    <div>
                        <div className="text-[13px] font-medium mb-1" style={{ color: "#F0EBE0" }}>Alcune quest richiedono un piano superiore</div>
                        <div className="text-[12px]" style={{ color: "#6A6560" }}>Sblocca tutto con Premium o VIP — include Il Consiglio degli Archetipi, Reality Quest AI e sessioni vocali.</div>
                    </div>
                    <button className="flex-shrink-0 px-6 py-2.5 rounded-lg text-[12px] font-medium tracking-wide whitespace-nowrap" style={{ background: "#C9A84C", color: "#06060F" }}>Scopri i piani →</button>
                </motion.div>
            )}

            <AnimatePresence>
                {selected && <QuestModal quest={selected} hasAccess={canAccess(userPlan, selected.requiredPlan)} onClose={() => setSelected(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default QuestsPage;