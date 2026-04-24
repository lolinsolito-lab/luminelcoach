import {
    HeartIcon, HandRaisedIcon, SparklesIcon, LightBulbIcon,
    SunIcon, PaperAirplaneIcon, MoonIcon, CloudIcon,
    BoltIcon, CheckBadgeIcon, FingerPrintIcon
} from '@heroicons/react/24/outline';
import React from 'react';

// --- Types ---

export interface Path {
    id: string;
    title: string;
    description: string;
    duration: string;
    category: string;
    imageUrl: string;
    plan: 'free' | 'premium' | 'vip';
}

export interface Course {
    id: string;
    title: string;
    description: string;
    duration: string;
    price: string;
    category: string;
    imageUrl: string;
}

export interface Meditation {
    id: string;
    title: string;
    description: string;
    category: string;
    duration: string;
    icon: string;
    image?: string; // Optional: URL from Google Drive via Make/Sheets integration
    goals: string[];
    popularity: number;
    isNew: boolean;
    plan: 'free' | 'premium' | 'vip';
}

// --- Calm Data ---

export const predefinedPaths: Record<string, Path[]> = {
    "Mindfulness": [
        {
            id: "mind-1",
            title: "Osserva il Respiro",
            description: "Meditazione base di consapevolezza",
            duration: "7 min",
            category: "Mindfulness",
            imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
            plan: 'free'
        },
        {
            id: "mind-2",
            title: "Passeggiata Consapevole",
            description: "Pratica di mindfulness in movimento",
            duration: "10 min",
            category: "Mindfulness",
            imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
            plan: 'free'
        }
    ],
    "Self-Love": [
        {
            id: "self-1",
            title: "Accettazione e Compassione",
            description: "Meditazione guidata di auto-compassione",
            duration: "15 min",
            category: "Self-Love",
            imageUrl: "https://images.unsplash.com/photo-1518531933037-9a61605450ee?w=800&q=80",
            plan: 'vip'
        },
        {
            id: "self-2",
            title: "Specchio dell'Amore",
            description: "Pratica per coltivare l'amore verso sé stessi",
            duration: "5 min",
            category: "Self-Love",
            imageUrl: "https://images.unsplash.com/photo-1515023115689-589c33041697?w=800&q=80",
            plan: 'premium'
        }
    ],
    "Gratitudine": [
        {
            id: "grat-1",
            title: "Tre Motivi di Oggi",
            description: "Pratica di gratitudine quotidiana",
            duration: "3 min",
            category: "Gratitudine",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
            plan: 'free'
        },
        {
            id: "grat-2",
            title: "Cuore Grato",
            description: "Meditazione sulla gratitudine",
            duration: "5 min",
            category: "Gratitudine",
            imageUrl: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=80",
            plan: 'free'
        }
    ],
    "Focus": [
        {
            id: "focus-1",
            title: "Concentra la Mente",
            description: "Esercizio per migliorare la concentrazione",
            duration: "10 min",
            category: "Focus",
            imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
            plan: 'premium'
        },
        {
            id: "focus-2",
            title: "Mindfulness per la Concentrazione",
            description: "Pratica mindfulness per migliorare la concentrazione",
            duration: "12 min",
            category: "Focus",
            imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
            plan: 'premium'
        }
    ],
    "Energia": [
        {
            id: "energy-1",
            title: "Ritmo Cardiaco",
            description: "Esercizio energizzante per la mattina",
            duration: "3 min",
            category: "Energia",
            imageUrl: "https://images.unsplash.com/photo-1502086223501-68119136a64b?w=800&q=80",
            plan: 'free'
        },
        {
            id: "energy-2",
            title: "Power Stretch",
            description: "Allungamento energizzante per il corpo",
            duration: "7 min",
            category: "Energia",
            imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
            plan: 'free'
        }
    ],
    "Pace": [
        {
            id: "pace-1",
            title: "Momento di Silenzio",
            description: "Ascolto del silenzio interno con respiri lenti",
            duration: "5 min",
            category: "Pace",
            imageUrl: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&q=80",
            plan: 'premium'
        },
        {
            id: "pace-2",
            title: "Rilassamento Guidato",
            description: "Meditazione guidata per raggiungere la tranquillità",
            duration: "12 min",
            category: "Pace",
            imageUrl: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80",
            plan: 'premium'
        }
    ],
    "Sonno": [
        {
            id: "sonno-1",
            title: "Racconto Luna Piena",
            description: "Una storia rilassante per addormentarsi",
            duration: "20 min",
            category: "Sonno",
            imageUrl: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&q=80",
            plan: 'vip'
        },
        {
            id: "sonno-2",
            title: "Ninna Nanna Zen",
            description: "Suoni rilassanti per un sonno profondo",
            duration: "15 min",
            category: "Sonno",
            imageUrl: "https://images.unsplash.com/photo-1511296933631-18b5f0bc0846?w=800&q=80",
            plan: 'premium'
        }
    ],
    "Ansia": [
        {
            id: "ansia-1",
            title: "Respira in 4-7-8",
            description: "Tecnica per ridurre lo stress",
            duration: "5 min",
            category: "Ansia",
            imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&q=80",
            plan: 'premium'
        },
        {
            id: "ansia-2",
            title: "Respirazione Consapevole",
            description: "Pratica di respirazione per ridurre l'ansia",
            duration: "7 min",
            category: "Ansia",
            imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80",
            plan: 'premium'
        }
    ]
};

export const predefinedCourses: Record<string, Course> = {
    "Mindfulness": {
        id: "course-mind",
        title: "Mindful Moments",
        description: "Introduzione pratica alla mindfulness",
        duration: "7 giorni",
        price: "€9.99",
        category: "Mindfulness",
        imageUrl: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80"
    },
    "Self-Love": {
        id: "course-self",
        title: "Self-Love Masterclass",
        description: "Percorso guidato verso l'amore per sé stessi",
        duration: "30 giorni",
        price: "€19.99",
        category: "Self-Love",
        imageUrl: "https://images.unsplash.com/photo-1518531933037-9a61605450ee?w=800&q=80"
    },
    "Gratitudine": {
        id: "course-grat",
        title: "Gratitude Journal",
        description: "Trasforma la tua vita con la pratica della gratitudine",
        duration: "30 giorni",
        price: "€9.99",
        category: "Gratitudine",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
    },
    "Focus": {
        id: "course-focus",
        title: "Attention Boost",
        description: "Strategie per migliorare la concentrazione",
        duration: "7 giorni",
        price: "€11.99",
        category: "Focus",
        imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80"
    },
    "Energia": {
        id: "course-energy",
        title: "Morning Spark",
        description: "Routine energizzante per iniziare la giornata",
        duration: "7 giorni",
        price: "€7.99",
        category: "Energia",
        imageUrl: "https://images.unsplash.com/photo-1502086223501-68119136a64b?w=800&q=80"
    },
    "Pace": {
        id: "course-pace",
        title: "Tranquility Mind Journey",
        description: "Pratiche quotidiane di meditazione per la pace interiore",
        duration: "10 giorni",
        price: "€12.99",
        category: "Pace",
        imageUrl: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&q=80"
    },
    "Sonno": {
        id: "course-sonno",
        title: "Sleep & Restore",
        description: "Programma completo per migliorare la qualità del sonno",
        duration: "30 giorni",
        price: "€19.99",
        category: "Sonno",
        imageUrl: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&q=80"
    },
    "Ansia": {
        id: "course-ansia",
        title: "Anxiety Management Mastery",
        description: "Tecniche avanzate per gestire l'ansia",
        duration: "14 giorni",
        price: "€14.99",
        category: "Ansia",
        imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&q=80"
    }
};

export const moodBasedSuggestions: Record<string, string[]> = {
    "Sereno": ["Gratitudine", "Mindfulness", "Pace"],
    "Felice": ["Energia", "Gratitudine", "Self-Love"],
    "Neutro": ["Focus", "Self-Love", "Pace"],
    "Ansioso": ["Ansia", "Mindfulness", "Pace"],
    "Giù": ["Self-Love", "Energia", "Pace"]
};

// --- Meditation Data ---

export const meditationData: Meditation[] = [
    // Principiante
    {
        id: "beginner-breath",
        title: "Respirazione Consapevole",
        description: "Introduzione alla meditazione attraverso la respirazione",
        category: "Principiante",
        duration: "5min",
        icon: "🌱",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80", // Peaceful breathing
        goals: ["calm", "awareness"],
        popularity: 98,
        isNew: false,
        plan: 'free'
    },
    {
        id: "beginner-body-scan",
        title: "Body Scan Base",
        description: "Esplora la consapevolezza del corpo",
        category: "Principiante",
        duration: "10min",
        icon: "🌱",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", // Person meditating
        goals: ["calm", "awareness"],
        popularity: 92,
        isNew: false,
        plan: 'free'
    },
    {
        id: "beginner-guided",
        title: "Primi Passi Guidati",
        description: "Meditazione completamente guidata per principianti",
        category: "Principiante",
        duration: "10min",
        icon: "🌱",
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80", // Gentle nature
        goals: ["awareness"],
        popularity: 95,
        isNew: true,
        plan: 'free'
    },

    // Intermedio
    {
        id: "intermediate-mindfulness",
        title: "Mindfulness Quotidiana",
        description: "Pratica di consapevolezza per la vita di tutti i giorni",
        category: "Intermedio",
        duration: "15min",
        icon: "🌿",
        image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80", // Zen stones
        goals: ["awareness", "calm"],
        popularity: 88,
        isNew: false,
        plan: 'premium'
    },
    {
        id: "intermediate-compassion",
        title: "Compassione Amorevole",
        description: "Sviluppa gentilezza verso te stesso e gli altri",
        category: "Intermedio",
        duration: "20min",
        icon: "🌿",
        image: "https://images.unsplash.com/photo-1518531933037-9a61605450ee?w=800&q=80", // Heart hands
        goals: ["growth"],
        popularity: 85,
        isNew: false,
        plan: 'premium'
    },
    {
        id: "intermediate-energy",
        title: "Ricarica Energetica",
        description: "Risveglia l'energia vitale attraverso la meditazione",
        category: "Intermedio",
        duration: "15min",
        icon: "🌿",
        image: "https://images.unsplash.com/photo-1502086223501-68119136a64b?w=800&q=80", // Energetic sunrise
        goals: ["energy"],
        popularity: 82,
        isNew: true,
        plan: 'premium'
    },

    // Avanzato
    {
        id: "advanced-vipassana",
        title: "Vipassana",
        description: "Meditazione di visione profonda",
        category: "Avanzato",
        duration: "30min",
        icon: "🌳",
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80", // Deep meditation
        goals: ["awareness", "growth"],
        popularity: 75,
        isNew: false,
        plan: 'vip'
    },
    {
        id: "advanced-zen",
        title: "Meditazione Zen",
        description: "Pratica tradizionale Zen",
        category: "Avanzato",
        duration: "45min",
        icon: "🌳",
        image: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=800&q=80", // Zen garden
        goals: ["focus", "awareness"],
        popularity: 72,
        isNew: false,
        plan: 'vip'
    },

    // Guidata
    {
        id: "guided-anxiety",
        title: "Calmare l'Ansia",
        description: "Meditazione guidata per ridurre l'ansia",
        category: "Guidata",
        duration: "15min",
        icon: "🧘‍♀️",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // Peaceful water
        goals: ["calm"],
        popularity: 94,
        isNew: false,
        plan: 'premium'
    },
    {
        id: "guided-focus",
        title: "Potenzia la Concentrazione",
        description: "Migliora la tua capacità di focalizzazione",
        category: "Guidata",
        duration: "20min",
        icon: "🧘‍♀️",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", // Focus workspace
        goals: ["focus"],
        popularity: 87,
        isNew: true,
        plan: 'premium'
    },

    // Silenziosa
    {
        id: "silent-breath",
        title: "Silenzio e Respiro",
        description: "Meditazione silenziosa focalizzata sul respiro",
        category: "Silenziosa",
        duration: "20min",
        icon: "🧘‍♂️",
        image: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80", // Quiet nature
        goals: ["focus", "calm"],
        popularity: 81,
        isNew: false,
        plan: 'vip'
    },

    // Mattina
    {
        id: "morning-awakening",
        title: "Risveglio Consapevole",
        description: "Inizia la giornata con presenza e chiarezza",
        category: "Mattina",
        duration: "10min",
        icon: "🌅",
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80", // Beautiful sunrise
        goals: ["energy", "awareness"],
        popularity: 91,
        isNew: false,
        plan: 'free'
    },

    // Notte
    {
        id: "night-sleep",
        title: "Preparazione al Sonno",
        description: "Rilassa mente e corpo per un sonno profondo",
        category: "Notte",
        duration: "20min",
        icon: "🌙",
        image: "https://images.unsplash.com/photo-1511296933631-18b5f0bc0846?w=800&q=80", // Peaceful night
        goals: ["sleep"],
        popularity: 96,
        isNew: false,
        plan: 'premium'
    },

    // Rilassamento
    {
        id: "relax-stress",
        title: "Anti-Stress Express",
        description: "Riduzione rapida dello stress in pochi minuti",
        category: "Rilassamento",
        duration: "5min",
        icon: "🕊️",
        image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&q=80", // Calming waves
        goals: ["calm"],
        popularity: 97,
        isNew: false,
        plan: 'free'
    }
];

export const goals = [
    { id: "focus", name: "Concentrazione", description: "Aumenta la tua capacità di focalizzarti", icon: LightBulbIcon },
    { id: "calm", name: "Calma", description: "Riduce ansia e stress", icon: CloudIcon },
    { id: "sleep", name: "Sonno", description: "Migliora la qualità del sonno", icon: MoonIcon },
    { id: "energy", name: "Energia", description: "Aumenta la vitalità", icon: SunIcon },
    { id: "awareness", name: "Consapevolezza", description: "Sviluppa presenza e mindfulness", icon: FingerPrintIcon },
    { id: "growth", name: "Crescita", description: "Evoluzione personale e spirituale", icon: CheckBadgeIcon }
];

export const durations = [
    { value: "5min", label: "5 minuti" },
    { value: "10min", label: "10 minuti" },
    { value: "15min", label: "15 minuti" },
    { value: "20min", label: "20 minuti" },
    { value: "30min", label: "30 minuti" },
    { value: "45min", label: "45 minuti" },
    { value: "60min", label: "60 minuti" },
];
