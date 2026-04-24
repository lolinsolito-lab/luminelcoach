import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CalendarDaysIcon,
    ClockIcon,
    UserGroupIcon,
    BookOpenIcon,
    HeartIcon,
    MoonIcon,
    StarIcon,
    PlusIcon,
    CheckCircleIcon,
    BellIcon
} from '@heroicons/react/24/outline';
import {
    CalendarDaysIcon as CalendarDaysSolid,
    ClockIcon as ClockSolid
} from '@heroicons/react/24/solid';

import { useAuth } from '../contexts/AuthContext';
import CalendarSakuraPetals from './calendar/CalendarSakuraPetals';
import CalendarLoadingScreen from './calendar/CalendarLoadingScreen';
import NewEventModal from './calendar/NewEventModal';

import ProgressTracking from './journey/ProgressTracking';

// Colori tema dell'app
const colors = {
    primary: "#5B4B8A",
    secondary: "#7E6BC4",
    accent: "#399D9E",
    light: "#F7FAFA",
    success: "#4CB19C",
    highlight: "#FFC857",
    calm: "#BEE3D4",
    meditation: "#D8C1E9",
    course: "#F0BED2",
    error: "#EF4444"
};

// Tipi di eventi
const eventTypes: Record<string, any> = {
    session: {
        color: colors.accent,
        icon: <UserGroupIcon className="w-4 h-4" />,
        label: "Sessione Live",
        bgColor: "#E5F5F5"
    },
    course: {
        color: colors.course,
        icon: <BookOpenIcon className="w-4 h-4" />,
        label: "Corso",
        bgColor: "#FFEBF0"
    },
    meditation: {
        color: colors.meditation,
        icon: <MoonIcon className="w-4 h-4" />,
        label: "Meditazione",
        bgColor: "#F0EDFA"
    },
    calm: {
        color: colors.calm,
        icon: <HeartIcon className="w-4 h-4" />,
        label: "Relax",
        bgColor: "#F0FDF4"
    },
    personal: {
        color: colors.highlight,
        icon: <StarIcon className="w-4 h-4" />,
        label: "Personale",
        bgColor: "#FEF3C7"
    }
};

// Eventi di esempio
const sampleEvents = [
    {
        id: 'session-1',
        title: "Mindful Stretching",
        type: "session",
        date: new Date(),
        time: "11:00",
        duration: 45,
        trainer: "Elena",
        plan: "free",
        completed: false,
        booked: true,
        description: "Sessione di stretching consapevole per rilassare corpo e mente"
    },
    {
        id: 'meditation-1',
        title: "Respirazione Consapevole",
        type: "meditation",
        date: new Date(),
        time: "18:30",
        duration: 15,
        plan: "free",
        completed: false,
        booked: true,
        description: "Pratica di respirazione per centrarsi e trovare calma"
    },
    {
        id: 'course-1',
        title: "Self-Love Foundations",
        type: "course",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        time: "10:00",
        duration: 60,
        plan: "premium",
        completed: false,
        booked: false,
        description: "Fondamenti per sviluppare un rapporto sano con se stessi"
    },
    {
        id: 'session-2',
        title: "Yoga Flow Mattutino",
        type: "session",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        time: "07:30",
        duration: 45,
        trainer: "Marco",
        plan: "premium",
        completed: false,
        booked: true,
        description: "Sequenza di yoga energizzante per iniziare la giornata"
    }
];

const CalendarPage: React.FC = () => {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<'calendar' | 'tracking'>('calendar');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [activeFilters, setActiveFilters] = useState(['session', 'course', 'meditation', 'calm', 'personal']);
    const [isLoading, setIsLoading] = useState(true);
    const [userPlan, setUserPlan] = useState('premium'); // Default to premium for demo
    const [events, setEvents] = useState(sampleEvents);
    const [showNewEventModal, setShowNewEventModal] = useState(false);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = [];
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        for (let i = 0; i < startDay; i++) {
            const prevDate = new Date(year, month, -startDay + i + 1);
            daysInMonth.push({ date: prevDate, isCurrentMonth: false });
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            daysInMonth.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }

        const remainingDays = 42 - daysInMonth.length;
        for (let i = 1; i <= remainingDays; i++) {
            daysInMonth.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        }

        return daysInMonth;
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            if (!activeFilters.includes(event.type)) return false;
            return event.date.toDateString() === date.toDateString();
        });
    };

    const getWeekEvents = () => {
        const startOfWeek = new Date(selectedDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        const weekEvents = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            weekEvents.push({
                date: new Date(date),
                events: getEventsForDate(date)
            });
        }
        return weekEvents;
    };

    const navigateCalendar = (direction: number) => {
        if (viewMode === 'month') {
            const newDate = new Date(currentDate);
            newDate.setMonth(currentDate.getMonth() + direction);
            setCurrentDate(newDate);
        } else if (viewMode === 'week') {
            const newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() + (direction * 7));
            setSelectedDate(newDate);
        } else {
            const newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() + direction);
            setSelectedDate(newDate);
        }
    };

    const toggleEventBooking = (eventId: string) => {
        setEvents(events.map(event => {
            if (event.id === eventId) {
                return { ...event, booked: !event.booked };
            }
            return event;
        }));
    };

    const completeEvent = (eventId: string) => {
        setEvents(events.map(event => {
            if (event.id === eventId) {
                return { ...event, completed: true };
            }
            return event;
        }));
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
    };

    const formatWeek = () => {
        const weekEvents = getWeekEvents();
        const startDate = weekEvents[0].date;
        const endDate = weekEvents[6].date;

        if (startDate.getMonth() === endDate.getMonth()) {
            return `${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`;
        } else {
            return `${startDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        }
    };

    const canAccessEvent = (event: any) => {
        if (userPlan === 'vip') return true;
        if (userPlan === 'premium') return event.plan !== 'vip';
        return event.plan === 'free';
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-luminel-champagne/20 via-white to-luminel-gold-soft/10 pb-24 max-w-full mx-auto overflow-hidden">
            <CalendarSakuraPetals intensity="low" />

            {/* Background Decorative Elements */}
            <div className="fixed top-20 right-10 w-[400px] h-[400px] bg-luminel-gold-soft/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="fixed bottom-20 left-10 w-[300px] h-[300px] bg-luminel-champagne/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

            <AnimatePresence>
                {isLoading ? (
                    <CalendarLoadingScreen onComplete={() => setIsLoading(false)} />
                ) : (
                    <>
                        {/* Header Sticky */}
                        <div className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-20 border-b border-slate-100">
                            <div className="px-6 py-5 max-w-7xl mx-auto">
                                {/* Title & Tabs */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                    <div>
                                        <h1 className="text-4xl font-serif font-bold text-slate-800 mb-2 flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-luminel-gold-soft to-luminel-gold-dark flex items-center justify-center shadow-lg">
                                                <CalendarDaysSolid className="w-6 h-6 text-white" />
                                            </div>
                                            My Journey
                                        </h1>
                                        <p className="text-slate-600">
                                            {activeTab === 'calendar' ? 'Organizza il tuo percorso trasformazionale' : 'Traccia la tua evoluzione'}
                                        </p>
                                    </div>

                                    {activeTab === 'calendar' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowNewEventModal(true)}
                                            className="mt-4 md:mt-0 px-6 py-3 rounded-2xl bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark text-white font-semibold shadow-lg shadow-luminel-gold-soft/30 flex items-center gap-2"
                                        >
                                            <PlusIcon className="w-5 h-5" />
                                            Nuovo Evento
                                        </motion.button>
                                    )}
                                </div>

                                {/* Tab Navigation */}
                                <div className="flex gap-3 mb-6">
                                    <button
                                        onClick={() => setActiveTab('calendar')}
                                        className={`px-8 py-3.5 rounded-[1.5rem] font-serif font-bold text-lg transition-all duration-300 ${activeTab === 'calendar'
                                                ? 'bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark text-white shadow-xl shadow-luminel-gold-soft/40 scale-105'
                                                : 'bg-white/60 text-slate-700 border border-slate-200 hover:shadow-md hover:bg-white'
                                            }`}
                                    >
                                        📅 Calendario
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('tracking')}
                                        className={`px-8 py-3.5 rounded-[1.5rem] font-serif font-bold text-lg transition-all duration-300 ${activeTab === 'tracking'
                                                ? 'bg-gradient-to-r from-luminel-gold-soft to-luminel-gold-dark text-white shadow-xl shadow-luminel-gold-soft/40 scale-105'
                                                : 'bg-white/60 text-slate-700 border border-slate-200 hover:shadow-md hover:bg-white'
                                            }`}
                                    >
                                        📊 Il Mio Progresso
                                    </button>
                                </div>

                                {/* Calendar Controls - Only show when in calendar tab */}
                                {activeTab === 'calendar' && (
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* View Mode Selector */}
                                        <div className="flex bg-slate-100 rounded-2xl p-1.5">
                                            {(['day', 'week', 'month'] as const).map((mode) => (
                                                <button
                                                    key={mode}
                                                    onClick={() => setViewMode(mode)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === mode
                                                            ? 'bg-white text-luminel-gold-soft shadow-md'
                                                            : 'text-slate-600 hover:text-slate-800'
                                                        }`}
                                                >
                                                    {mode === 'day' ? 'Giorno' : mode === 'week' ? 'Settimana' : 'Mese'}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Date Navigator */}
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => navigateCalendar(-1)}
                                                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-md transition-all"
                                            >
                                                <ChevronLeftIcon className="w-5 h-5" />
                                            </button>

                                            <h2 className="font-serif text-xl font-bold text-slate-800 min-w-[200px] text-center capitalize">
                                                {viewMode === 'month' ? formatMonth(currentDate) : viewMode === 'week' ? formatWeek() : selectedDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </h2>

                                            <button
                                                onClick={() => navigateCalendar(1)}
                                                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-md transition-all"
                                            >
                                                <ChevronRightIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Filters */}
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(eventTypes).map(([type, config]) => (
                                                <button
                                                    key={type}
                                                    onClick={() => {
                                                        if (activeFilters.includes(type)) {
                                                            setActiveFilters(activeFilters.filter(f => f !== type));
                                                        } else {
                                                            setActiveFilters([...activeFilters, type]);
                                                        }
                                                    }}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${activeFilters.includes(type)
                                                            ? 'text-white shadow-md scale-105'
                                                            : 'bg-white/80 text-slate-600 border border-slate-200 hover:shadow-md'
                                                        }`}
                                                    style={{
                                                        backgroundColor: activeFilters.includes(type) ? config.color : undefined
                                                    }}
                                                >
                                                    {config.icon}
                                                    {config.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Area */}
                        {activeTab === 'tracking' ? (
                            <div className="px-4 py-8 relative z-10">
                                <ProgressTracking />
                            </div>
                        ) : (
                            <div className="px-6 py-8 relative z-10 max-w-7xl mx-auto">
                                {/* Week View */}
                                {viewMode === 'week' && (
                                    <div className="space-y-8">
                                        {getWeekEvents().map((day, index) => {
                                            const isToday = day.date.toDateString() === new Date().toDateString();

                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    {/* Day Header */}
                                                    <div className={`mb-5 flex items-center gap-4 ${isToday ? 'ml-2' : ''}`}>
                                                        {isToday && (
                                                            <div className="w-2 h-10 rounded-full bg-gradient-to-b from-luminel-gold-soft to-luminel-gold-dark shadow-lg" />
                                                        )}
                                                        <div>
                                                            <h3 className={`font-serif text-3xl font-bold ${isToday ? 'text-luminel-gold-soft' : 'text-slate-800'
                                                                }`}>
                                                                {day.date.toLocaleDateString('it-IT', { weekday: 'long' })}
                                                                {isToday && <span className="ml-3 text-base font-normal text-luminel-gold-soft/70">• Oggi</span>}
                                                            </h3>
                                                            <p className="text-sm text-slate-500 font-medium">
                                                                {day.date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Events */}
                                                    {day.events.length > 0 ? (
                                                        <div className="space-y-4 pl-6">
                                                            {day.events.map((event, eventIdx) => (
                                                                <motion.div
                                                                    key={event.id}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: index * 0.05 + eventIdx * 0.03 }}
                                                                    onClick={() => setSelectedEvent(event)}
                                                                    className={`group relative overflow-hidden rounded-[2rem] cursor-pointer transition-all duration-300 ${canAccessEvent(event)
                                                                            ? 'hover:shadow-2xl hover:scale-[1.02]'
                                                                            : 'opacity-60 cursor-not-allowed'
                                                                        } ${event.completed
                                                                            ? 'bg-gradient-to-br from-emerald-50 to-green-50/50 border-2 border-emerald-200'
                                                                            : 'bg-white/90 backdrop-blur-sm border-2 border-slate-100 shadow-lg'
                                                                        }`}
                                                                >
                                                                    {/* Type Accent Bar */}
                                                                    <div
                                                                        className="absolute left-0 top-0 bottom-0 w-2"
                                                                        style={{ backgroundColor: eventTypes[event.type].color }}
                                                                    />

                                                                    {/* Content */}
                                                                    <div className="p-6 pl-8">
                                                                        <div className="flex items-start justify-between">
                                                                            <div className="flex-grow">
                                                                                <div className="flex items-center gap-4 mb-3">
                                                                                    {/* Icon */}
                                                                                    <div
                                                                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                                                                        style={{ backgroundColor: eventTypes[event.type].color }}
                                                                                    >
                                                                                        {React.cloneElement(eventTypes[event.type].icon, { className: "w-7 h-7" })}
                                                                                    </div>

                                                                                    {/* Title & Info */}
                                                                                    <div className="flex-grow">
                                                                                        <h4 className={`font-serif text-2xl font-bold mb-1.5 ${event.completed ? 'text-green-700' : 'text-slate-800'
                                                                                            }`}>
                                                                                            {event.title}
                                                                                        </h4>
                                                                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                                                                            <div className="flex items-center gap-1.5 font-medium">
                                                                                                <ClockIcon className="w-4 h-4" />
                                                                                                <span>{event.time}</span>
                                                                                            </div>
                                                                                            <span className="text-slate-300">•</span>
                                                                                            <span>{event.duration} min</span>
                                                                                            {event.trainer && (
                                                                                                <>
                                                                                                    <span className="text-slate-300">•</span>
                                                                                                    <span className="font-semibold">{event.trainer}</span>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Description */}
                                                                                {event.description && (
                                                                                    <p className="text-sm text-slate-600 leading-relaxed ml-[4.5rem]">
                                                                                        {event.description}
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            {/* Status Badges */}
                                                                            <div className="flex flex-col items-end gap-2">
                                                                                {event.completed && (
                                                                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold shadow-sm">
                                                                                        <CheckCircleIcon className="w-5 h-5" />
                                                                                        Completato
                                                                                    </div>
                                                                                )}

                                                                                {event.booked && !event.completed && (
                                                                                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold shadow-sm">
                                                                                        <BellIcon className="w-5 h-5" />
                                                                                        Prenotato
                                                                                    </div>
                                                                                )}

                                                                                {!canAccessEvent(event) && (
                                                                                    <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-bold shadow-sm">
                                                                                        {event.plan === 'premium' ? '⭐ Premium' : '👑 VIP'}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Hover Gradient Overlay */}
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-luminel-gold-soft/0 to-luminel-gold-soft/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200"
                                                        >
                                                            <CalendarDaysIcon className="w-20 h-20 mx-auto mb-4 text-slate-300" />
                                                            <p className="text-slate-500 font-serif text-lg font-semibold">Nessun evento programmato</p>
                                                            <p className="text-sm text-slate-400 mt-2">Goditi una giornata libera ✨</p>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Month View - Simplified luxury version */}
                                {viewMode === 'month' && (
                                    <div className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] shadow-xl overflow-hidden border-2 border-slate-100">
                                        {/* Week Days Header */}
                                        <div className="grid grid-cols-7 bg-gradient-to-r from-luminel-champagne/30 to-luminel-gold-soft/20 border-b border-slate-200">
                                            {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
                                                <div key={day} className="p-4 text-center text-sm font-serif font-bold text-slate-700">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Calendar Grid */}
                                        <div className="grid grid-cols-7">
                                            {getDaysInMonth(currentDate).map((day, index) => {
                                                const dayEvents = getEventsForDate(day.date);
                                                const isSelected = day.date.toDateString() === selectedDate.toDateString();
                                                const isToday = day.date.toDateString() === new Date().toDateString();

                                                return (
                                                    <motion.div
                                                        key={index}
                                                        whileHover={{ scale: 1.05, zIndex: 10 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setSelectedDate(day.date)}
                                                        className={`min-h-[100px] p-2 border-b border-r border-slate-100 cursor-pointer transition-all ${day.isCurrentMonth
                                                                ? 'bg-white hover:bg-luminel-champagne/10'
                                                                : 'bg-slate-50 text-slate-400'
                                                            } ${isSelected ? 'bg-luminel-gold-soft/20 ring-2 ring-luminel-gold-soft' : ''
                                                            }`}
                                                    >
                                                        <div className={`text-sm font-bold mb-2 ${isToday
                                                                ? 'text-white bg-gradient-to-br from-luminel-gold-soft to-luminel-gold-dark w-7 h-7 rounded-full flex items-center justify-center shadow-md'
                                                                : ''
                                                            }`}>
                                                            {day.date.getDate()}
                                                        </div>

                                                        <div className="space-y-1">
                                                            {dayEvents.slice(0, 2).map((event) => (
                                                                <div
                                                                    key={event.id}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedEvent(event);
                                                                    }}
                                                                    className="text-xs p-1.5 rounded-lg truncate cursor-pointer hover:opacity-90 text-white font-medium shadow-sm"
                                                                    style={{ backgroundColor: eventTypes[event.type].color }}
                                                                >
                                                                    {event.time} {event.title}
                                                                </div>
                                                            ))}
                                                            {dayEvents.length > 2 && (
                                                                <div className="text-xs text-slate-500 font-semibold pl-1">
                                                                    +{dayEvents.length - 2} altri
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Day View */}
                                {viewMode === 'day' && (
                                    <div className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] shadow-xl overflow-hidden border-2 border-slate-100">
                                        <div className={`px-8 py-6 border-b-2 ${selectedDate.toDateString() === new Date().toDateString()
                                                ? 'bg-gradient-to-r from-luminel-gold-soft/20 to-luminel-champagne/20 border-luminel-gold-soft'
                                                : 'bg-luminel-champagne/10 border-slate-200'
                                            }`}>
                                            <h2 className={`font-serif text-3xl font-bold ${selectedDate.toDateString() === new Date().toDateString()
                                                    ? 'text-luminel-gold-soft'
                                                    : 'text-slate-800'
                                                }`}>
                                                {selectedDate.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                {selectedDate.toDateString() === new Date().toDateString() && (
                                                    <span className="ml-3 text-lg font-normal text-luminel-gold-soft/70">• Oggi</span>
                                                )}
                                            </h2>
                                        </div>

                                        <div className="p-8">
                                            {getEventsForDate(selectedDate).length > 0 ? (
                                                <div className="space-y-4">
                                                    {getEventsForDate(selectedDate)
                                                        .sort((a, b) => a.time.localeCompare(b.time))
                                                        .map((event, idx) => (
                                                            <motion.div
                                                                key={event.id}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                onClick={() => setSelectedEvent(event)}
                                                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${canAccessEvent(event)
                                                                        ? 'hover:shadow-xl hover:scale-[1.02]'
                                                                        : 'opacity-60 cursor-not-allowed'
                                                                    } ${event.completed
                                                                        ? 'bg-green-50 border-green-200'
                                                                        : 'bg-white border-slate-200'
                                                                    }`}
                                                            >
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex items-center gap-4">
                                                                        <div
                                                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                                                                            style={{ backgroundColor: eventTypes[event.type].color }}
                                                                        >
                                                                            {React.cloneElement(eventTypes[event.type].icon, { className: "w-6 h-6" })}
                                                                        </div>
                                                                        <div>
                                                                            <h3 className={`font-serif text-xl font-bold mb-1 ${event.completed ? 'text-green-700' : 'text-slate-800'
                                                                                }`}>
                                                                                {event.title}
                                                                            </h3>
                                                                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                                                                <ClockIcon className="w-4 h-4" />
                                                                                <span className="font-medium">{event.time}</span>
                                                                                <span>•</span>
                                                                                <span>{event.duration} min</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex flex-col items-end gap-2">
                                                                        {event.completed && (
                                                                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                                                        )}
                                                                        {event.booked && !event.completed && (
                                                                            <BellIcon className="w-6 h-6 text-blue-500" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-20">
                                                    <CalendarDaysIcon className="w-24 h-24 mx-auto mb-6 text-slate-300" />
                                                    <h3 className="font-serif text-2xl font-bold text-slate-700 mb-2">Giornata libera</h3>
                                                    <p className="text-slate-500">Non hai eventi programmati per questo giorno ✨</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Plan Badge */}
                        <div className="fixed bottom-24 right-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 border-2 border-slate-100 z-30">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-full shadow-sm"
                                    style={{
                                        backgroundColor: userPlan === 'vip' ? '#F59E0B' : userPlan === 'premium' ? '#7E6BC4' : '#6B7280'
                                    }}
                                />
                                <span className="text-sm font-bold text-slate-700">
                                    Piano {userPlan}
                                </span>
                            </div>
                        </div>

                        {/* New Event Modal */}
                        <AnimatePresence>
                            {showNewEventModal && (
                                <NewEventModal
                                    onClose={() => setShowNewEventModal(false)}
                                    onSave={(eventData: any) => {
                                        const newEvent = {
                                            id: `custom-${Date.now()}`,
                                            ...eventData,
                                            plan: userPlan,
                                            completed: false,
                                            booked: true
                                        };
                                        setEvents([...events, newEvent]);
                                        setShowNewEventModal(false);
                                    }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Event Detail Modal */}
                        <AnimatePresence>
                            {selectedEvent && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                    onClick={() => setSelectedEvent(null)}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-white rounded-[2.5rem] max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
                                    >
                                        {/* Header */}
                                        <div
                                            className="p-8 text-white rounded-t-[2.5rem] relative overflow-hidden"
                                            style={{ backgroundColor: eventTypes[selectedEvent.type].color }}
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                            <div className="relative z-10 flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    {React.cloneElement(eventTypes[selectedEvent.type].icon, { className: "w-8 h-8" })}
                                                    <div>
                                                        <h2 className="font-serif text-2xl font-bold">{selectedEvent.title}</h2>
                                                        <p className="text-white/90 text-sm mt-1">{eventTypes[selectedEvent.type].label}</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setSelectedEvent(null)}
                                                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                                >
                                                    <span className="text-2xl leading-none">×</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-8">
                                            {/* Details Grid */}
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-slate-50 rounded-2xl p-4">
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                                        <ClockIcon className="w-4 h-4" />
                                                        Orario
                                                    </div>
                                                    <div className="font-bold text-slate-800">{selectedEvent.time}</div>
                                                </div>
                                                <div className="bg-slate-50 rounded-2xl p-4">
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                                        <ClockSolid className="w-4 h-4" />
                                                        Durata
                                                    </div>
                                                    <div className="font-bold text-slate-800">{selectedEvent.duration} min</div>
                                                </div>
                                            </div>

                                            {selectedEvent.trainer && (
                                                <div className="bg-luminel-champagne/20 rounded-2xl p-4 mb-6">
                                                    <div className="text-slate-500 text-sm mb-1">Istruttore</div>
                                                    <div className="font-bold text-slate-800">{selectedEvent.trainer}</div>
                                                </div>
                                            )}

                                            {selectedEvent.description && (
                                                <div className="mb-6">
                                                    <h3 className="font-serif font-bold text-slate-800 mb-3">Descrizione</h3>
                                                    <p className="text-slate-600 leading-relaxed">{selectedEvent.description}</p>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            {canAccessEvent(selectedEvent) && (
                                                <div className="flex gap-3">
                                                    {!selectedEvent.completed && (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    toggleEventBooking(selectedEvent.id);
                                                                    setSelectedEvent({ ...selectedEvent, booked: !selectedEvent.booked });
                                                                }}
                                                                className={`flex-1 py-3 px-6 rounded-2xl font-bold transition-all ${selectedEvent.booked
                                                                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                                        : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
                                                                    }`}
                                                            >
                                                                {selectedEvent.booked ? 'Annulla Prenotazione' : 'Prenota'}
                                                            </button>

                                                            {selectedEvent.booked && (
                                                                <button
                                                                    onClick={() => {
                                                                        completeEvent(selectedEvent.id);
                                                                        setSelectedEvent(null);
                                                                    }}
                                                                    className="flex-1 py-3 px-6 rounded-2xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg transition-all"
                                                                >
                                                                    Segna Completato
                                                                </button>
                                                            )}
                                                        </>
                                                    )}

                                                    {selectedEvent.completed && (
                                                        <div className="flex-1 py-3 px-6 rounded-2xl bg-green-100 text-green-700 font-bold text-center flex items-center justify-center gap-2">
                                                            <CheckCircleIcon className="w-5 h-5" />
                                                            Completato
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {!canAccessEvent(selectedEvent) && (
                                                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 text-center">
                                                    <p className="text-amber-800 font-bold mb-2">
                                                        {selectedEvent.plan === 'premium' ? '⭐ Contenuto Premium' : '👑 Contenuto VIP'}
                                                    </p>
                                                    <p className="text-amber-700 text-sm">
                                                        Aggiornare il tuo piano per accedere a questo evento
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CalendarPage;
