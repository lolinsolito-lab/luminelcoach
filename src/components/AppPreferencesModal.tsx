import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XMarkIcon,
    BellIcon,
    SunIcon,
    LanguageIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface AppPreferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AppPreferencesModal: React.FC<AppPreferencesModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUserProfile } = useAuth();
    const { theme, setTheme } = useTheme();

    // Local state for preferences
    const [notifications, setNotifications] = useState(user?.privacyConsents?.notifications ?? true);
    const [language, setLanguage] = useState<'it' | 'en'>(() => {
        const saved = localStorage.getItem('app_language');
        return (saved === 'it' || saved === 'en') ? saved : 'it';
    });
    const [isLoading, setIsLoading] = useState(false);

    // Sync notifications with user data when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setNotifications(user.privacyConsents?.notifications ?? true);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsLoading(true);

        // Update user preferences in AuthContext
        await updateUserProfile({
            privacyConsents: {
                ...user?.privacyConsents,
                notifications,
                dataProcessing: user?.privacyConsents?.dataProcessing ?? true,
                analytics: user?.privacyConsents?.analytics ?? true,
            }
        });

        // Save language to localStorage
        localStorage.setItem('app_language', language);

        setIsLoading(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Preferenze App</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">

                                {/* Notifications */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                            <BellIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white">Notifiche</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Ricevi promemoria giornalieri</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(!notifications)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                                            }`}
                                    >
                                        <motion.div
                                            animate={{ x: notifications ? 24 : 0 }}
                                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                                        />
                                    </button>
                                </div>

                                {/* Theme Section Removed - Light Mode Only */}

                                {/* Language */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
                                            <LanguageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white">Lingua</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Seleziona la lingua dell'app</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setLanguage('it')}
                                            className={`p-3 rounded-xl border-2 transition-all ${language === 'it'
                                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                                                : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700'
                                                }`}
                                        >
                                            <div className="text-sm font-bold text-slate-800 dark:text-white">🇮🇹 Italiano</div>
                                        </button>
                                        <button
                                            onClick={() => setLanguage('en')}
                                            className={`p-3 rounded-xl border-2 transition-all ${language === 'en'
                                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                                                : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700'
                                                }`}
                                        >
                                            <div className="text-sm font-bold text-slate-800 dark:text-white">🇬🇧 English</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <CheckIcon className="w-5 h-5" />
                                                Salva
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AppPreferencesModal;
