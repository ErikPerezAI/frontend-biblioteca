import Link from "next/link";
import { Libro } from "@/types/libro";

export const dynamic = "force-dynamic";

export default async function LibrosPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  let libros: Libro[] = [];
  let errorMensaje: string | null = null;

  try {
    const res = await fetch(`${apiUrl}/api/libros`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error en respuesta: ${res.status}`);
    }

    libros = await res.json();
  } catch (error) {
    console.error("Error al obtener libros:", error);
    errorMensaje = "No se pudieron cargar los libros. Intentá nuevamente más tarde.";
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Catálogo de Biblioteca
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Consumiendo la API REST de Laravel (<code className="bg-slate-200 px-1 py-0.5 rounded text-xs">{apiUrl}/api/libros</code>)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/libros/nuevo"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
            >
              + Nuevo libro
            </Link>
          </div>
        </div>

        {/* Manejo de errores (Paso 3) */}
        {errorMensaje && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 mb-8">
            <div className="flex">
              <div className="text-red-500 font-bold mr-3 text-lg">⚠️</div>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  {errorMensaje}
                </h3>
                <p className="text-xs text-red-600 mt-1">
                  Asegurate de que el servidor de Laravel esté encendido en{" "}
                  <code>{apiUrl}</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Listado de libros (Paso 2, Paso 5 y Opción C) */}
        {!errorMensaje && libros.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
            <p className="text-slate-500">No hay libros registrados en la biblioteca aún.</p>
            <Link
              href="/libros/nuevo"
              className="mt-4 inline-block text-blue-600 hover:underline font-medium text-sm"
            >
              Creá el primer libro aquí
            </Link>
          </div>
        )}

        {!errorMensaje && libros.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {libros.map((libro) => {
              const estaDisponible = Boolean(libro.disponible);

              return (
                <li
                  key={libro.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-bold text-slate-800 line-clamp-1">
                        {libro.titulo}
                      </h2>
                      {/* Opción C: mensaje distinto según disponibilidad */}
                      {estaDisponible ? (
                        <span className="shrink-0 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Disponible
                        </span>
                      ) : (
                        <span className="shrink-0 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          (No disponible)
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 mt-1">
                      <span className="font-medium text-slate-700">Autor:</span> {libro.autor}
                    </p>

                    {libro.anio_publicacion && (
                      <p className="text-xs text-slate-400 mt-1">
                        Año de publicación: {libro.anio_publicacion}
                      </p>
                    )}
                  </div>

                  {/* Paso 5: Enlace con componente Link */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-mono">ID: #{libro.id}</span>
                    <Link
                      href={`/libros/${libro.id}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
                    >
                      Ver detalle
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
