import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: 'Lun', minutes: 30 },
    { name: 'Mar', minutes: 45 },
    { name: 'Mer', minutes: 20 },
    { name: 'Gio', minutes: 60 },
    { name: 'Ven', minutes: 40 },
    { name: 'Sab', minutes: 90 },
    { name: 'Dom', minutes: 55 },
];

const ProgressChart: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-luminel-champagne dark:bg-slate-900 p-6 rounded-3xl border border-luminel-taupe/20 dark:border-slate-800 shadow-sm h-full"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-luminel-smoke dark:text-white">La Tua Evoluzione</h3>
                    <p className="text-sm text-luminel-taupe dark:text-slate-400">Minuti di pratica questa settimana</p>
                </div>
                <select className="bg-white dark:bg-slate-800 border border-luminel-taupe/20 text-sm rounded-lg px-3 py-2 text-luminel-smoke dark:text-slate-300 focus:ring-2 focus:ring-luminel-gold-soft">
                    <option>Questa Settimana</option>
                    <option>Mese Scorso</option>
                </select>
            </div>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#C1B7A3" opacity={0.3} className="dark:stroke-slate-700" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6A6A6A', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6A6A6A', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Bar dataKey="minutes" radius={[6, 6, 0, 0]} barSize={32}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.minutes > 50 ? '#D6C29B' : '#F5EDE2'}
                                    className="transition-all duration-300 hover:opacity-80"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ProgressChart;
