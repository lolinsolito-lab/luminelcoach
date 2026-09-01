import {
    HeartIcon, HandRaisedIcon, SparklesIcon, LightBulbIcon,
    SunIcon, MoonIcon, CloudIcon, BoltIcon, CheckBadgeIcon, FingerPrintIcon,
} from "@heroicons/react/24/outline";
import React from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface Path {
    id: string;
    title: string;
    description: string;
    duration: string;
    category: string;
    imageUrl: string;
    audioUrl?: string;   // Supabase Storage URL — aggiungere in produzione
    plan: "free" | "premium" | "vip";
    frequency?: string;
    benefits?: string[];
}

export interface Meditation {
    id: string;
    title: string;
    description: string;
    category: string;
    duration: string;
    icon: string;
    image?: string;
    audioUrl?: string;   // Supabase Storage URL — aggiungere in produzione
    goals: string[];
    popularity: number;
    isNew: boolean;
    plan: "free" | "premium" | "vip";
    instructor?: string;
    transcript?: string; // Per accessibilità
}

// ─── CALM SPACE — percorsi per umore ─────────────────────────────────────────
export const predefinedPaths: Record<string, Path[]> = {
    "Mindfulness": [
        {
            id: "mind-1",
            title: "Osserva il Respiro",
            description: "La pratica fondamentale di ritorno al presente. Impara a usare il respiro come ancora nella quotidianità.",
            duration: "7 min",
            category: "Mindfulness",
            imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
            audioUrl: "", // TODO: /storage/v1/object/public/audio/mind-1.mp3
            plan: "free",
            frequency: "Quotidiana",
            benefits: ["Riduce la reattività", "Aumenta la concentrazione", "Crea spazio tra stimolo e risposta"],
        },
        {
            id: "mind-2",
            title: "Passeggiata Consapevole",
            description: "Trasforma ogni passo in meditazione. Ideale per chi non riesce a stare fermo ma vuole la calma.",
            duration: "10 min",
            category: "Mindfulness",
            imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
            audioUrl: "",
            plan: "free",
            frequency: "Quotidiana",
            benefits: ["Integra mindfulness nella vita", "Riduce pensieri automatici", "Connette corpo e mente"],
        },
        {
            id: "mind-3",
            title: "Osservazione dei Pensieri",
            description: "I pensieri sono nuvole — tu sei il cielo. Pratica avanzata di defusione cognitiva.",
            duration: "12 min",
            category: "Mindfulness",
            imageUrl: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80",
            audioUrl: "",
            plan: "premium",
            frequency: "3-4 volte/settimana",
            benefits: ["Separa sé dall'identità mentale", "Riduce ruminazione", "Aumenta chiarezza decisionale"],
        },
    ],

    "Ansia": [
        {
            id: "ansia-1",
            title: "Respirazione 4-7-8",
            description: "La tecnica del Dr. Andrew Weil. Attiva il sistema nervoso parasimpatico in 4 cicli. Scientificamente validata.",
            duration: "5 min",
            category: "Ansia",
            imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&q=80",
            audioUrl: "",
            plan: "free",
            frequency: "Al bisogno",
            benefits: ["Abbassa cortisolo in 4 minuti", "Blocca risposta fight-or-flight", "Uso pratico immediato"],
        },
        {
            id: "ansia-2",
            title: "Grounding 5-4-3-2-1",
            description: "Tecnica sensoriale per uscire dal loop ansioso. Usata dalla terapia EMDR e dalla DBT.",
            duration: "7 min",
            category: "Ansia",
            imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80",
            audioUrl: "",
            plan: "free",
            frequency: "Al bisogno",
            benefits: ["Ritorno immediato al presente", "Interrompe attacchi di panico", "Non richiede pratica previa"],
        },
        {
            id: "ansia-3",
            title: "Body Scan Anti-Ansia",
            description: "Identifica dove l'ansia si deposita nel corpo e scioglila progressivamente dalla testa ai piedi.",
            duration: "15 min",
            category: "Ansia",
            imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
            audioUrl: "",
            plan: "premium",
            frequency: "Serale",
            benefits: ["Rilascia tensione somatica", "Migliora propriocezione", "Prepara al sonno"],
        },
    ],

    "Pace": [
        {
            id: "pace-1",
            title: "Momento di Silenzio Totale",
            description: "Non fare nulla. Letteralmente. Un'arte perduta nell'era della notifica costante.",
            duration: "5 min",
            category: "Pace",
            imageUrl: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&q=80",
            audioUrl: "",
            plan: "free",
            frequency: "Mattina",
        },
        {
            id: "pace-2",
            title: "Rilassamento Muscolare Progressivo",
            description: "Tecnica di Jacobson. Contrai e rilassa ogni gruppo muscolare sequenzialmente.",
            duration: "12 min",
            category: "Pace",
            imageUrl: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80",
            audioUrl: "",
            plan: "premium",
            frequency: "Pre-sonno",
            benefits: ["Elimina tensione cronica", "Migliora qualità del sonno", "Riduce cefalee da stress"],
        },
    ],

    "Self-Love": [
        {
            id: "self-1",
            title: "Compassione verso Se Stessi",
            description: "Loving-Kindness Meditation focalizzata su di sé. Antidoto al critico interiore.",
            duration: "15 min",
            category: "Self-Love",
            imageUrl: "https://images.unsplash.com/photo-1518531933037-9a61605450ee?w=800&q=80",
            audioUrl: "",
            plan: "premium",
            benefits: ["Riduce auto-critica", "Sviluppa resilienza emotiva", "Base per relazioni sane"],
        },
        {
            id: "self-2",
            title: "Specchio dell'Amore",
            description: "Pratica trasformativa di Marisa Peer. Guarda te stesso come il tuo migliore amico.",
            duration: "10 min",
            category: "Self-Love",
            imageUrl: "https://images.unsplash.com/photo-1515023115689-589c33041697?w=800&q=80",
            audioUrl: "",
            plan: "vip",
            benefits: ["Ricostruisce autostima profonda", "Spezza pattern di auto-sabotaggio"],
        },
    ],

    "Energia": [
        {
            id: "energy-1",
            title: "Pranayama Energizzante",
            description: "Kapalabhati e Bhastrika. Due respiri yogici per azzerare la stanchezza in 3 minuti.",
            duration: "3 min",
            category: "Energia",
            imageUrl: "https://images.unsplash.com/photo-1502086223501-68119136a64b?w=800&q=80",
            audioUrl: "",
            plan: "free",
            frequency: "Mattina o post-pranzo",
            benefits: ["Ossigenazione rapida", "Sveglia il sistema nervoso", "Alternativa al caffè"],
        },
        {
            id: "energy-2",
            title: "Visualizzazione Vitalità",
            description: "Tecnica HypnoGym. Immagina il tuo corpo pieno di luce dorata espansiva.",
            duration: "7 min",
            category: "Energia",
            imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
            audioUrl: "",
            plan: "premium",
            benefits: ["Aumenta motivazione psicofisica", "Usata dagli atleti olimpici"],
        },
    ],

    "Gratitudine": [
        {
            id: "grat-1",
            title: "Tre Gratitudini Profonde",
            description: "Non fare la lista — sentila. Ogni gratitudine va vissuta nel corpo, non solo pensata.",
            duration: "5 min",
            category: "Gratitudine",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            audioUrl: "",
            plan: "free",
            frequency: "Mattina",
            benefits: ["Riorienta il focus sul positivo", "Riduce comparazione sociale", "Migliora umore duraturo"],
        },
        {
            id: "grat-2",
            title: "Lettera di Gratitudine",
            description: "Scrivi a qualcuno che ha cambiato la tua vita. Non deve inviarla — l'atto stesso trasforma.",
            duration: "15 min",
            category: "Gratitudine",
            imageUrl: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=80",
            audioUrl: "",
            plan: "premium",
        },
    ],

    "Focus": [
        {
            id: "focus-1",
            title: "Tecnica Pomodoro Meditativo",
            description: "25 minuti di focus assoluto con micro-reset meditativo. Il metodo di Andrew Huberman adattato.",
            duration: "10 min",
            category: "Focus",
            imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
            audioUrl: "",
            plan: "premium",
            benefits: ["Triplica produttività", "Riduce distrazioni croniche"],
        },
        {
            id: "focus-2",
            title: "Concentrazione su Oggetto Singolo",
            description: "Pratica Trataka. Focalizza tutta l'attenzione su un singolo punto per 10 minuti.",
            duration: "12 min",
            category: "Focus",
            imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
            audioUrl: "",
            plan: "premium",
        },
    ],

    "Sonno": [
        {
            id: "sonno-1",
            title: "Racconto della Luna Piena",
            description: "Sleep story immersivo con frequenze Delta (0.5-4Hz) incorporate. Addormentati in 8 minuti.",
            duration: "20 min",
            category: "Sonno",
            imageUrl: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&q=80",
            audioUrl: "",
            plan: "vip",
            benefits: ["Frequenze Delta certificate", "Nessun side effect", "Migliora sonno profondo NREM"],
        },
        {
            id: "sonno-2",
            title: "Yoga Nidra — Sonno Yogico",
            description: "45 minuti di Yoga Nidra equivalgono a 3 ore di sonno normale. Tecnica tantrica adattata.",
            duration: "20 min",
            category: "Sonno",
            imageUrl: "https://images.unsplash.com/photo-1511296933631-18b5f0bc0846?w=800&q=80",
            audioUrl: "",
            plan: "premium",
        },
    ],
};

// ─── MOOD → CATEGORIE ─────────────────────────────────────────────────────────
// Collega il mood selector della Dashboard al Calm Space
export const moodBasedSuggestions: Record<string, string[]> = {
    // Dashboard mood IDs → categorie Calm Space
    "focused": ["Mindfulness", "Focus", "Energia"],
    "inspired": ["Gratitudine", "Self-Love", "Mindfulness"],
    "calm": ["Pace", "Mindfulness", "Gratitudine"],
    "anxious": ["Ansia", "Pace", "Mindfulness"],
    "tired": ["Energia", "Sonno", "Pace"],
    "lost": ["Self-Love", "Gratitudine", "Ansia"],
    // Mood Calm Space interno (label italiano)
    "Sereno": ["Gratitudine", "Mindfulness", "Pace"],
    "Felice": ["Energia", "Gratitudine", "Self-Love"],
    "Neutro": ["Focus", "Self-Love", "Pace"],
    "Ansioso": ["Ansia", "Mindfulness", "Pace"],
    "Giù": ["Self-Love", "Energia", "Pace"],
};

// ─── MEDITAZIONI — libreria completa ─────────────────────────────────────────
export const meditationData: Meditation[] = [
    // ── PRINCIPIANTE ──
    {
        id: "beg-breath",
        title: "Respirazione Consapevole",
        description: "Il punto di partenza di ogni percorso meditativo. Semplice, efficace, trasformativo.",
        category: "Principiante",
        duration: "5min",
        icon: "🌱",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        audioUrl: "",
        goals: ["calm", "awareness"],
        popularity: 98,
        isNew: false,
        plan: "free",
        instructor: "Metodo Jara",
    },
    {
        id: "beg-body-scan",
        title: "Body Scan Base",
        description: "Impara a sentire il tuo corpo dall'interno. Il fondamento della mindfulness clinica MBSR.",
        category: "Principiante",
        duration: "10min",
        icon: "🌱",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
        audioUrl: "",
        goals: ["calm", "awareness"],
        popularity: 92,
        isNew: false,
        plan: "free",
        instructor: "Metodo Jara",
    },
    {
        id: "beg-guided",
        title: "Primi Passi Guidati",
        description: "Meditazione completamente guidata per chi inizia. Nessuna esperienza richiesta.",
        category: "Principiante",
        duration: "10min",
        icon: "🌱",
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
        audioUrl: "",
        goals: ["awareness"],
        popularity: 95,
        isNew: true,
        plan: "free",
    },

    // ── MATTINA ──
    {
        id: "morning-rise",
        title: "Risveglio Consapevole",
        description: "Inizia la giornata con intenzione. I primi 10 minuti del mattino determinano tutto il resto.",
        category: "Mattina",
        duration: "10min",
        icon: "🌅",
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80",
        audioUrl: "",
        goals: ["energy", "awareness"],
        popularity: 91,
        isNew: false,
        plan: "free",
        instructor: "Metodo Jara",
    },
    {
        id: "morning-intention",
        title: "Impostazione dell'Intenzione",
        description: "Definisci la tua parola guida del giorno. Pratica del Metodo Jara — 15 minuti che cambiano il day.",
        category: "Mattina",
        duration: "15min",
        icon: "🌅",
        image: "https://images.unsplash.com/photo-1502086223501-68119136a64b?w=800&q=80",
        audioUrl: "",
        goals: ["awareness", "growth"],
        popularity: 87,
        isNew: true,
        plan: "premium",
        instructor: "Michael Jara",
    },

    // ── NOTTE ──
    {
        id: "night-sleep",
        title: "Preparazione al Sonno",
        description: "Sciogli la giornata. Rilascia ogni pensiero, ogni tensione, ogni non detto.",
        category: "Notte",
        duration: "20min",
        icon: "🌙",
        image: "https://images.unsplash.com/photo-1511296933631-18b5f0bc0846?w=800&q=80",
        audioUrl: "",
        goals: ["sleep"],
        popularity: 96,
        isNew: false,
        plan: "premium",
    },
    {
        id: "night-yoga-nidra",
        title: "Yoga Nidra — Sonno Profondo",
        description: "La pratica dei mistici indiani. 20 minuti = 3 ore di sonno. Certificato dai ricercatori dell'Università di Stanford.",
        category: "Notte",
        duration: "20min",
        icon: "🌙",
        image: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&q=80",
        audioUrl: "",
        goals: ["sleep"],
        popularity: 89,
        isNew: false,
        plan: "vip",
        instructor: "Metodo Jara · Tradizione Tantrica",
    },

    // ── INTERMEDIO ──
    {
        id: "int-mindfulness",
        title: "Mindfulness Quotidiana",
        description: "Pratica di 15 minuti per integrare la consapevolezza in ogni aspetto della vita.",
        category: "Intermedio",
        duration: "15min",
        icon: "🌿",
        image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80",
        audioUrl: "",
        goals: ["awareness", "calm"],
        popularity: 88,
        isNew: false,
        plan: "premium",
    },
    {
        id: "int-compassion",
        title: "Loving-Kindness (Metta)",
        description: "Irradia amore verso te stesso, poi verso gli altri. La meditazione più ricercata al mondo per il benessere.",
        category: "Intermedio",
        duration: "20min",
        icon: "🌿",
        image: "https://images.unsplash.com/photo-1518531933037-9a61605450ee?w=800&q=80",
        audioUrl: "",
        goals: ["growth"],
        popularity: 85,
        isNew: false,
        plan: "premium",
    },
    {
        id: "int-focus",
        title: "Potenzia la Concentrazione",
        description: "Tecnica Dharana. Fissa la mente su un oggetto. Usata dai trader e atleti di élite.",
        category: "Intermedio",
        duration: "20min",
        icon: "🌿",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        audioUrl: "",
        goals: ["focus"],
        popularity: 87,
        isNew: true,
        plan: "premium",
    },

    // ── AVANZATO ──
    {
        id: "adv-vipassana",
        title: "Vipassana — Visione Profonda",
        description: "La radice di tutte le meditazioni buddhiste. Osserva la natura impermanente di tutto ciò che percepisci.",
        category: "Avanzato",
        duration: "30min",
        icon: "🌳",
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
        audioUrl: "",
        goals: ["awareness", "growth"],
        popularity: 75,
        isNew: false,
        plan: "vip",
        instructor: "Tradizione Theravada · adattata da Michael Jara",
    },
    {
        id: "adv-zen",
        title: "Zazen — Meditazione Zen",
        description: "Semplicemente sedersi. La pratica più radicale: nessun obiettivo, nessun raggiungimento. Solo essere.",
        category: "Avanzato",
        duration: "45min",
        icon: "🌳",
        image: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&q=80",
        audioUrl: "",
        goals: ["focus", "awareness"],
        popularity: 72,
        isNew: false,
        plan: "vip",
    },

    // ── RILASSAMENTO ──
    {
        id: "relax-anti-stress",
        title: "Anti-Stress Express",
        description: "5 minuti. Qualsiasi momento. Abbassa il cortisolo e torna al centro.",
        category: "Rilassamento",
        duration: "5min",
        icon: "🕊️",
        image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&q=80",
        audioUrl: "",
        goals: ["calm"],
        popularity: 97,
        isNew: false,
        plan: "free",
    },
    {
        id: "relax-anxiety",
        title: "Calmare l'Ansia",
        description: "Guida passo-passo per uscire dal loop ansioso. Usata in psicoterapia cognitivo-comportamentale.",
        category: "Rilassamento",
        duration: "15min",
        icon: "🕊️",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        audioUrl: "",
        goals: ["calm"],
        popularity: 94,
        isNew: false,
        plan: "premium",
    },

    // ── GUIDATA ──
    {
        id: "guided-ikigai",
        title: "Viaggio nell'Ikigai",
        description: "Meditazione guidata esclusiva del Metodo Jara. Scopri il tuo scopo di vita attraverso le 4 sfere.",
        category: "Guidata",
        duration: "30min",
        icon: "⭕",
        image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80",
        audioUrl: "",
        goals: ["awareness", "growth"],
        popularity: 99,
        isNew: true,
        plan: "vip",
        instructor: "Michael Jara",
    },
    {
        id: "guided-shadow",
        title: "Shadow Work Guidato",
        description: "Incontra la tua ombra — la parte di te che eviti. Jung + Metodo Jara. Solo per chi è pronto.",
        category: "Guidata",
        duration: "45min",
        icon: "🌑",
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
        audioUrl: "",
        goals: ["growth", "awareness"],
        popularity: 88,
        isNew: true,
        plan: "vip",
        instructor: "Michael Jara",
    },
];

// ─── FILTRI ───────────────────────────────────────────────────────────────────
export const goals = [
    { id: "focus", name: "Concentrazione", description: "Aumenta la tua capacità di focalizzarti", icon: LightBulbIcon },
    { id: "calm", name: "Calma", description: "Riduci ansia e stress", icon: CloudIcon },
    { id: "sleep", name: "Sonno", description: "Migliora la qualità del sonno", icon: MoonIcon },
    { id: "energy", name: "Energia", description: "Aumenta la vitalità", icon: SunIcon },
    { id: "awareness", name: "Consapevolezza", description: "Sviluppa presenza e mindfulness", icon: FingerPrintIcon },
    { id: "growth", name: "Crescita", description: "Evoluzione personale e spirituale", icon: CheckBadgeIcon },
];

export const durations = [
    { value: "5min", label: "5 minuti" },
    { value: "10min", label: "10 minuti" },
    { value: "15min", label: "15 minuti" },
    { value: "20min", label: "20 minuti" },
    { value: "30min", label: "30 minuti" },
    { value: "45min", label: "45 minuti" },
];