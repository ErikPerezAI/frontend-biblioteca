import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { RegistroServiceWorker } from "@/components/RegistroServiceWorker";
import BotonInstalarPWA from "@/components/BotonInstalarPWA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biblioteca App",
  description: "Sistema de gestión y catálogo de libros PWA",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E3A5F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <RegistroServiceWorker />

        {/* Barra superior con navegación y botón de instalación PWA (Opción C) */}
        <header className="bg-[#1E3A5F] text-white shadow-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-base tracking-tight hover:opacity-95 transition"
            >
              <span className="text-xl">📚</span>
              <span>Biblioteca App</span>
            </Link>

            <nav className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/libros"
                className="text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition"
              >
                Catálogo
              </Link>
              <Link
                href="/libros/nuevo"
                className="text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition"
              >
                + Nuevo Libro
              </Link>

              {/* Botón propio para instalar PWA (Opción C) */}
              <BotonInstalarPWA />
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          Biblioteca App &bull; Progressive Web App (PWA) con Service Worker
        </footer>
      </body>
    </html>
  );
}
