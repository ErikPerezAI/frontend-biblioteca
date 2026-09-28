import Link from "next/link";
import { Libro } from "@/types/libro";
import BotonFavorito from "./BotonFavorito";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LibroDetailPage({ params }: PageProps) {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  let libro: Libro | null = null;
  let errorMensaje: string | null = null;

  try {
    const res = await fetch(`${apiUrl}/api/libros/${id}`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      errorMensaje = `El libro con ID #${id} no existe en la biblioteca.`;
    } else if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    } else {
      libro = await res.json();
    }
  } catch (error) {
    console.error("Error al obtener detalle del libro:", error);
    errorMensaje =
      errorMensaje ||
      "No se pudo cargar la información del libro. Verificá que la API de Laravel esté activa.";
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Navegación hacia atrás (Paso 5) */}
        <div className="mb-6">
          <Link
            href="/libros"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            ← Volver al catálogo de libros
          </Link>
        </div>

        {/* Manejo de error cuando el recurso no existe o la API falla */}
        {errorMensaje || !libro ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Libro no encontrado
            </h2>
            <p className="text-slate-600 mb-6 text-sm">{errorMensaje}</p>
            <Link
              href="/libros"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              Ver todos los libros
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Cabecera de la ficha */}
            <div className="bg-slate-900 text-white p-6 sm:p-8">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Libro #{libro.id}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                    {libro.titulo}
                  </h1>
                  <p className="text-slate-300 text-lg mt-1 font-medium">
                    por {libro.autor}
                  </p>
                </div>

                {/* Opción A: Botón de favorito interactivo */}
                <div className="shrink-0">
                  <BotonFavorito />
                </div>
              </div>
            </div>

            {/* Contenido / Detalle completo (Paso 4) */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Año de Publicación
                  </span>
                  <p className="text-lg font-bold text-slate-800 mt-1">
                    {libro.anio_publicacion ?? "No especificado"}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    Estado de Disponibilidad
                  </span>
                  <div className="mt-1">
                    {Boolean(libro.disponible) ? (
                      <span className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ● Disponible para préstamo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 text-sm font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        ○ No disponible (en préstamo)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Metadatos técnicos */}
              {(libro.created_at || libro.updated_at) && (
                <div className="border-t border-slate-100 pt-4 text-xs text-slate-400 flex flex-wrap justify-between gap-2">
                  {libro.created_at && (
                    <span>Registrado: {new Date(libro.created_at).toLocaleString()}</span>
                  )}
                  {libro.updated_at && (
                    <span>Actualizado: {new Date(libro.updated_at).toLocaleString()}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
