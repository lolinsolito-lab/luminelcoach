import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCircleIcon,
    ShieldCheckIcon,
    BellIcon,
    SwatchIcon,
    LockClosedIcon,
    CreditCardIcon,
    QuestionMarkCircleIcon,
    ChevronRightIcon,
    MoonIcon,
    SunIcon,
    ArrowRightOnRectangleIcon,
    CameraIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

// Colori tema
const colors = {
    primary: "#5B4B8A",
    secondary: "#7E6BC4",
    accent: "#399D9E",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    yellow: "#FBBF24"
};

const SettingsPage: React.FC = () => {
    const { user, signOut } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false,
        updates: true
    });
    const [fontSize, setFontSize] = useState('medium');

    // Load saved settings
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const menuItems = [
        { id: 'profile', label: 'Profilo', icon: UserCircleIcon },
        { id: 'security', label: 'Sicurezza', icon: ShieldCheckIcon },
        { id: 'notifications', label: 'Notifiche', icon: BellIcon },
        { id: 'appearance', label: 'Aspetto', icon: SwatchIcon },
        { id: 'privacy', label: 'Privacy', icon: LockClosedIcon },
        { id: 'subscription', label: 'Abbonamento', icon: CreditCardIcon },
        { id: 'support', label: 'Supporto', icon: QuestionMarkCircleIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Impostazioni</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Menu */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeSection === item.id
                                        ? 'bg-luminel-champagne text-luminel-taupe border-l-4 border-luminel-taupe'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-luminel-taupe' : 'text-gray-400'}`} />
                                    {item.label}
                                </button>
                            ))}

                            <div className="border-t border-gray-100 mt-2 pt-2">
                                <button
                                    onClick={signOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                    Esci
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl shadow-sm p-6 md:p-8"
                        >
                            {/* Profile Section */}
                            {activeSection === 'profile' && (
                                <div className="space-y-8">
                                    <h2 className="text-xl font-semibold text-gray-900">Profilo Pubblico</h2>

                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-luminel-champagne flex items-center justify-center text-luminel-gold-soft text-3xl font-bold border-4 border-white shadow-md">
                                                {user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50">
                                                <CameraIcon className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{user?.name || 'Utente'}</h3>
                                            <p className="text-gray-500">{user?.email}</p>
                                            <button className="mt-2 text-sm text-luminel-gold-soft font-medium hover:text-luminel-taupe">
                                                Cambia foto profilo
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                            <input
                                                type="text"
                                                defaultValue={user?.name || ''}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminel-gold-soft focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                defaultValue={user?.email || ''}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                            <textarea
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luminel-gold-soft focus:border-transparent"
                                                placeholder="Raccontaci qualcosa di te..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t">
                                        <button className="px-4 py-2 bg-luminel-gold-soft text-white rounded-lg font-medium hover:bg-luminel-taupe transition-colors">
                                            Salva Modifiche
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Security Section */}
                            {activeSection === 'security' && (
                                <div className="space-y-8">
                                    <h2 className="text-xl font-semibold text-gray-900">Sicurezza</h2>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-900">Cambia Password</h3>
                                        <div className="grid grid-cols-1 gap-4 max-w-md">
                                            <input
                                                type="password"
                                                placeholder="Password attuale"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Nuova password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Conferma nuova password"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors self-start">
                                                Aggiorna Password
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Autenticazione a due fattori</h3>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">Proteggi il tuo account</p>
                                                <p className="text-sm text-gray-500">Aggiungi un livello di sicurezza extra.</p>
                                            </div>
                                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                                                Configura 2FA
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Section */}
                            {activeSection === 'notifications' && (
                                <div className="space-y-8">
                                    <h2 className="text-xl font-semibold text-gray-900">Preferenze Notifiche</h2>

                                    <div className="space-y-6">
                                        {[
                                            { id: 'email', label: 'Notifiche Email', desc: 'Ricevi aggiornamenti sui tuoi progressi via email' },
                                            { id: 'push', label: 'Notifiche Push', desc: 'Ricevi notifiche in tempo reale sul browser' },
                                            { id: 'marketing', label: 'Comunicazioni Marketing', desc: 'Ricevi offerte e novità sui prodotti' },
                                            { id: 'updates', label: 'Aggiornamenti App', desc: 'Notifiche su nuove funzionalità e miglioramenti' }
                                        ].map((item) => (
                                            <div key={item.id} className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{item.label}</h3>
                                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof notifications] }))}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.id as keyof typeof notifications] ? 'bg-luminel-gold-soft' : 'bg-gray-200'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.id as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Appearance Section */}
                            {/* Appearance Section */}
                            {activeSection === 'appearance' && (
                                <div className="space-y-8">
                                    <h2 className="text-xl font-semibold text-gray-900">Aspetto</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-4">Dimensione Testo</h3>
                                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl max-w-md">
                                                <span className="text-sm text-gray-500">Aa</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="2"
                                                    step="1"
                                                    value={fontSize === 'small' ? 0 : fontSize === 'medium' ? 1 : 2}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        setFontSize(val === 0 ? 'small' : val === 1 ? 'medium' : 'large');
                                                    }}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-luminel-gold-soft"
                                                />
                                                <span className="text-lg text-gray-900 font-bold">Aa</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Privacy Section */}
                            {activeSection === 'privacy' && (
                                <div className="space-y-8">
                                    <h2 className="text-xl font-semibold text-gray-900">Privacy</h2>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-sm text-yellow-800">
                                            La tua privacy è importante per noi. Leggi la nostra <a href="#" className="font-medium underline">Privacy Policy</a> completa.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-4 border-b">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Visibilità Profilo</h3>
                                                <p className="text-sm text-gray-500">Rendi il tuo profilo visibile agli altri membri</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-luminel-gold-soft">
                                                <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between py-4 border-b">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Condivisione Dati</h3>
                                                <p className="text-sm text-gray-500">Condividi dati anonimi per migliorare il servizio</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                                                <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Subscription Section */}
                            {activeSection === 'subscription' && (
                                <div className="space-y-8">
                                    <h2 className="text-xl font-semibold text-gray-900">Il Tuo Piano</h2>

                                    <div className="bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-soft rounded-xl p-6 text-white shadow-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                                                <p className="text-luminel-champagne">Accesso illimitato a tutti i contenuti</p>
                                            </div>
                                            <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                                                Attivo
                                            </span>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-white border-opacity-20 flex justify-between items-center">
                                            <span className="text-sm text-luminel-champagne">Rinnovo: 15 Maggio 2025</span>
                                            <span className="font-bold text-xl">€9.99/mese</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-medium text-gray-900">Metodo di Pagamento</h3>
                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                                                    VISA
                                                </div>
                                                <span className="text-gray-700">•••• 4242</span>
                                            </div>
                                            <button className="text-sm font-medium text-luminel-gold-soft hover:text-luminel-taupe">
                                                Modifica
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button className="text-red-600 text-sm font-medium hover:text-red-700">
                                            Annulla abbonamento
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Support Section */}
                            {activeSection === 'support' && (
                                <div className="space-y-8">
                                    <h2 className="text-xl font-semibold text-gray-900">Supporto</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-6 border rounded-xl hover:border-luminel-gold-soft transition-colors cursor-pointer group">
                                            <QuestionMarkCircleIcon className="w-8 h-8 text-luminel-gold-soft mb-4 group-hover:scale-110 transition-transform" />
                                            <h3 className="font-medium text-gray-900 mb-2">FAQ</h3>
                                            <p className="text-sm text-gray-500">Trova risposte alle domande più frequenti</p>
                                        </div>

                                        <div className="p-6 border rounded-xl hover:border-luminel-gold-soft transition-colors cursor-pointer group">
                                            <UserCircleIcon className="w-8 h-8 text-luminel-gold-soft mb-4 group-hover:scale-110 transition-transform" />
                                            <h3 className="font-medium text-gray-900 mb-2">Contatta Supporto</h3>
                                            <p className="text-sm text-gray-500">Parla con il nostro team di assistenza</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-xl">
                                        <h3 className="font-medium text-gray-900 mb-4">Inviaci un feedback</h3>
                                        <textarea
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                                            placeholder="Come possiamo migliorare?"
                                        />
                                        <button className="px-4 py-2 bg-luminel-gold-soft text-white rounded-lg font-medium hover:bg-luminel-taupe transition-colors">
                                            Invia Feedback
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div >
                </div >
            </div >
        </div >
    );
};

export default SettingsPage;
