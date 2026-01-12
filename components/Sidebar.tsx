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
        if (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) {
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


            {/* Guide Overlay - World Class Redesign */}
            <AnimatePresence>
                {showGuide && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                        className="fixed inset-0 z-[60] bg-[#F5F5F7] dark:bg-[#000] overflow-y-auto"
                    >
                        {/* High-End Sticky Header */}
                        <div className="sticky top-0 bg-[#F5F5F7]/80 dark:bg-[#000]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 z-20 transition-all duration-300">
                            <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                                <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Manual Multicolor Guide</h2>
                                <button
                                    onClick={() => setShowGuide(false)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-200/50 dark:bg-white/10 rounded-full hover:bg-gray-300/50 dark:hover:bg-white/20 transition-all backdrop-blur-sm"
                                >
                                    <X size={16} className="text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="max-w-3xl mx-auto px-6 py-12 pb-32 space-y-16">

                            {/* Hero / Intro */}
                            <section className="text-center space-y-6">
                                <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-3xl mx-auto shadow-2xl shadow-blue-500/30 flex items-center justify-center text-white mb-6">
                                    <BookOpen size={32} className="stroke-[2.5]" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Unlock Multicolor.
                                </h1>
                                <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                                    To enable manual multicolor printing on your Bambu Lab A1 Series printer without AMS, you need to modify three G-code sections in your Printer Preset. You can save the changes to a new preset for this Purpose only.
                                </p>
                            </section>

                            {/* Step 1 */}
                            <section className="relative group">
                                <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-white/5 md:block hidden" />
                                <div className="space-y-6 md:pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/30 z-10 ring-4 ring-[#F5F5F7] dark:ring-black">1</div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Change Filament G-Code</h3>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                                        This snippet ensures the printer pauses and maintains the correct temperature during the swap. Replace the existing block entirely.
                                    </p>

                                    <div className="rounded-2xl overflow-hidden bg-[#1D1D1F] border border-white/10 shadow-2xl shadow-black/20 group-hover:shadow-blue-900/10 transition-shadow duration-500">
                                        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                                                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                                                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(changeFilamentBlock, 'b1')}
                                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all text-[11px] font-semibold text-white/90 tracking-wide uppercase"
                                            >
                                                {copiedBlock === 'b1' ? <Check size={12} className="text-[#28C840]" /> : <Copy size={12} />}
                                                {copiedBlock === 'b1' ? "COPIED" : "COPY G-CODE"}
                                            </button>
                                        </div>
                                        <div className="p-6 overflow-x-auto">
                                            <pre className="font-mono text-sm text-blue-300 leading-relaxed whitespace-pre">
                                                {changeFilamentBlock}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Step 2 */}
                            <section className="relative group">
                                <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-white/5 md:block hidden" />
                                <div className="space-y-6 md:pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white dark:text-black text-white flex items-center justify-center font-bold text-sm shadow-lg z-10 ring-4 ring-[#F5F5F7] dark:ring-black">2</div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Machine Start G-Code</h3>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                                        Remove the automation sequences that require the AMS. Locate and delete these two specific sections.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Deletion Card A */}
                                        <div className="p-1 rounded-3xl bg-gradient-to-b from-red-500/20 to-transparent">
                                            <div className="bg-white dark:bg-[#1C1C1E] rounded-[1.4rem] p-6 h-full border border-red-500/20 dark:border-red-500/30">
                                                <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wider">
                                                    <X size={16} /> Delete Part A
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                                    Search for <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">G1 X-13.5 F3000</code>. Delete the block immediately following it.
                                                </p>
                                                <div className="bg-[#1D1D1F] rounded-xl p-4 overflow-hidden border border-white/10">
                                                    <pre className="font-mono text-[10px] text-red-400/60 line-through opacity-80 leading-relaxed">
                                                        {`M620 M ;enable remap
M620 S[initial_no_support_extruder]A
G392 S0 ;turn on clog detect
... (large block) ...
M621 S[initial_no_support_extruder]A`}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Deletion Card B */}
                                        <div className="p-1 rounded-3xl bg-gradient-to-b from-red-500/20 to-transparent">
                                            <div className="bg-white dark:bg-[#1C1C1E] rounded-[1.4rem] p-6 h-full border border-red-500/20 dark:border-red-500/30">
                                                <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wider">
                                                    <X size={16} /> Delete Part B
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                                    Scroll down to ~line 320 and delete the Tangle Detection line.
                                                </p>
                                                <div className="bg-[#1D1D1F] rounded-xl p-4 overflow-hidden border border-white/10">
                                                    <pre className="font-mono text-[10px] text-red-400/60 line-through opacity-80 leading-relaxed">
                                                        M620.3 W1; === turn on filament tangle detection===
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Step 3 */}
                            <section className="relative group">
                                <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-white/5 md:block hidden" />
                                <div className="space-y-6 md:pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white dark:text-black text-white flex items-center justify-center font-bold text-sm shadow-lg z-10 ring-4 ring-[#F5F5F7] dark:ring-black">3</div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Machine End G-Code</h3>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                                        Prevent the printer from attempting to rewind the filament into the AMS at the end of the print.
                                    </p>

                                    <div className="p-1 rounded-3xl bg-gradient-to-b from-gray-200 to-transparent dark:from-white/10">
                                        <div className="bg-white dark:bg-[#1C1C1E] rounded-[1.4rem] p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wider">
                                                        <X size={16} /> Remove Block
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                                        Find <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">; pull back filament to AMS</code> near line 65.
                                                        Delete the block shown on the right.
                                                    </p>
                                                </div>
                                                <div className="flex-1 bg-[#1D1D1F] rounded-xl p-5 border border-white/10 flex items-center">
                                                    <pre className="font-mono text-[10px] text-red-400/60 line-through opacity-80 leading-relaxed w-full">
                                                        {`; pull back filament to AMS
M620 S255
G1 X181 F12000
T255
G1 X0 F18000
...
M621 S255`}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Pro Tip Box */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-3xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-200/50 dark:border-orange-900/20 backdrop-blur-md"
                            >
                                <h4 className="flex items-center gap-3 font-bold text-orange-900 dark:text-orange-100 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                    Important Note
                                </h4>
                                <p className="text-orange-800/80 dark:text-orange-200/80 text-sm leading-relaxed">
                                    Since we removed the initial heating command in Step 2 to bypass the AMS load check, you must <strong>manually load the first filament</strong> before starting your print. The printer will heat up and handle the rest correctly during calibration.
                                </p>
                            </motion.div>

                        </div>
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

            {/* Mobile Settings Overlay */}
            <AnimatePresence>
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
        </>
    );
};
