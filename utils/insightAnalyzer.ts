import { EmotionalState } from '../contexts/EmotionalStateContext';

export interface EmotionalMetric {
    date: string;
    stress: number;
    sleep: number;
    energy: number;
    mood: number;
}

export interface AICorrelation {
    id: string;
    condition: string;
    outcome: string;
    improvement: number;
    icon: string;
    color: string;
}

/**
 * Insight Analyzer
 * Generates mock emotional metrics and AI correlations
 */
export class InsightAnalyzer {
    /**
     * Generate emotional metrics for the last 30 days (mock)
     */
    static generateEmotionalMetrics(): EmotionalMetric[] {
        const metrics: EmotionalMetric[] = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Generate realistic trending data
            const trendFactor = (30 - i) / 30; // Improvement over time
            const randomVariation = () => Math.random() * 2 - 1; // -1 to +1

            metrics.push({
                date: date.toLocaleDateString('it-IT', { month: 'short', day: 'numeric' }),
                stress: Math.max(1, Math.min(10, 7 - (trendFactor * 3) + randomVariation())),
                sleep: Math.max(1, Math.min(10, 5 + (trendFactor * 3) + randomVariation())),
                energy: Math.max(1, Math.min(10, 4 + (trendFactor * 4) + randomVariation())),
                mood: Math.max(1, Math.min(10, 5 + (trendFactor * 3.5) + randomVariation()))
            });
        }

        return metrics;
    }

    /**
     * Calculate AI correlations based on user activity patterns
     */
    static generateCorrelations(emotionalState?: EmotionalState): AICorrelation[] {
        const baseCorrelations: AICorrelation[] = [
            {
                id: 'morning-meditation',
                condition: 'Meditazione al mattino',
                outcome: 'Energia aumentata',
                improvement: 40,
                icon: '🌅',
                color: 'from-orange-400 to-yellow-400'
            },
            {
                id: 'pre-sleep',
                condition: 'Meditazione pre-sonno',
                outcome: 'Qualità del sonno',
                improvement: 35,
                icon: '🌙',
                color: 'from-blue-400 to-indigo-400'
            },
            {
                id: 'breathing',
                condition: 'Esercizi di respirazione',
                outcome: 'Stress ridotto',
                improvement: 45,
                icon: '🌿',
                color: 'from-green-400 to-emerald-400'
            },
            {
                id: 'consistency',
                condition: 'Pratica quotidiana',
                outcome: 'Benessere generale',
                improvement: 50,
                icon: '✨',
                color: 'from-purple-400 to-pink-400'
            }
        ];

        // Add contextual correlation based on emotional state
        if (emotionalState === 'ansioso') {
            baseCorrelations.unshift({
                id: 'grounding',
                condition: 'Tecniche di grounding',
                outcome: 'Ansia ridotta',
                improvement: 55,
                icon: '🧘',
                color: 'from-teal-400 to-cyan-400'
            });
        } else if (emotionalState === 'stanco') {
            baseCorrelations.unshift({
                id: 'power-nap',
                condition: 'Meditazione di 15min',
                outcome: 'Energia recuperata',
                improvement: 38,
                icon: '⚡',
                color: 'from-yellow-400 to-orange-400'
            });
        }

        return baseCorrelations.slice(0, 4); // Return top 4
    }

    /**
     * Calculate mood distribution for pie chart
     */
    static getMoodDistribution(): { name: string; value: number; color: string }[] {
        return [
            { name: 'Calmo', value: 35, color: '#10b981' },
            { name: 'Energico', value: 25, color: '#f59e0b' },
            { name: 'Ispirato', value: 20, color: '#8b5cf6' },
            { name: 'Neutro', value: 12, color: '#6b7280' },
            { name: 'Ansioso', value: 8, color: '#ef4444' }
        ];
    }

    /**
     * Get weekly average improvement
     */
    static getWeeklyImprovement(): number {
        return 18; // 18% average improvement this week
    }
}
