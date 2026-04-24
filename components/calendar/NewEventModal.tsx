import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';

const colors = {
    primary: "#5B4B8A",
    secondary: "#7E6BC4",
    accent: "#399D9E"
};

interface NewEventModalProps {
    onClose: () => void;
    onSave: (eventData: any) => void;
}

const NewEventModal: React.FC<NewEventModalProps> = ({ onClose, onSave }) => {
    const [eventData, setEventData] = useState({
        title: '',
        type: 'personal',
        date: new Date(),
        time: '10:00',
        duration: 60,
        description: ''
    });

    const handleSave = () => {
        if (eventData.title.trim()) {
            onSave(eventData);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
                <div
                    className="p-6 text-white rounded-t-2xl"
                    style={{ backgroundColor: colors.primary }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <PlusIcon className="w-6 h-6" />
                            <div>
                                <h2 className="text-lg font-semibold">Nuovo Evento</h2>
                                <p className="text-white text-opacity-90 text-sm">Aggiungi un evento personale</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                        >
                            <span className="text-white">×</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Titolo evento
                        </label>
                        <input
                            type="text"
                            value={eventData.title}
                            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Es. Allenamento personale"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo evento
                        </label>
                        <select
                            value={eventData.type}
                            onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="personal">Personale</option>
                            <option value="session">Sessione</option>
                            <option value="meditation">Meditazione</option>
                            <option value="calm">Relax</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Data
                            </label>
                            <input
                                type="date"
                                value={eventData.date.toISOString().split('T')[0]}
                                onChange={(e) => setEventData({ ...eventData, date: new Date(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ora
                            </label>
                            <input
                                type="time"
                                value={eventData.time}
                                onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Durata (minuti)
                        </label>
                        <input
                            type="number"
                            value={eventData.duration}
                            onChange={(e) => setEventData({ ...eventData, duration: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            min="15"
                            max="180"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrizione (opzionale)
                        </label>
                        <textarea
                            value={eventData.description}
                            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="3"
                            placeholder="Aggiungi una descrizione..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Annulla
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!eventData.title.trim()}
                            className="flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: colors.primary }}
                        >
                            Salva Evento
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default NewEventModal;
