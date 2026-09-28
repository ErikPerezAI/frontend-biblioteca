import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">
          📚
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          API de Biblioteca
        </h1>
        <p className="mt-3 text-slate-600 text-base leading-relaxed">
          Frontend desarrollado en <strong>Next.js 16 (App Router + React 19)</strong> consumiendo la API REST de Laravel creada en el Proyecto Integrador.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/libros"
            className="w-full flex items-center justify-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all hover:shadow-lg text-base"
          >
            Ver Catálogo de Libros (/libros) →
          </Link>
          <Link
            href="/libros/nuevo"
            className="w-full flex items-center justify-center px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition text-sm"
          >
            + Agregar Nuevo Libro (/libros/nuevo)
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 text-left">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Puntos Implementados al Pie de la Letra:
          </h2>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li><strong>Paso 2:</strong> Server Component async en <code>/libros</code> con fetch a Laravel.</li>
            <li><strong>Paso 3:</strong> Manejo de errores con mensaje amigable si la API no responde.</li>
            <li><strong>Paso 4:</strong> Ruta dinámica <code>/libros/[id]</code> con detalle completo.</li>
            <li><strong>Paso 5:</strong> Navegación SPA instantánea usando componente <code>Link</code>.</li>
            <li><strong>Desafío A:</strong> Botón interactivo de Favorito (Client Component).</li>
            <li><strong>Desafío B:</strong> Formulario de alta con Server Actions.</li>
            <li><strong>Desafío C:</strong> Indicador visual de libros no disponibles.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
