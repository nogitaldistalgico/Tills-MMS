import JSZip from 'jszip';

export interface Filament {
    id: number;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    tool_idx: number;
    type: "start" | "swap";
    title: string;
    description: string;
    color: string;
    z_height: number;
    progress_percent: number;
    is_completed: boolean;
    layer_num?: number;
}

export interface PrintJob {
    filename: string;
    stats: {
        total_swaps: number;
        unique_filaments_count: number;
    };
    filaments: Filament[];
    tasks: Task[];
}

export const parseGcodeContent = (filename: string, content: string): PrintJob => {
    const lines = content.split('\n');
    const total_lines = lines.length;

    const filaments: Record<number, Filament> = {};
    const tasks: Task[] = [];

    let filament_colors_raw: string[] = [];
    let filament_names_raw: string[] = [];

    // Scan headers (first 2000 lines)
    for (let i = 0; i < Math.min(lines.length, 2000); i++) {
        const line = lines[i].trim();
        if (line.startsWith("; filament_colour =")) {
            const val = line.split("=")[1].trim();
            filament_colors_raw = val.split(";").map(c => c.trim());
        } else if (line.startsWith("; filament_settings_id =")) {
            const val = line.split("=")[1].trim();
            const raw_names = val.split(";").map(n => n.trim().replace(/"/g, ''));
            filament_names_raw = raw_names.map(n => n.replace("@BBL A1M", "").trim());
        }
    }

    // Create Filament objects
    // Default to at least one if none found, to avoid crash
    if (filament_colors_raw.length === 0) {
        filaments[0] = { id: 0, name: "Unknown Filament", color: "#007AFF" };
    } else {
        filament_colors_raw.forEach((color, i) => {
            const name = filament_names_raw[i] || `Filament ${i + 1}`;
            filaments[i] = { id: i, name, color };
        });
    }

    let current_z = 0.0;
    let current_layer = 0;
    let last_tool = -1;
    let is_pseudo_start = true;

    lines.forEach((line, i) => {
        line = line.trim();

        // Track Layer
        // Prusa/Bambu often use "; LAYER x" or "; layer x"
        if (line.startsWith("; LAYER") || line.startsWith("; layer")) {
            const parts = line.split(" ");
            if (parts.length > 1) {
                try {
                    current_layer = parseInt(parts[parts.length - 1]);
                } catch (e) { }
            }
        }

        // Track Z
        if (line.startsWith("; Z:")) {
            try {
                current_z = parseFloat(line.split(":")[1]);
            } catch (e) { }
        } else if (line.startsWith("G1") && line.includes("Z")) {
            const parts = line.split(" ");
            for (const part of parts) {
                if (part.startsWith("Z")) {
                    try {
                        current_z = parseFloat(part.substring(1));
                    } catch (e) { }
                }
            }
        }

        // Track Tool Change
        if (line.startsWith("T")) {
            const toolPart = line.substring(1);
            if (/^\d+$/.test(toolPart)) {
                const tool_idx = parseInt(toolPart);

                if (tool_idx !== last_tool) {
                    // Skip the very first "start" event (user request: remove first transition)
                    // But still update the last_tool so subsequent swaps are detected correctly.
                    if (is_pseudo_start) {
                        last_tool = tool_idx;
                        is_pseudo_start = false;
                        continue;
                    }

                    const task_type = "swap";

                    // Provide fallback if tool_idx exceeds known filaments
                    const fil = filaments[tool_idx] || {
                        id: tool_idx,
                        name: `Generic ${tool_idx}`,
                        color: "#cccccc"
                    };

                    const progress = (i / total_lines) * 100;

                    const task: Task = {
                        id: `measured_${i}_${tool_idx}`,
                        tool_idx: tool_idx,
                        type: task_type,
                        title: `➔ ${fil.name}`,
                        description: `Slot ${tool_idx + 1}`,
                        color: fil.color,
                        z_height: current_z,
                        layer_num: current_layer,
                        progress_percent: parseFloat(progress.toFixed(1)),
                        is_completed: false
                    };

                    tasks.push(task);

                    last_tool = tool_idx;
                }
            }
        }
    });

    // Stats
    const used_tool_idxs = new Set(tasks.map(t => t.tool_idx));
    const unique_count = used_tool_idxs.size;
    const total_swaps = tasks.filter(t => t.type === "swap").length;

    return {
        filename,
        stats: {
            total_swaps,
            unique_filaments_count: unique_count
        },
        filaments: Object.values(filaments),
        tasks
    };
};

export const parseFile = async (file: File): Promise<PrintJob> => {
    if (file.name.toLowerCase().endsWith(".3mf")) {
        const jszip = new JSZip();
        // File -> ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const zip = await jszip.loadAsync(arrayBuffer);

        // Find .gcode
        const gcodeFileName = Object.keys(zip.files).find(n => n.endsWith(".gcode"));
        if (!gcodeFileName) {
            throw new Error("No .gcode file found in this .3mf archive.");
        }

        const content = await zip.file(gcodeFileName)?.async("string");
        if (!content) throw new Error("Could not read gcode content.");

        return parseGcodeContent(file.name, content);

    } else {
        // Gcode
        const content = await file.text();
        return parseGcodeContent(file.name, content);
    }
};
