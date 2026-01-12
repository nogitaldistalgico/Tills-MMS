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
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
                "relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center",
                isDragOver
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[1.02]"
                    : "border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-[#2C2C2E]/50 hover:border-blue-400/50"
            )}
        >
            <input
                type="file"
                accept=".gcode,.3mf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
                disabled={isProcessing}
            />

            <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
                isDragOver ? "bg-blue-100 text-blue-600" : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50"
            )}>
                {isProcessing ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                        <FileType size={32} />
                    </motion.div>
                ) : (
                    <Upload size={32} />
                )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {isProcessing ? "Analyzing..." : "Drop Print File Here"}
            </h3>
            <p className="text-sm text-gray-500">
                Supports .gcode and .3mf
            </p>
        </div>
    );
};
