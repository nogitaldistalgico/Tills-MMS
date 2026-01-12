"use client";

import React, { useEffect, useState } from 'react';
import { FolderOpen, Clock, FileText, Settings, Plus, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Shared type for History items
interface HistoryItem {
    filename: string;
    date: string;
}

export const Sidebar = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        // Load history on mount
        const loadHistory = () => {
            try {
                const hist = JSON.parse(localStorage.getItem('mms_history') || '[]');
                setHistory(hist);
            } catch (e) {
                console.error(e);
            }
        };

        loadHistory();
        // Listen for storage updates (from page.tsx)
        window.addEventListener('storage', loadHistory);
        return () => window.removeEventListener('storage', loadHistory);
    }, []);

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
                    onClick={() => window.location.reload()}
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
                    <NavItem icon={<Settings size={20} />} label="Settings" />
                    <div className="text-xs text-center text-gray-400 mt-4">v1.1.0 • Pure Client</div>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 dark:bg-[#2C2C2E]/80 backdrop-blur-lg border-t border-gray-200 dark:border-white/5 flex justify-around p-4 z-50 safe-area-bottom pb-8">
                <div className="flex flex-col items-center gap-1 text-blue-500">
                    <Clock size={24} />
                    <span className="text-[10px] font-medium">Recent</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500">
                    <Plus size={24} />
                    <span className="text-[10px] font-medium">New</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-500">
                    <Settings size={24} />
                    <span className="text-[10px] font-medium">Settings</span>
                </div>
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
