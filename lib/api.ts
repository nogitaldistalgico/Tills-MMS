import { parseFile as clientParseFile, PrintJob, Task, Filament } from './parser';

// Re-export types for compatibility
export type { PrintJob, Task, Filament };

export const api = {
    parseFile: async (file: File): Promise<PrintJob> => {
        // Now purely client-side
        // Artificial delay to show "Processing" state for UX if file is too small, 
        // or just let it fly. Let's just return directly.
        return clientParseFile(file);
    }
};
