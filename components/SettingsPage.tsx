import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserCircleIcon, ShieldCheckIcon, BellIcon, SwatchIcon,
    LockClosedIcon, CreditCardIcon, QuestionMarkCircleIcon,
    ArrowRightOnRectangleIcon, CameraIcon, CheckIcon,
    ChevronRightIcon, SparklesIcon, ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const DL = {
    gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
    goldB: "rgba(201,168,76,0.25)", alch: "#9B74E0", stra: "#4A9ED4",
    guer: "#D4603A", white: "#F0EBE0", muted: "#6A6560",
    glass: "rgba(255,255,255,0.035)", glassB: "rgba(255,255,255,0.07)", dim: "#252330",
};

// ─── TOGGLE ───────────────────────────────────────────────────────────────────
const Toggle: React.FC<{ on: boolean; onChange: () => void; color?: string }> = ({ on, onChange, color = DL.gold }) => (
    <button onClick={onChange} className="flex-shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-all"
        style={{ background: on ? color : "rgba(255,255,255,0.08)", border: `0.5px solid ${on ? color : DL.glassB}` }}>
        <motion.span animate={{ x: on ? 16 : 2 }} transition={{ duration: 0.18 }}
            className="inline-block w-4 h-4 rounded-full"
            style={{ background: on ? "#06060F" : DL.muted }} />
    </button>
);

// ─── INPUT (controllato) ─────────────────────────────────────────────────────
const DLInput: React.FC<{ label: string; type?: string; value?: string; onChange?: (v: string) => void; placeholder?: string; disabled?: boolean }> =
    ({ label, type = "text", value, onChange, placeholder, disabled }) => (
        <div>
            <label className="block text-[10px] tracking-[0.14em] uppercase mb-1.5" style={{ color: DL.muted }}>{label}</label>
            <input type={type} value={value ?? ""} placeholder={placeholder} disabled={disabled}
                onChange={e => onChange?.(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none transition-all"
                style={{ background: disabled ? "rgba(255,255,255,0.02)" : DL.glass, border: `0.5px solid ${DL.glassB}`, color: disabled ? DL.muted : DL.white }}
                onFocus={e => !disabled && (e.target.style.borderColor = DL.goldB)}
                onBlur={e => e.target.style.borderColor = DL.glassB} />
        </div>
    );

// ─── SECTION ROW ─────────────────────────────────────────────────────────────
const SectionRow: React.FC<{ title: string; desc: string; children: React.ReactNode }> = ({ title, desc, children }) => (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: `0.5px solid ${DL.dim}` }}>
        <div className="min-w-0 pr-4">
            <div className="text-[13px] font-medium" style={{ color: DL.white }}>{title}</div>
            <div className="text-[11px] mt-0.5" style={{ color: DL.muted }}>{desc}</div>
        </div>
        {children}
    </div>
);

// ─── MENU ITEMS ───────────────────────────────────────────────────────────────
const MENU = [
    { id: "profile", label: "Profilo", icon: UserCircleIcon, color: DL.stra },
    { id: "security", label: "Sicurezza", icon: ShieldCheckIcon, color: "#10B981" },
    { id: "notifications", label: "Notifiche", icon: BellIcon, color: DL.alch },
    { id: "appearance", label: "Aspetto", icon: SwatchIcon, color: DL.gold },
    { id: "privacy", label: "Privacy", icon: LockClosedIcon, color: DL.muted },
    { id: "subscription", label: "Abbonamento", icon: CreditCardIcon, color: DL.gold },
    { id: "support", label: "Supporto", icon: QuestionMarkCircleIcon, color: DL.stra },
];

// ─── PLAN CONFIG ──────────────────────────────────────────────────────────────
const PLAN_CFG: Record<string, { label: string; price: string; color: string; bg: string; border: string; renewal: string }> = {
    free: { label: "Explorer", price: "€0/mese", color: DL.stra, bg: "rgba(74,158,212,0.08)", border: "rgba(74,158,212,0.25)", renewal: "—" },
    premium: { label: "Premium", price: "€49/mese", color: DL.gold, bg: "rgba(201,168,76,0.08)", border: "rgba(201,168,76,0.25)", renewal: "15 Giugno 2026" },
    vip: { label: "VIP Sovereign", price: "€199/mese", color: DL.alch, bg: "rgba(155,116,224,0.08)", border: "rgba(155,116,224,0.25)", renewal: "15 Giugno 2026" },
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const SettingsPage: React.FC = () => {
    const { user, updateUserProfile, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("profile");
    const [saved, setSaved] = useState(false);

    // ── Profilo form state (controllato) ────────────────────────────────────────
    const [formProfile, setFormProfile] = useState({
        fullName: (user as any)?.fullName ?? "",
        bio: (user as any)?.bio ?? "",
    });
    useEffect(() => {
        setFormProfile({
            fullName: (user as any)?.fullName ?? "",
            bio: (user as any)?.bio ?? "",
        });
    }, [user]);

    // ── Notifiche ───────────────────────────────────────────────────────────────
    const [notifications, setNotifications] = useState({
        email: (user as any)?.notifications?.email ?? true,
        push: (user as any)?.notifications?.push ?? true,
        marketing: (user as any)?.notifications?.marketing ?? false,
        updates: (user as any)?.notifications?.updates ?? true,
        realityQuest: (user as any)?.notifications?.realityQuest ?? true,
    });

    // ── Privacy ─────────────────────────────────────────────────────────────────
    const [privacy, setPrivacy] = useState({
        profileVisible: (user as any)?.privacy?.profileVisible ?? true,
        analytics: (user as any)?.privacy?.analytics ?? false,
        dataSharing: (user as any)?.privacy?.dataSharing ?? false,
    });

    // ── Aspetto ─────────────────────────────────────────────────────────────────
    const [fontSize, setFontSize] = useState<number>((user as any)?.preferences?.fontSize ?? 1);

    const plan = (user as any)?.plan ?? "free";
    const planCfg = PLAN_CFG[plan] ?? PLAN_CFG.free;

    const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

    // Salva profilo
    const handleSaveProfile = async () => {
        await updateUserProfile({ fullName: formProfile.fullName, bio: formProfile.bio });
        flash();
    };

    // Salva notifiche
    const handleSaveNotifications = async () => {
        await updateUserProfile({ notifications });
        flash();
    };

    // Salva privacy
    const handleSavePrivacy = async () => {
        await updateUserProfile({ privacy });
        flash();
    };

    // Salva aspetto
    const handleSaveAppearance = async () => {
        await updateUserProfile({ preferences: { fontSize, theme: 'dark' } });
        flash();
    };

    const toggleNotif = (key: keyof typeof notifications) =>
        setNotifications(p => ({ ...p, [key]: !p[key] }));
    const togglePrivacy = (key: keyof typeof privacy) =>
        setPrivacy(p => ({ ...p, [key]: !p[key] }));

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="text-[9px] tracking-[0.24em] uppercase mb-1 opacity-70" style={{ color: DL.gold }}>Account</div>
                <h1 className="font-serif text-[38px] font-normal" style={{ color: DL.white }}>
                    <em className="italic" style={{ color: DL.gold }}>Impostazioni</em>
                </h1>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-6">

                {/* ── SIDEBAR ── */}
                <div className="w-full md:w-52 flex-shrink-0">
                    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
                        className="rounded-xl overflow-hidden sticky top-20"
                        style={{ background: "rgba(255,255,255,0.015)", border: `0.5px solid ${DL.glassB}` }}>
                        {MENU.map((item, i) => {
                            const isActive = activeSection === item.id;
                            return (
                                <button key={item.id} onClick={() => setActiveSection(item.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all relative"
                                    style={{
                                        borderBottom: i < MENU.length - 1 ? `0.5px solid ${DL.dim}` : "none",
                                        background: isActive ? `${item.color}10` : "transparent"
                                    }}>
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: item.color }} />
                                    )}
                                    <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? item.color : DL.muted }} />
                                    <span className="text-[12px] font-medium" style={{ color: isActive ? item.color : DL.muted }}>{item.label}</span>
                                </button>
                            );
                        })}
                        <div style={{ borderTop: `0.5px solid ${DL.dim}` }}>
                            <button onClick={() => { signOut(); navigate("/welcome"); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                                style={{ color: DL.guer }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(212,96,58,0.06)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                <span className="text-[12px] font-medium">Esci</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeSection}
                            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl p-6"
                            style={{ background: "rgba(255,255,255,0.015)", border: `0.5px solid ${DL.glassB}` }}>

                            {/* ── PROFILE ── */}
                            {activeSection === "profile" && (
                                <div>
                                    <div className="text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: DL.stra }}>Identità</div>
                                    <h2 className="font-serif text-[22px] font-normal mb-6" style={{ color: DL.white }}>Profilo Pubblico</h2>
                                    {/* Avatar */}
                                    <div className="flex items-center gap-5 mb-7 pb-7" style={{ borderBottom: `0.5px solid ${DL.dim}` }}>
                                        <div className="relative flex-shrink-0">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-serif text-[28px]"
                                                style={{ background: DL.goldDim, border: `0.5px solid ${DL.goldB}`, color: DL.gold }}>
                                                {(user as any)?.fullName?.charAt(0)?.toLowerCase() ?? "m"}
                                            </div>
                                            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                                                style={{ background: DL.gold, border: `2px solid #06060F` }}>
                                                <CameraIcon className="w-3.5 h-3.5" style={{ color: "#06060F" }} />
                                            </button>
                                        </div>
                                        <div>
                                            <div className="text-[15px] font-medium mb-0.5" style={{ color: DL.white }}>{(user as any)?.fullName ?? "Michael Jara"}</div>
                                            <div className="text-[12px] mb-2" style={{ color: DL.muted }}>{(user as any)?.email ?? "michael@luminelcoach.com"}</div>
                                            <button className="text-[11px] transition-all" style={{ color: DL.gold }}
                                                onMouseEnter={e => e.currentTarget.style.color = DL.goldBr}
                                                onMouseLeave={e => e.currentTarget.style.color = DL.gold}>
                                                Cambia foto profilo →
                                            </button>
                                        </div>
                                    </div>
                                    {/* Form */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <DLInput label="Nome Completo"
                                            value={formProfile.fullName}
                                            onChange={v => setFormProfile(p => ({ ...p, fullName: v }))} />
                                        <DLInput label="Email" type="email"
                                            value={(user as any)?.email ?? "michael@luminelcoach.com"} disabled />
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] tracking-[0.14em] uppercase mb-1.5" style={{ color: DL.muted }}>Bio</label>
                                            <textarea rows={3}
                                                value={formProfile.bio}
                                                onChange={e => setFormProfile(p => ({ ...p, bio: e.target.value }))}
                                                placeholder="Life Coach specializzato nell'Ikigai. Neurodivergente. 7 lingue."
                                                className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none resize-none transition-all"
                                                style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, color: DL.white }}
                                                onFocus={e => e.target.style.borderColor = DL.goldB}
                                                onBlur={e => e.target.style.borderColor = DL.glassB} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-3">
                                        {saved && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="flex items-center gap-1.5 text-[12px]" style={{ color: "#10B981" }}>
                                                <CheckIcon className="w-4 h-4" />Salvato
                                            </motion.div>
                                        )}
                                        <button onClick={handleSaveProfile}
                                            className="px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                                            style={{ background: DL.gold, color: "#06060F" }}>
                                            Salva modifiche
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── SECURITY ── */}
                            {activeSection === "security" && (
                                <div>
                                    <div className="text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: "#10B981" }}>Account</div>
                                    <h2 className="font-serif text-[22px] font-normal mb-6" style={{ color: DL.white }}>Sicurezza</h2>
                                    <div className="mb-7 pb-7" style={{ borderBottom: `0.5px solid ${DL.dim}` }}>
                                        <div className="text-[13px] font-medium mb-4" style={{ color: DL.white }}>Cambia Password</div>
                                        <div className="flex flex-col gap-3 max-w-sm">
                                            <DLInput label="Password attuale" type="password" placeholder="••••••••" />
                                            <DLInput label="Nuova password" type="password" placeholder="••••••••" />
                                            <DLInput label="Conferma nuova password" type="password" placeholder="••••••••" />
                                            <button className="self-start px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all mt-1"
                                                style={{ background: "rgba(255,255,255,0.06)", border: `0.5px solid ${DL.glassB}`, color: DL.white }}>
                                                Aggiorna password
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-medium mb-1" style={{ color: DL.white }}>Autenticazione a due fattori</div>
                                        <div className="text-[12px] mb-4" style={{ color: DL.muted }}>Aggiungi un livello di sicurezza extra al tuo account.</div>
                                        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                                            <div>
                                                <div className="text-[13px] font-medium" style={{ color: DL.white }}>2FA · Non configurato</div>
                                                <div className="text-[11px]" style={{ color: DL.muted }}>Proteggi il login con un'app autenticatrice</div>
                                            </div>
                                            <button className="px-4 py-2 rounded-xl text-[12px] transition-all"
                                                style={{ background: `rgba(16,185,129,0.1)`, border: `0.5px solid rgba(16,185,129,0.3)`, color: "#10B981" }}>
                                                Configura 2FA
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── NOTIFICATIONS ── */}
                            {activeSection === "notifications" && (
                                <div>
                                    <div className="text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: DL.alch }}>Canali</div>
                                    <h2 className="font-serif text-[22px] font-normal mb-6" style={{ color: DL.white }}>Preferenze Notifiche</h2>
                                    <div>
                                        {[
                                            { key: "email", label: "Notifiche Email", desc: "Progressi, sessioni e aggiornamenti via email", color: DL.stra },
                                            { key: "push", label: "Notifiche Push", desc: "Notifiche in tempo reale nel browser", color: DL.alch },
                                            { key: "realityQuest", label: "Reality Quest AI", desc: "Reminder mattutino per la tua missione del giorno", color: DL.gold },
                                            { key: "updates", label: "Aggiornamenti App", desc: "Nuove funzionalità e miglioramenti della piattaforma", color: DL.muted },
                                            { key: "marketing", label: "Comunicazioni Promo", desc: "Offerte, eventi e novità su Luminel", color: DL.muted },
                                        ].map((item) => (
                                            <SectionRow key={item.key} title={item.label} desc={item.desc}>
                                                <Toggle on={notifications[item.key as keyof typeof notifications]}
                                                    onChange={() => toggleNotif(item.key as keyof typeof notifications)}
                                                    color={item.color !== DL.muted ? item.color : DL.gold} />
                                            </SectionRow>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-end gap-3 mt-6">
                                        {saved && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="flex items-center gap-1.5 text-[12px]" style={{ color: "#10B981" }}>
                                                <CheckIcon className="w-4 h-4" />Salvato
                                            </motion.div>
                                        )}
                                        <button onClick={handleSaveNotifications}
                                            className="px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                                            style={{ background: DL.gold, color: "#06060F" }}>
                                            Salva preferenze
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── APPEARANCE ── */}
                            {activeSection === "appearance" && (
                                <div>
                                    <div className="text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: DL.gold }}>Visual</div>
                                    <h2 className="font-serif text-[22px] font-normal mb-6" style={{ color: DL.white }}>Aspetto</h2>
                                    {/* Theme */}
                                    <div className="mb-6 pb-6" style={{ borderBottom: `0.5px solid ${DL.dim}` }}>
                                        <div className="text-[12px] font-medium mb-3" style={{ color: DL.white }}>Tema</div>
                                        <div className="flex gap-3">
                                            {[
                                                { id: "dark", label: "Dark Luxury", desc: "Il tema originale di Luminel · ossidiana + oro", active: true },
                                                { id: "light", label: "Light", desc: "In sviluppo", active: false, soon: true },
                                            ].map(t => (
                                                <div key={t.id} className="flex-1 rounded-xl p-4 cursor-pointer transition-all relative"
                                                    style={{ background: t.active ? DL.goldDim : DL.glass, border: `0.5px solid ${t.active ? DL.goldB : DL.glassB}` }}>
                                                    {t.active && <div className="absolute top-3 right-3 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: DL.gold }}><CheckIcon className="w-2.5 h-2.5" style={{ color: "#06060F" }} /></div>}
                                                    {t.soon && <span className="absolute top-3 right-3 text-[9px] px-1.5 py-0.5 rounded" style={{ background: DL.glass, color: DL.muted }}>Presto</span>}
                                                    <div className="text-[13px] font-medium mb-0.5" style={{ color: t.active ? DL.goldBr : DL.muted }}>{t.label}</div>
                                                    <div className="text-[11px]" style={{ color: DL.muted }}>{t.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Font size */}
                                    <div>
                                        <div className="text-[12px] font-medium mb-3" style={{ color: DL.white }}>Dimensione Testo</div>
                                        <div className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                                            <span className="text-[11px] flex-shrink-0" style={{ color: DL.muted }}>Aa</span>
                                            <input type="range" min="0" max="2" step="1" value={fontSize}
                                                onChange={e => setFontSize(parseInt(e.target.value))}
                                                className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                                                style={{ accentColor: DL.gold }} />
                                            <span className="text-[16px] font-medium flex-shrink-0" style={{ color: DL.white }}>Aa</span>
                                            <span className="text-[11px] w-16 flex-shrink-0" style={{ color: DL.gold }}>
                                                {["Piccolo", "Medio", "Grande"][fontSize]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-3 mt-6">
                                        {saved && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="flex items-center gap-1.5 text-[12px]" style={{ color: "#10B981" }}>
                                                <CheckIcon className="w-4 h-4" />Salvato
                                            </motion.div>
                                        )}
                                        <button onClick={handleSaveAppearance}
                                            className="px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                                            style={{ background: DL.gold, color: "#06060F" }}>
                                            Salva aspetto
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── PRIVACY ── */}
                            {activeSection === "privacy" && (
                                <div>
                                    <div className="text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: DL.muted }}>GDPR · EU AI Act</div>
                                    <h2 className="font-serif text-[22px] font-normal mb-4" style={{ color: DL.white }}>Privacy</h2>
                                    <div className="flex items-start gap-2 p-3 rounded-xl mb-6 text-[11px]"
                                        style={{ background: "rgba(201,168,76,0.06)", border: `0.5px solid ${DL.goldB}` }}>
                                        <span style={{ color: DL.gold }}>🔒</span>
                                        <span style={{ color: "rgba(240,235,224,0.7)" }}>
                                            Dati su server EU-WEST Frankfurt (Supabase). L'AI Coach è dichiarato sistema automatizzato ai sensi dell'EU AI Act. Leggi la{" "}
                                            <span className="cursor-pointer" style={{ color: DL.gold }}>Privacy Policy completa →</span>
                                        </span>
                                    </div>
                                    <div>
                                        {[
                                            { key: "profileVisible", label: "Visibilità Profilo", desc: "Il tuo profilo è visibile agli altri membri della Community", color: DL.stra },
                                            { key: "analytics", label: "Analytics Anonimi", desc: "Dati aggregati e anonimi per migliorare la piattaforma", color: DL.alch },
                                            { key: "dataSharing", label: "Condivisione Dati", desc: "Condividi dati con partner GDPR-compliant per personalizzazione avanzata", color: DL.muted },
                                        ].map(item => (
                                            <SectionRow key={item.key} title={item.label} desc={item.desc}>
                                                <Toggle on={privacy[item.key as keyof typeof privacy]}
                                                    onChange={() => togglePrivacy(item.key as keyof typeof privacy)}
                                                    color={item.color !== DL.muted ? item.color : DL.gold} />
                                            </SectionRow>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex gap-3">
                                            <button className="px-4 py-2 rounded-xl text-[12px] transition-all"
                                                style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, color: DL.muted }}>
                                                Esporta i miei dati
                                            </button>
                                            <button className="px-4 py-2 rounded-xl text-[12px] transition-all"
                                                style={{ background: "rgba(212,96,58,0.06)", border: `0.5px solid rgba(212,96,58,0.2)`, color: DL.guer }}>
                                                Elimina account
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {saved && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                    className="flex items-center gap-1.5 text-[12px]" style={{ color: "#10B981" }}>
                                                    <CheckIcon className="w-4 h-4" />Salvato
                                                </motion.div>
                                            )}
                                            <button onClick={handleSavePrivacy}
                                                className="px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                                                style={{ background: DL.gold, color: "#06060F" }}>
                                                Salva privacy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── SUBSCRIPTION ── */}
                            {activeSection === "subscription" && (
                                <div>
                                    <div className="text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: DL.gold }}>Stripe · Pagamenti</div>
                                    <h2 className="font-serif text-[22px] font-normal mb-6" style={{ color: DL.white }}>Il tuo Piano</h2>
                                    {/* Current plan */}
                                    <div className="relative overflow-hidden rounded-xl p-6 mb-6"
                                        style={{ background: planCfg.bg, border: `0.5px solid ${planCfg.border}` }}>
                                        <div className="absolute top-0 left-0 right-0 h-px"
                                            style={{ background: `linear-gradient(90deg,transparent,${planCfg.color}50,transparent)` }} />
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="text-[9px] tracking-[0.16em] uppercase mb-1" style={{ color: planCfg.color }}>Piano attivo</div>
                                                <div className="font-serif text-[26px] font-normal" style={{ color: DL.white }}>{planCfg.label}</div>
                                            </div>
                                            <span className="text-[9px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
                                                style={{ background: `${planCfg.color}18`, color: planCfg.color, border: `0.5px solid ${planCfg.border}` }}>
                                                Attivo
                                            </span>
                                        </div>
                                        <div className="flex items-end justify-between pt-4" style={{ borderTop: `0.5px solid ${planCfg.color}20` }}>
                                            <div className="text-[11px]" style={{ color: DL.muted }}>
                                                {planCfg.renewal !== "—" ? `Rinnovo: ${planCfg.renewal}` : "Piano gratuito · nessun rinnovo"}
                                            </div>
                                            <div className="font-serif text-[24px] font-normal" style={{ color: planCfg.color }}>{planCfg.price}</div>
                                        </div>
                                    </div>
                                    {/* Payment method */}
                                    {plan !== "free" && (
                                        <div className="mb-6 pb-6" style={{ borderBottom: `0.5px solid ${DL.dim}` }}>
                                            <div className="text-[12px] font-medium mb-3" style={{ color: DL.white }}>Metodo di Pagamento</div>
                                            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="px-2 py-1 rounded text-[10px] font-bold" style={{ background: "rgba(255,255,255,0.1)", color: DL.white }}>VISA</div>
                                                    <span className="text-[13px]" style={{ color: DL.muted }}>•••• •••• •••• 4242</span>
                                                </div>
                                                <button className="text-[12px] transition-all" style={{ color: DL.gold }}
                                                    onMouseEnter={e => e.currentTarget.style.color = DL.goldBr}
                                                    onMouseLeave={e => e.currentTarget.style.color = DL.gold}>
                                                    Modifica →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {/* Upgrade or cancel */}
                                    <div className="flex flex-col gap-3">
                                        {plan !== "vip" && (
                                            <button onClick={() => navigate("/plans")}
                                                className="w-full py-3 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 transition-all"
                                                style={{ background: DL.gold, color: "#06060F" }}>
                                                <SparklesIcon className="w-4 h-4" />
                                                {plan === "free" ? "Passa a Premium · €49/mese" : "Diventa VIP Sovereign · €199/mese"}
                                                <ArrowRightIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                        {plan === "vip" && (
                                            <button onClick={() => navigate("/plans")}
                                                className="w-full py-3 rounded-xl text-[13px] font-medium transition-all"
                                                style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}`, color: DL.muted }}>
                                                Gestisci abbonamento su Stripe
                                            </button>
                                        )}
                                        {plan !== "free" && (
                                            <button className="text-center text-[12px] transition-all" style={{ color: DL.muted }}
                                                onMouseEnter={e => e.currentTarget.style.color = DL.guer}
                                                onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
                                                Annulla abbonamento
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ── SUPPORT ── */}
                            {activeSection === "support" && (
                                <div>
                                    <div className="text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: DL.stra }}>Assistenza</div>
                                    <h2 className="font-serif text-[22px] font-normal mb-6" style={{ color: DL.white }}>Supporto</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        {[
                                            { icon: <QuestionMarkCircleIcon className="w-6 h-6" />, color: DL.gold, title: "FAQ", desc: "Risposte alle domande più frequenti su Luminel" },
                                            { icon: <UserCircleIcon className="w-6 h-6" />, color: DL.stra, title: "Contatta Supporto", desc: "Parla con il team di assistenza · risposta entro 24h" },
                                        ].map((card, i) => (
                                            <div key={i} className="rounded-xl p-5 cursor-pointer transition-all"
                                                style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = card.color + "50"; e.currentTarget.style.background = `${card.color}08` }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = DL.glassB; e.currentTarget.style.background = DL.glass }}>
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                                    style={{ background: `${card.color}18`, color: card.color }}>
                                                    {card.icon}
                                                </div>
                                                <div className="text-[14px] font-medium mb-1" style={{ color: DL.white }}>{card.title}</div>
                                                <div className="text-[12px]" style={{ color: DL.muted }}>{card.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Feedback */}
                                    <div className="rounded-xl p-5" style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
                                        <div className="text-[12px] font-medium mb-3" style={{ color: DL.white }}>Inviaci un feedback</div>
                                        <textarea rows={4} placeholder="Come possiamo migliorare Luminel?"
                                            className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none resize-none mb-3 transition-all"
                                            style={{ background: "rgba(255,255,255,0.03)", border: `0.5px solid ${DL.glassB}`, color: DL.white }}
                                            onFocus={e => e.target.style.borderColor = DL.goldB}
                                            onBlur={e => e.target.style.borderColor = DL.glassB} />
                                        <button className="px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all"
                                            style={{ background: DL.gold, color: "#06060F" }}>
                                            Invia Feedback
                                        </button>
                                    </div>
                                    {/* App info */}
                                    <div className="mt-6 text-center text-[11px]" style={{ color: DL.muted }}>
                                        Luminel v1.0.0 · Insolito Experiences · P.IVA 14379200968<br />
                                        Legge 4/2013 · Server EU-WEST · GDPR Compliant · EU AI Act
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;