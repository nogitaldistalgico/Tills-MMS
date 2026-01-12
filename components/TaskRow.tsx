"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/lib/api';

interface TaskRowProps {
    task: Task;
    onToggle: (id: string) => void;
    index: number;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, onToggle, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={cn(
                "group relative flex items-center p-4 mb-2 rounded-xl transition-all duration-300",
                task.is_completed
                    ? "bg-gray-100/50 dark:bg-white/5 opacity-60 dark:border-transparent"
                    : "bg-white dark:bg-[#2C2C2E] shadow-sm hover:shadow-md border border-gray-100 dark:border-white/5"
            )}
        >
            {/* Checkbox / Action Area */}
            <button
                onClick={() => onToggle(task.id)}
                className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all mr-4",
                    task.is_completed
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                )}
            >
                <AnimatePresence>
                    {task.is_completed && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Check size={16} strokeWidth={3} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            {/* Color Indicator */}
            <div
                className="w-1.5 h-10 rounded-full mr-4 shadow-sm border border-black/5 dark:border-white/10"
                style={{ backgroundColor: task.color }}
            />

            {/* Content */}
            <div className="flex-1">
                <div className={cn(
                    "text-base font-semibold transition-colors",
                    task.is_completed ? "text-gray-500 line-through" : "text-gray-900 dark:text-white"
                )}>
                    {task.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {task.description}
                </div>

            </div>

            {/* Stats */}
            <div className="text-right text-xs text-gray-400 font-medium tabular-nums">
                <div>Swap #{index + 1}</div>
                <div>Z: {task.z_height.toFixed(2)}mm</div>
            </div>
        </motion.div>
    );
};
