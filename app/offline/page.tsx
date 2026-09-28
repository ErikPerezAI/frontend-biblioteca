"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          📡
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Estás sin conexión
        </h1>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Parece que perdiste la conexión a internet. La aplicación continuará funcionando con los datos guardados en caché local gracias al Service Worker.
        </p>

        <div className="space-y-3">
          <Link
            href="/libros"
            className="w-full inline-block px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
          >
            Ver catálogo en caché
          </Link>
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
            className="w-full inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Reintentar conexión
          </button>
        </div>
      </div>
    </main>
  );
}
