"use client";

import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith('.gcode') || file.name.endsWith('.3mf')) {
                onFileSelect(file);
            }
        }
    }, [onFileSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
                "relative group cursor-pointer rounded-[2rem] p-16 transition-all duration-500 overflow-hidden",
                isDragOver
                    ? "bg-blue-500/5 dark:bg-blue-500/10 scale-[1.02]"
                    : "bg-white/80 dark:bg-[#1c1c1e]/60 hover:bg-white dark:hover:bg-[#1c1c1e] hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/20"
            )}
        >
            {/* Animated Border Gradient */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
                "bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-transparent"
            )} />

            <div className={cn(
                "absolute inset-0 border-2 border-dashed rounded-[2rem] transition-colors duration-300",
                isDragOver ? "border-blue-500/50" : "border-gray-200/60 dark:border-white/10 group-hover:border-blue-300/50 dark:group-hover:border-blue-700/30"
            )} />

            <input
                type="file"
                accept=".gcode,.3mf"
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
                disabled={isProcessing}
            />

            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
                <div className={cn(
                    "w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-xl",
                    isDragOver
                        ? "bg-blue-500 text-white scale-110 rotate-3"
                        : "bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:-translate-y-2"
                )}>
                    {isProcessing ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        >
                            <FileType size={42} strokeWidth={1.5} />
                        </motion.div>
                    ) : (
                        <Upload size={42} strokeWidth={1.5} />
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        {isProcessing ? "Processing File..." : "Drop Print File Here"}
                    </h3>
                    <p className="text-lg text-gray-400 font-medium">
                        or click to browse <span className="text-blue-500 dark:text-blue-400">.gcode</span> or <span className="text-blue-500 dark:text-blue-400">.3mf</span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
