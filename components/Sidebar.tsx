"use client";

import React, { useEffect, useState } from 'react';
import { FolderOpen, Clock, FileText, Settings, Plus, RotateCcw, X, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Shared type for History items
interface HistoryItem {
    filename: string;
    date: string;
}

export const Sidebar = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showMobileHistory, setShowMobileHistory] = useState(false);
    const [showMobileSettings, setShowMobileSettings] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Load history
        const loadHistory = () => {
            try {
                const hist = JSON.parse(localStorage.getItem('mms_history') || '[]');
                setHistory(hist);
            } catch (e) { console.error(e); }
        };
        loadHistory();
        window.addEventListener('storage', loadHistory);

        // Check Dark Mode
        if (document.documentElement.classList.contains('dark')) {
            setIsDarkMode(true);
        }

        return () => window.removeEventListener('storage', loadHistory);
    }, []);

    const toggleDarkMode = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    const handleNewProject = () => {
        if (confirm("Start a new project? This will reset your current progress.")) {
            localStorage.removeItem('currentJob');
            window.location.reload();
        }
    };

    const clearHistory = () => {
        if (confirm("Clear local history?")) {
            localStorage.removeItem('mms_history');
            setHistory([]);
        }
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-[280px] bg-white/60 dark:bg-[#1c1c1e]/60 border-r border-gray-200/50 dark:border-white/5 flex-col py-6 px-4 z-20 backdrop-blur-2xl">
                <div className="mb-8 px-2 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                        T
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight block leading-none">Tills MMS</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">Filament Manager</span>
                    </div>
                </div>

                <button
                    onClick={handleNewProject}
                    className="w-full bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition-all text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-blue-500/20 shadow-lg mb-8"
                >
                    <Plus size={20} className="stroke-[2.5]" />
                    <span>New Project</span>
                </button>

                <div className="flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between px-2 mb-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Files</h3>
                        {history.length > 0 && (
                            <button onClick={clearHistory} className="text-xs text-gray-400 hover:text-red-500 transition"><RotateCcw size={12} /></button>
                        )}
                    </div>

                    <div className="space-y-1">
                        {history.length === 0 ? (
                            <div className="px-3 py-4 text-sm text-gray-400 italic text-center border border-dashed border-gray-200 dark:border-white/5 rounded-lg">
                                No recently opened files
                            </div>
                        ) : (
                            history.slice(0, 5).map((item, i) => (
                                <div key={i} className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                        <Clock size={16} />
                                    </div>
                                    <div className="overflow-hidden text-left">
                                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{item.filename}</div>
                                        <div className="text-[10px] text-gray-400">{new Date(item.date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-white/5">
                    <div className="px-3 py-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Dark Mode</span>
                        <button onClick={toggleDarkMode} className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg transition-colors">
                            {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                        </button>
                    </div>
                    <div className="text-xs text-center text-gray-400 mt-4">v1.1.0 • Pure Client</div>
                </div>
            </aside>


            {/* Mobile Overlays (History) */}
            <AnimatePresence>
                {showMobileHistory && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="md:hidden fixed inset-0 z-40 bg-white dark:bg-[#1c1c1e] p-6 pt-12 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Recent Files</h2>
                            <button onClick={() => setShowMobileHistory(false)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {history.length === 0 ? (
                                <p className="text-gray-400 text-center py-10">No history yet.</p>
                            ) : (
                                history.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                        <Clock className="text-blue-500" />
                                        <div>
                                            <div className="font-semibold">{item.filename}</div>
                                            <div className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {history.length > 0 && (
                                <button onClick={clearHistory} className="w-full mt-8 py-3 text-red-500 font-medium bg-red-50 dark:bg-red-900/10 rounded-xl">
                                    Clear History
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Mobile Overlays (Settings) */}
                {showMobileSettings && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
                        onClick={() => setShowMobileSettings(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-[#1c1c1e] w-full max-w-xs rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-6 text-center">Settings</h2>

                            <div className="space-y-3">
                                <button
                                    onClick={toggleDarkMode}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl active:scale-95 transition-transform"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                                        </div>
                                        <span className="font-medium">Dark Mode</span>
                                    </div>
                                    <span className="text-xs font-semibold text-blue-500">{isDarkMode ? 'ON' : 'OFF'}</span>
                                </button>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg"><Settings size={18} /></div>
                                        <span className="font-medium">Version</span>
                                    </div>
                                    <span className="text-xs text-gray-400">v1.1.0</span>
                                </div>
                            </div>

                            <button onClick={() => setShowMobileSettings(false)} className="w-full mt-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold">
                                Done
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* "iOS 26" Floating Dock - Refined */}
            <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[auto] min-w-[320px] bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2.5rem] flex items-center justify-between px-2 pl-6 pr-6 py-2 z-50">
                <button
                    onClick={() => setShowMobileHistory(true)}
                    className="group flex flex-col items-center justify-center w-14 h-14 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all text-gray-500 dark:text-gray-400"
                >
                    <Clock size={24} className="group-active:scale-90 transition-transform" />
                </button>

                <div className="relative -top-1 mx-4">
                    <button
                        onClick={handleNewProject}
                        className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all border-[4px] border-white/50 dark:border-[#2C2C2E]/50 backdrop-blur-md"
                    >
                        <Plus size={28} className="stroke-[3]" />
                    </button>
                </div>

                <button
                    onClick={() => setShowMobileSettings(true)}
                    className="group flex flex-col items-center justify-center w-14 h-14 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all text-gray-500 dark:text-gray-400"
                >
                    <Settings size={24} className="group-active:scale-90 transition-transform" />
                </button>
            </nav>
        </>
    );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <button className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
        active
            ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
    )}>
        {icon}
        {label}
    </button>
);
