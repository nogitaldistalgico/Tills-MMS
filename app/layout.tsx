import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/lib/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "Tills MMS - Filament Manager",
    description: "Track 3D print filament changes",
    manifest: "/manifest.json",
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
    themeColor: "#F5F5F7",
    icons: {
        icon: '/icon.png?v=8',
        apple: '/apple-icon.png?v=8',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Tills MMS",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(inter.variable, "font-sans antialiased text-gray-900 dark:text-white bg-bg-light dark:bg-bg-dark h-[100dvh] overflow-hidden flex flex-col md:flex-row safe-area-inset-bottom")}>
                <LanguageProvider>
                    <Sidebar />
                    <main className="flex-1 md:ml-[250px] h-full overflow-y-auto relative pb-32 md:pb-0">
                        {children}
                    </main>
                </LanguageProvider>
            </body>
        </html>
    );
}
