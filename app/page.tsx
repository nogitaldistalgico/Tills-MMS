"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCcw, ArrowUp, CheckCircle, AlertCircle } from 'lucide-react';
import { api, PrintJob, Task } from '@/lib/api';
import { cn } from '@/lib/utils';
import { FileUpload } from '@/components/FileUpload';
import { TaskRow } from '@/components/TaskRow';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home() {
    const [job, setJob] = useState<PrintJob | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLanguage();

    // Persistence Loading
    useEffect(() => {
        const savedJob = localStorage.getItem('currentJob');
        if (savedJob) {
            try {
                setJob(JSON.parse(savedJob));
            } catch (e) {
                console.error("Failed to load saved state", e);
            }
        }
    }, []);

    // Persistence Saving
    useEffect(() => {
        if (job) {
            localStorage.setItem('currentJob', JSON.stringify(job));
        }
    }, [job]);

    const handleFileSelect = async (file: File) => {
        setIsProcessing(true);
        setError(null);
        try {
            const data = await api.parseFile(file);
            setJob(data);

            // Save to History (LocalStorage)
            const newEntry = { filename: data.filename, date: new Date().toISOString() };
            const history = JSON.parse(localStorage.getItem('mms_history') || '[]');
            // Filter duplicates and limit to 10
            const updated = [newEntry, ...history.filter((h: any) => h.filename !== data.filename)].slice(0, 10);
            localStorage.setItem('mms_history', JSON.stringify(updated));

            // Dispatch event so Sidebar updates immediately
            window.dispatchEvent(new Event('storage'));

        } catch (err) {
            console.error(err);
            setError(t.home.errorParse);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleToggleTask = (taskId: string) => {
        if (!job) return;

        setJob(prev => {
            if (!prev) return null;
            return {
                ...prev,
                tasks: prev.tasks.map(t =>
                    t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
                )
            };
        });
    };

    const handleReset = () => {
        if (!job) return;
        if (confirm(t.home.confirmReset)) {
            setJob(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    tasks: prev.tasks.map(t => ({ ...t, is_completed: false }))
                };
            });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Also scroll the main container if it's the one scrolling
        const main = document.querySelector('main');
        if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalTasks = job?.tasks.length || 0;
    const completedTasks = job?.tasks.filter(t => t.is_completed).length || 0;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="min-h-full max-w-5xl mx-auto p-6 md:p-12 pb-40">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-gray-400 dark:from-white dark:via-gray-100 dark:to-gray-500 pb-2">
                        {job ? job.filename.replace(/\.gcode\.3mf$/i, '').replace(/\.gcode$/i, '').replace(/\.3mf$/i, '') : t.home.dashboard}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
                        {job
                            ? t.home.subtitleStats.replace('{completed}', completedTasks.toString()).replace('{total}', totalTasks.toString())
                            : t.home.subtitleEmpty}
                    </p>
                </div>

                {job && (
                    <div className="flex gap-4">
                        <button
                            onClick={handleReset}
                            className="group flex items-center justify-center p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-white/10 rounded-full transition-all backdrop-blur-md"
                            title={t.home.resetAll}
                        >
                            <RefreshCcw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                    </div>
                )}
            </header>

            {/* Progress Bar (Sticky) */}
            {job && (
                <div className="sticky top-0 z-30 bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-xl py-6 mb-12 -mx-6 px-6 md:-mx-12 md:px-12 border-b border-gray-200/20 dark:border-white/5 transition-all">
                    <div className="h-2.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="space-y-8">
                {!job ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-16"
                    >
                        <div className="relative z-10">
                            <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                                <AlertCircle size={20} />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        {/* Empty State / Hints - High End Bento Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <FeatureCard
                                title={t.home.smartParsing}
                                desc={t.home.smartParsingDesc}
                                delay={0.1}
                                gradient="from-violet-500/10 to-purple-500/10"
                                border="border-violet-200/50 dark:border-violet-500/10"
                            />
                            <FeatureCard
                                title={t.home.progressTracking}
                                desc={t.home.progressTrackingDesc}
                                delay={0.2}
                                gradient="from-blue-500/10 to-cyan-500/10"
                                border="border-blue-200/50 dark:border-blue-500/10"
                            />
                        </div>

                        {/* Footer / Disclaimer */}
                        <div className="pt-12 text-center px-4">
                            <h4 className="text-xs font-bold text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em] mb-3">
                                {t.home.about}
                            </h4>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 max-w-lg mx-auto leading-relaxed opacity-70">
                                {t.home.disclaimerText}
                            </p>
                            <a
                                href="https://github.com/nogitaldistalgico/Tills-MMS"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-4 text-[11px] font-semibold text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {t.home.githubContact}
                            </a>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {job.tasks.map((task, idx) => (
                                <TaskRow
                                    key={task.id}
                                    task={task}
                                    index={idx}
                                    onToggle={handleToggleTask}
                                />
                            ))}
                        </AnimatePresence>

                        {completedTasks === totalTasks && totalTasks > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-16 p-10 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-100 dark:border-green-900/20 rounded-[2rem] text-center backdrop-blur-xl"
                            >
                                <div className="w-20 h-20 bg-white dark:bg-white/5 text-green-500 dark:text-green-400 rounded-full shadow-xl shadow-green-500/10 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} className="stroke-[2.5]" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{t.home.printComplete}</h2>
                                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">{t.home.printCompleteDesc}</p>
                                <button
                                    onClick={() => setJob(null)}
                                    className="mt-8 px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                                >
                                    {t.home.startNewPrint}
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Action Button (Scroll Top) - Updated Transparency */}
            <AnimatePresence>
                {job && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={scrollToTop}
                        className="fixed bottom-36 right-6 w-14 h-14 bg-white/20 dark:bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:scale-110 transition-all z-40 border border-white/20 dark:border-white/10"
                    >
                        <ArrowUp size={24} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

const FeatureCard = ({ title, desc, delay, gradient, border }: { title: string, desc: string, delay: number, gradient?: string, border?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6, ease: "easeOut" }}
        className={cn(
            "relative overflow-hidden p-8 rounded-[2rem] bg-white/40 dark:bg-white/5 backdrop-blur-xl border shadow-sm hover:shadow-xl transition-all duration-500 group",
            border || "border-white/50 dark:border-white/10"
        )}
    >
        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br", gradient)} />
        <div className="relative z-10">
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed font-medium">{desc}</p>
        </div>
    </motion.div>
);
