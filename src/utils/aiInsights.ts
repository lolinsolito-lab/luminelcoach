import { EmotionalState } from '../contexts/EmotionalStateContext';

export interface AIInsight {
    id: string;
    message: string;
    type: 'motivation' | 'suggestion' | 'reminder' | 'celebration' | 'observation';
    icon: string;
    color: string;
    priority: number; // 1-10, higher = more important
}

interface UserPattern {
    emotionalState: EmotionalState;
    streak: number;
    lastActivity?: string;
    completedCourses?: number;
    favoriteTime?: 'morning' | 'afternoon' | 'evening';
}

/**
 * AI Insights Generator
 * Analyzes user patterns and generates personalized messages
 */
export class AIInsightsEngine {
    /**
     * Generate contextual insights based on user data
     */
    static generateInsights(pattern: UserPattern): AIInsight[] {
        const insights: AIInsight[] = [];

        // Emotional state-based insights
        if (pattern.emotionalState) {
            insights.push(...this.getEmotionalInsights(pattern.emotionalState));
        }

        // Streak-based insights
        if (pattern.streak) {
            insights.push(...this.getStreakInsights(pattern.streak));
        }

        // Activity-based insights
        if (pattern.lastActivity) {
            insights.push(...this.getActivityInsights(pattern));
        }

        // Sort by priority and return top insights
        return insights.sort((a, b) => b.priority - a.priority).slice(0, 3);
    }

    /**
     * Get insights based on emotional state
     */
    private static getEmotionalInsights(state: EmotionalState): AIInsight[] {
        const insights: AIInsight[] = [];

        switch (state) {
            case 'alegre':
                insights.push({
                    id: 'alegre-energy',
                    message: 'Che energia! Sfruttiamola con una sessione dinamica di crescita personale.',
                    type: 'suggestion',
                    icon: '🚀',
                    color: 'from-yellow-400 to-orange-400',
                    priority: 8
                });
                break;

            case 'ansioso':
                insights.push({
                    id: 'ansioso-breathing',
                    message: 'Respira. Ho preparato tecniche di grounding per calmare la mente.',
                    type: 'suggestion',
                    icon: '🌿',
                    color: 'from-green-400 to-emerald-400',
                    priority: 9
                });
                break;

            case 'stanco':
                insights.push({
                    id: 'stanco-rest',
                    message: 'Il riposo è parte della crescita. Prova la meditazione notturna guidata.',
                    type: 'suggestion',
                    icon: '😴',
                    color: 'from-blue-400 to-indigo-400',
                    priority: 9
                });
                break;

            case 'depresso':
                insights.push({
                    id: 'depresso-compassion',
                    message: 'Sei coraggioso a riconoscere come ti senti. Pratica auto-compassione con me.',
                    type: 'suggestion',
                    icon: '💜',
                    color: 'from-purple-400 to-pink-400',
                    priority: 10
                });
                break;

            case 'triste':
                insights.push({
                    id: 'triste-uplift',
                    message: 'Le emozioni passano come nuvole. Ti guido verso la serenità.',
                    type: 'suggestion',
                    icon: '☁️',
                    color: 'from-cyan-400 to-blue-400',
                    priority: 9
                });
                break;

            case 'calmo':
                insights.push({
                    id: 'calmo-deepen',
                    message: 'Perfetto stato per approfondire. Esploriamo insieme la mindfulness avanzata.',
                    type: 'suggestion',
                    icon: '🧘',
                    color: 'from-green-400 to-teal-400',
                    priority: 7
                });
                break;

            case 'ispirato':
                insights.push({
                    id: 'ispirato-create',
                    message: 'L\'ispirazione è preziosa! Canalizziamola in un esercizio di journaling.',
                    type: 'suggestion',
                    icon: '✨',
                    color: 'from-purple-400 to-pink-400',
                    priority: 8
                });
                break;
        }

        return insights;
    }

    /**
     * Get insights based on streak
     */
    private static getStreakInsights(streak: number): AIInsight[] {
        const insights: AIInsight[] = [];

        if (streak === 7) {
            insights.push({
                id: 'streak-7',
                message: '🎉 7 giorni consecutivi! La costanza è la chiave della trasformazione.',
                type: 'celebration',
                icon: '🔥',
                color: 'from-orange-400 to-red-400',
                priority: 9
            });
        } else if (streak === 30) {
            insights.push({
                id: 'streak-30',
                message: '👑 UN MESE! Hai dimostrato disciplina straordinaria. Sei un esempio.',
                type: 'celebration',
                icon: '👑',
                color: 'from-yellow-400 to-amber-400',
                priority: 10
            });
        } else if (streak > 0 && streak % 5 === 4) {
            // One day before milestone
            insights.push({
                id: 'streak-almost',
                message: `Sei a un giorno dal traguardo ${streak + 1} giorni! Non fermarti ora.`,
                type: 'motivation',
                icon: '🎯',
                color: 'from-purple-400 to-pink-400',
                priority: 8
            });
        } else if (streak >= 3) {
            insights.push({
                id: 'streak-maintain',
                message: `${streak} giorni di fila! Continua così, la crescita è esponenziale.`,
                type: 'motivation',
                icon: '💪',
                color: 'from-blue-400 to-cyan-400',
                priority: 6
            });
        }

        return insights;
    }

    /**
     * Get activity-based insights
     */
    private static getActivityInsights(pattern: UserPattern): AIInsight[] {
        const insights: AIInsight[] = [];

        // Mock: Pattern detection (in real app would analyze actual data)
        if (pattern.favoriteTime === 'morning') {
            insights.push({
                id: 'morning-pattern',
                message: 'Ho notato che mediti meglio al mattino. Vuoi pianificare una sessione quotidiana?',
                type: 'observation',
                icon: '🌅',
                color: 'from-orange-300 to-yellow-300',
                priority: 7
            });
        }

        if (pattern.completedCourses && pattern.completedCourses >= 3) {
            insights.push({
                id: 'course-master',
                message: `${pattern.completedCourses} corsi completati! Sei pronto per contenuti avanzati.`,
                type: 'celebration',
                icon: '📚',
                color: 'from-indigo-400 to-purple-400',
                priority: 7
            });
        }

        return insights;
    }

    /**
     * Get a single prioritized insight (for compact display)
     */
    static getTopInsight(pattern: UserPattern): AIInsight | null {
        const insights = this.generateInsights(pattern);
        return insights.length > 0 ? insights[0] : null;
    }
}
