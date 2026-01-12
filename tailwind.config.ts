import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            colors: {
                accent: "#007AFF",
                secondary: "#8E8E93",
                "bg-light": "#F5F5F7",
                "bg-dark": "#1E1E1E",
                "sidebar-light": "#FFFFFF",
                "sidebar-dark": "#2C2C2E",
            },
        },
    },
    plugins: [],
};
export default config;
