import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useEmotionalState } from '../../contexts/EmotionalStateContext';
import { InsightAnalyzer } from '../../utils/insightAnalyzer';

const TransformationInsights: React.FC = () => {
    const { currentState } = useEmotionalState();

    const emotionalMetrics = useMemo(() => InsightAnalyzer.generateEmotionalMetrics(), []);
    const correlations = useMemo(() => InsightAnalyzer.generateCorrelations(currentState), [currentState]);
    const moodDistribution = useMemo(() => InsightAnalyzer.getMoodDistribution(), []);

    const luxuryGradients = [
        'from-[#FFF5EB] to-[#FFF0F5] border-orange-100 text-orange-800', // Morning/Energy (Orange/Peach)
        'from-[#F0F7FF] to-[#E6E6FA] border-blue-100 text-blue-800',     // Sleep (Blue/Lavender)
        'from-[#F0FFF4] to-[#F5FFFA] border-green-100 text-green-800',   // Breath (Green/Mint)
        'from-[#FAF5FF] to-[#FFF0F5] border-purple-100 text-purple-800'  // Practice (Purple/Pink)
    ];

    // Pastel colors matching the cards above
    const moodColors: Record<string, string> = {
        'Calmo': '#A3E4D7',    // Mint (matches Breath/Green card)
        'Energico': '#FFDAB9', // Peach (matches Morning/Orange card)
        'Ispirato': '#DDA0DD', // Plum/Lavender (matches Practice/Purple card)
        'Neutro': '#B0C4DE',   // LightSteelBlue (matches Sleep/Blue card)
        'Ansioso': '#FCA5A5'   // Pastel Red (Soft alert)
    };

    // Override colors for display
    const styledCorrelations = correlations.map((c, i) => ({
        ...c,
        styleClass: luxuryGradients[i % luxuryGradients.length]
    }));

    const styledMoodData = moodDistribution.map((d) => ({
        ...d,
        color: moodColors[d.name] || '#CBD5E1' // Fallback to slate
    }));

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                    <p className="font-semibold text-slate-800 mb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value.toFixed(1)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8">
            {/* Emotional Metrics Trend */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />

                <div className="relative z-10">
                    <h3 className="text-xl font-serif font-bold text-slate-800 mb-6">Metriche Emotive</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={emotionalMetrics}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                style={{ fontSize: '12px', fontFamily: 'Inter' }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                domain={[0, 10]}
                                stroke="#94a3b8"
                                style={{ fontSize: '12px', fontFamily: 'Inter' }}
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} iconType="circle" />
                            <Line type="monotone" dataKey="stress" name="Armonia" stroke="#6EE7B7" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            <Line type="monotone" dataKey="sleep" name="Riposo" stroke="#93C5FD" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                            <Line type="monotone" dataKey="energy" name="Vitalità" stroke="#FDBA74" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Grid: AI Correlations + Mood Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Correlations */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/60">
                    <h3 className="text-xl font-serif font-bold text-slate-800 mb-2">Correlazioni AI</h3>
                    <p className="text-sm text-slate-500 mb-6 font-medium tracking-wide uppercase text-xs">Pattern della tua pratica</p>

                    <div className="space-y-4">
                        {styledCorrelations.map((correlation, index) => (
                            <motion.div
                                key={correlation.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className={`relative p-5 rounded-2xl border bg-gradient-to-br ${correlation.styleClass} transition-all hover:shadow-md hover:-translate-y-0.5`}>
                                <div className="flex items-start gap-4">
                                    <div className="text-2xl p-2 bg-white/60 rounded-xl backdrop-blur-sm shadow-sm">
                                        {correlation.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-slate-800">{correlation.condition}</span>
                                            <span className="text-sm font-bold px-2 py-1 bg-white/50 rounded-lg backdrop-blur-sm shadow-sm">
                                                +{correlation.improvement}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm opacity-80 mt-1">
                                            <span className="w-1 h-1 rounded-full bg-current" />
                                            <span>{correlation.outcome}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Mood Distribution */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100/60 flex flex-col">
                    <h3 className="text-xl font-serif font-bold text-slate-800 mb-2">Stati d'Animo</h3>
                    <p className="text-sm text-slate-500 mb-6 font-medium tracking-wide uppercase text-xs">Ultimi 30 giorni</p>

                    <div className="flex-1 flex items-center justify-center relative">
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-3xl font-serif font-bold text-slate-800">30</span>
                            <span className="text-xs text-slate-400 uppercase tracking-widest">Giorni</span>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={styledMoodData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {styledMoodData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#475569', fontWeight: 600 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Custom Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {styledMoodData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-sm text-slate-600 font-medium">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Insight - Redesigned */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="relative overflow-hidden bg-gradient-to-r from-[#FDFBF7] to-[#FFF5EB] rounded-[2rem] p-8 border border-[#F5E6D3] shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5E6D3]/20 rounded-full blur-3xl -mr-20 -mt-20" />

                <div className="relative z-10 flex items-start gap-6">
                    <div className="p-4 bg-white rounded-2xl shadow-sm text-3xl border border-[#F5E6D3]/50">
                        💡
                    </div>
                    <div>
                        <h4 className="font-serif font-bold text-xl text-slate-800 mb-3">Insight Chiave</h4>
                        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
                            La tua costanza sta dando frutti! Nelle ultime 4 settimane, il tuo livello di stress
                            è diminuito del <span className="font-bold text-[#D4B483] bg-[#D4B483]/10 px-2 py-0.5 rounded-lg">28%</span> mentre
                            l'energia è aumentata del <span className="font-bold text-[#D4B483] bg-[#D4B483]/10 px-2 py-0.5 rounded-lg">35%</span>.
                            Continua così! 🌟
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TransformationInsights;
