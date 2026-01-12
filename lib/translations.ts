export type Language = 'en' | 'de';

export const translations = {
    en: {
        // Sidebar
        sidebar: {
            title: "Tills MMS",
            subtitle: "Filament Manager",
            newProject: "New Project",
            guideTitle: "Guide",
            guideDesc: "Learn how to set up your printer for multicolor without AMS.",
            readGuide: "READ GUIDE",
            darkMode: "Dark Mode",
            version: "v1.2.0 • Pure Client",
            confirmNewProject: "Start a new project? This will reset your current progress."
        },
        // Guide Overlay
        guide: {
            title: "Manual Multicolor",
            subtitle: "No AMS? No Problem.",
            heroTitle: "Unlock Multicolor.",
            heroDesc: "To enable manual multicolor printing on your Bambu Lab A1 Series printer without AMS, you need to modify three G-code sections in your Printer Preset. You can save the changes to a new preset for this Purpose only.",
            step1Title: "Change Filament G-Code",
            step1Desc: "This snippet ensures the printer pauses and maintains the correct temperature during the swap. Replace the existing block entirely.",
            step2Title: "Machine Start G-Code",
            step2Desc: "Remove the automation sequences that require the AMS. Locate and delete these two specific sections.",
            step3Title: "Machine End G-Code",
            step3Desc: "Prevent the printer from attempting to rewind the filament into the AMS at the end of the print.",
            deletePartA: "Delete Part A",
            deletePartA_Desc: "Search for <code class='code-snippet'>G1 X-13.5 F3000</code>. Delete the block immediately following it.",
            deletePartB: "Delete Part B",
            deletePartB_Desc: "Scroll down to ~line 320 and delete the Tangle Detection line.",
            removeBlock: "Remove Block",
            removeBlock_Desc: "Find <code class='code-snippet'>; pull back filament to AMS</code> near line 65. Delete the block shown on the right.",
            importantNote: "Important Note",
            importantNote_Desc: "Since we removed the initial heating command in Step 2 to bypass the AMS load check, you must <strong>manually load the first filament</strong> before starting your print. The printer will heat up and handle the rest correctly during calibration.",
            copy: "COPY",
            copied: "COPIED"
        },
        // Home
        home: {
            dashboard: "Dashboard",
            subtitleEmpty: "Manage your 3D print filament swaps efficiently.",
            subtitleStats: "{completed} of {total} tasks completed",
            resetAll: "Reset All",
            confirmReset: "Reset all tasks?",
            smartParsing: "Smart Parsing",
            smartParsingDesc: "Automatically extracts filament changes from Bambu/Prusa G-code.",
            progressTracking: "Progress Tracking",
            progressTrackingDesc: "Remember where you left off, even if you close the browser.",
            printComplete: "Print Complete!",
            printCompleteDesc: "Great job navigating those filament swaps.",
            startNewPrint: "Start New Print",
            dropFile: "Drop Print File Here",
            processing: "Processing File...",
            analyzing: "Analyzing...",
            orClick: "or click to browse",
            supports: "Supports .gcode and .3mf",
            errorParse: "Failed to parse file. Please try again.",
            about: "About & Disclaimer",
            disclaimerText: "This is a hobby project. I take no responsibility or liability for any damage caused by modified G-code. Use at your own risk. For private use only.",
            githubContact: "Feedback or Issues? Contact me on GitHub."
        },
        // TaskRow
        task: {
            swap: "Swap",
            z: "Z"
        },
        // Settings
        settings: {
            language: "Language",
            done: "Done",
            title: "Settings",
            version: "Version",
            versionValue: "v1.2.0"
        }
    },
    de: {
        // Sidebar
        sidebar: {
            title: "Tills MMS",
            subtitle: "Filament Manager",
            newProject: "Neues Projekt",
            guideTitle: "Anleitung",
            guideDesc: "Lerne, wie du deinen Drucker ohne AMS für Multicolor einrichtest.",
            readGuide: "ANLEITUNG",
            darkMode: "Design",
            version: "v1.2.0 • Pure Client",
            confirmNewProject: "Neues Projekt starten? Dein aktueller Fortschritt wird zurückgesetzt."
        },
        // Guide Overlay
        guide: {
            title: "Manueller Farbwechsel",
            subtitle: "Kein AMS? Kein Problem.",
            heroTitle: "Multicolor entsperren.",
            heroDesc: "Um manuellen Mehrfarbdruck auf deinem Bambu Lab A1 (ohne AMS) zu ermöglichen, musst du drei G-Code-Abschnitte in deinem Drucker-Preset ändern. Du kannst diese Änderungen in einem neuen Preset speichern.",
            step1Title: "Filamentwechsel G-Code",
            step1Desc: "Dieser Code sorgt dafür, dass der Drucker pausiert und die Temperatur hält. Ersetze den vorhandenen Block vollständig.",
            step2Title: "Maschinen Start G-Code",
            step2Desc: "Entferne die automatischen Sequenzen, die das AMS benötigen. Suche und lösche diese zwei Bereiche.",
            step3Title: "Maschinen Ende G-Code",
            step3Desc: "Verhindere, dass der Drucker am Ende versucht, das Filament ins AMS zurückzuziehen.",
            deletePartA: "Teil A löschen",
            deletePartA_Desc: "Suche nach <code class='code-snippet'>G1 X-13.5 F3000</code>. Lösche den Block direkt danach.",
            deletePartB: "Teil B löschen",
            deletePartB_Desc: "Scrolle runter zu ~Zeile 320 und lösche die Zeile für 'Tangle Detection'.",
            removeBlock: "Block entfernen",
            removeBlock_Desc: "Finde <code class='code-snippet'>; pull back filament to AMS</code> nahe Zeile 65. Lösche den Block rechts.",
            importantNote: "Wichtiger Hinweis",
            importantNote_Desc: "Da wir im Schritt 2 den initialen Heizbefehl entfernt haben (um den AMS-Check zu umgehen), musst du das <strong>erste Filament manuell laden</strong>, bevor du den Druck startest.",
            copy: "KOPIEREN",
            copied: "KOPIERT"
        },
        // Home
        home: {
            dashboard: "Übersicht",
            subtitleEmpty: "Verwalte deine Filamentwechsel effizient.",
            subtitleStats: "{completed} von {total} Aufgaben erledigt",
            resetAll: "Zurücksetzen",
            confirmReset: "Alle Aufgaben zurücksetzen?",
            smartParsing: "Intelligentes Parsen",
            smartParsingDesc: "Erkennt Filamentwechsel in Bambu/Prusa G-Code automatisch.",
            progressTracking: "Fortschritt speichern",
            progressTrackingDesc: "Merk dir, wo du aufgehört hast, auch wenn du den Browser schließt.",
            printComplete: "Druck abgeschlossen!",
            printCompleteDesc: "Super gemacht! Alle Wechsel erledigt.",
            startNewPrint: "Neuen Druck starten",
            dropFile: "Druckdatei hier ablegen",
            processing: "Verarbeite Datei...",
            analyzing: "Analysiere...",
            orClick: "oder klicken zum Auswählen",
            supports: "Unterstützt .gcode und .3mf",
            errorParse: "Fehler beim Lesen der Datei. Bitte versuche es erneut.",
            about: "Über & Haftungsausschluss",
            disclaimerText: "Dies ist ein Hobbyprojekt. Ich übernehme keine Verantwortung oder Haftung für Schäden, die durch modifizierten G-Code entstehen. Benutzung auf eigene Gefahr. Nur für den privaten Gebrauch.",
            githubContact: "Feedback oder Fehler? Kontaktier mich auf GitHub."
        },
        // TaskRow
        task: {
            swap: "Wechsel",
            z: "Z"
        },
        // Settings
        settings: {
            language: "Sprache",
            done: "Fertig",
            title: "Einstellungen",
            version: "Version",
            versionValue: "v1.2.0"
        }
    }
};
