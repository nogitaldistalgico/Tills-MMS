"use client";

import React, { useEffect, useState } from 'react';
import { Settings, Plus, X, Moon, Sun, BookOpen, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = () => {
    // State
    const [showGuide, setShowGuide] = useState(false);
    const [showMobileSettings, setShowMobileSettings] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

    useEffect(() => {
        // Check Dark Mode
        if (document.documentElement.classList.contains('dark')) {
            setIsDarkMode(true);
        }
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

    const copyToClipboard = (text: string, blockId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedBlock(blockId);
        setTimeout(() => setCopiedBlock(null), 2000);
    };

    // G-Code Blocks
    // G-Code Constants
    const changeFilamentBlock = `; --- Manual Color Change Start ---
M400 U1             ; Pause printer (parks at waste chute)
M109 S[new_filament_temp]  ; Set temp for NEW filament
; --- Manual Color Change End ---`;

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-[280px] bg-white/60 dark:bg-[#1c1c1e]/60 border-r border-gray-200/50 dark:border-white/5 flex-col py-6 px-4 z-20 backdrop-blur-xl">
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
                    <div className="px-3 py-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                            <BookOpen size={16} /> Guide
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                            Learn how to set up your printer for multicolor without AMS.
                        </p>
                        <button onClick={() => setShowGuide(true)} className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide hover:underline">
                            Read Guide &rarr;
                        </button>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-white/5">
                    <div className="px-3 py-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Dark Mode</span>
                        <button onClick={toggleDarkMode} className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg transition-colors">
                            {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                        </button>
                    </div>
                    <div className="text-xs text-center text-gray-400 mt-4">v1.2.0 • Pure Client</div>
                </div>
            </aside>


            {/* Guide Overlay */}
            <AnimatePresence>
                {showGuide && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-white dark:bg-[#000] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white/80 dark:bg-[#000]/80 backdrop-blur-md p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Manual Multicolor</h2>
                                <p className="text-sm text-gray-500">No AMS? No Problem.</p>
                            </div>
                            <button onClick={() => setShowGuide(false)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 pb-32 max-w-2xl mx-auto space-y-12">

                            {/* Intro */}
                            <section>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                    To enable manual multicolor printing on your Bambu Lab A1 Series printer without AMS, you need to modify three G-code sections in your Printer Preset. You can save the changes to a new preset for this Purpose only.
                                </p>
                            </section>

                            {/* 1. Change Filament G-code */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 text-xs text-center border border-blue-200 dark:border-blue-800">1</span>
                                    Change Filament G-code
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Replace the entire content of this block with the code below. This pauses the printer and manages temperature.
                                </p>

                                <div className="p-4 bg-gray-50 dark:bg-[#1c1c1e] rounded-2xl border border-gray-200 dark:border-white/10 relative group">
                                    <button
                                        onClick={() => copyToClipboard(changeFilamentBlock, 'b1')}
                                        className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/10 rounded-lg text-xs font-medium shadow-sm active:scale-95 transition-all z-10"
                                    >
                                        {copiedBlock === 'b1' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        {copiedBlock === 'b1' ? "Copied" : "Copy"}
                                    </button>
                                    <pre className="font-mono text-sm overflow-x-auto text-blue-600 dark:text-blue-400 whitespace-pre">
                                        {changeFilamentBlock}
                                    </pre>
                                </div>
                            </section>

                            {/* 2. Machine Start G-code */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 text-xs text-center border border-blue-200 dark:border-blue-800">2</span>
                                    Machine Start G-code
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
                                        <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2 uppercase tracking-wide">Delete Part A (AMS Load)</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            Search for <code className="bg-white dark:bg-white/10 px-1 rounded">G1 X-13.5 F3000</code>. Delete the long block immediately following it, starting from <code className="bg-white dark:bg-white/10 px-1 rounded">M620 M</code> up to <code className="bg-white dark:bg-white/10 px-1 rounded">M621 ...</code>.
                                        </p>
                                        <div className="max-h-40 overflow-y-auto rounded-lg border border-red-200 dark:border-red-900/30">
                                            <pre className="p-3 text-xs font-mono text-red-600/70 dark:text-red-400/70 line-through">
                                                {`M620 M ;enable remap
M620 S[initial_no_support_extruder]A
G392 S0 ;turn on clog detect
... (large block) ...
M621 S[initial_no_support_extruder]A`}
                                            </pre>
                                        </div>
                                    </div>

                                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
                                        <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2 uppercase tracking-wide">Delete Part B (Tangle Detect)</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            Scroll down (~line 320) and delete this single line:
                                        </p>
                                        <pre className="p-2 bg-white dark:bg-black/20 rounded-lg text-xs font-mono text-red-600 dark:text-red-400 line-through">
                                            M620.3 W1; === turn on filament tangle detection===
                                        </pre>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Machine End G-code */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 text-xs text-center border border-blue-200 dark:border-blue-800">3</span>
                                    Machine End G-code
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Prevent the printer from pulling back filament at the end. Search for <code className="bg-gray-100 dark:bg-white/10 px-1 rounded">; pull back filament to AMS</code> (~line 65) and delete the block below it.
                                </p>

                                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
                                    <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2 uppercase tracking-wide">Delete this block</h4>
                                    <pre className="font-mono text-xs text-red-600/80 dark:text-red-400/80 line-through whitespace-pre">
                                        {`; pull back filament to AMS
M620 S255
G1 X181 F12000
T255
G1 X0 F18000
G1 X-13.0 F3000
G1 X0 F18000 ; wipe
M621 S255`}
                                    </pre>
                                </div>
                            </section>

                            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 text-sm text-orange-800 dark:text-orange-200">
                                <strong>Note:</strong> Since we removed the initial heating command in Step 2, ensure you manually load the first filament before starting the print. The printer will heat up during calibration.
                            </div>

                        </div>
                    </motion.div>
                )}

                {/* Mobile Settings Overlay */}
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
                                    <span className="text-xs text-gray-400">v1.2.0</span>
                                </div>
                            </div>

                            <button onClick={() => setShowMobileSettings(false)} className="w-full mt-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold">
                                Done
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Floating Dock (Optimized) */}
            <nav className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[auto] min-w-[320px] bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2.5rem] flex items-center justify-between px-2 pl-6 pr-6 py-2 z-50">
                <button
                    onClick={() => setShowGuide(true)}
                    className="group flex flex-col items-center justify-center w-14 h-14 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all text-gray-500 dark:text-gray-400"
                >
                    <BookOpen size={24} className="group-active:scale-90 transition-transform" />
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

