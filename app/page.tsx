"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCcw, ArrowUp, CheckCircle, AlertCircle } from 'lucide-react';
import { api, PrintJob, Task } from '@/lib/api';
import { cn } from '@/lib/utils';
import { FileUpload } from '@/components/FileUpload';
import { TaskRow } from '@/components/TaskRow';

export default function Home() {
    const [job, setJob] = useState<PrintJob | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setError("Failed to parse file. Please try again.");
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
        if (confirm("Reset all tasks?")) {
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
        <div className="min-h-full max-w-4xl mx-auto p-8 pb-32">
            {/* Header */}
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        {job ? job.filename.replace(/\.gcode\.3mf$/i, '').replace(/\.gcode$/i, '').replace(/\.3mf$/i, '') : "Dashboard"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {job
                            ? `${completedTasks} of ${totalTasks} tasks completed`
                            : "Manage your 3D print filament swaps efficiently."}
                    </p>
                </div>

                {job && (
                    <div className="flex gap-4">
                        <button
                            onClick={handleReset}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-white/10 rounded-full transition-all"
                            title="Reset All"
                        >
                            <RefreshCcw size={20} />
                        </button>
                    </div>
                )}
            </header>

            {/* Progress Bar (Sticky) */}
            {job && (
                <div className="sticky top-0 z-10 bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-md py-4 mb-8 -mx-4 px-4 border-b border-gray-200/50 dark:border-white/5">
                    <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="space-y-6">
                {!job ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        {/* Empty State / Hints */}
                        <div className="mt-12 grid md:grid-cols-2 gap-6">
                            <FeatureCard
                                title="Smart Parsing"
                                desc="Automatically extracts filament changes from Bambu/Prusa G-code."
                                delay={0.1}
                            />
                            <FeatureCard
                                title="Progress Tracking"
                                desc="Remember where you left off, even if you close the browser."
                                delay={0.2}
                            />
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-2">
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
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-12 p-8 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-2xl text-center"
                            >
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Print Complete!</h2>
                                <p className="text-green-600 dark:text-green-400">Great job navigating those filament swaps.</p>
                                <button
                                    onClick={() => setJob(null)}
                                    className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition"
                                >
                                    Start New Print
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Action Button (Scroll Top) - Moved up to avoid dock */}
            <AnimatePresence>
                {job && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={scrollToTop}
                        className="fixed bottom-36 right-6 w-12 h-12 bg-white dark:bg-gray-700 shadow-xl rounded-full flex items-center justify-center text-gray-500 hover:text-blue-500 hover:scale-110 transition-all z-40 border border-gray-100 dark:border-white/10"
                    >
                        <ArrowUp size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

const FeatureCard = ({ title, desc, delay }: { title: string, desc: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="p-6 bg-white dark:bg-[#2C2C2E] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm"
    >
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
);
