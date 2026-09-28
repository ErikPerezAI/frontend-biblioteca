import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function NuevoLibroPage() {
  async function crearLibro(formData: FormData) {
    "use server";

    const titulo = formData.get("titulo") as string;
    const autor = formData.get("autor") as string;
    const anio = formData.get("anio_publicacion") as string;
    const disponible = formData.get("disponible") === "on";

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const res = await fetch(`${apiUrl}/api/libros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        titulo: titulo.trim(),
        autor: autor.trim(),
        anio_publicacion: anio ? parseInt(anio, 10) : null,
        disponible,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      console.error("Error al crear libro en la API:", err);
      throw new Error(err?.message || "No se pudo registrar el libro.");
    }

    revalidatePath("/libros");
    redirect("/libros");
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <Link
            href="/libros"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            ← Volver al catálogo
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Registrar Nuevo Libro
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Opción B: Creación mediante Server Action enviando un <code>POST</code> a la API de Laravel.
            </p>
          </div>

          <form action={crearLibro} className="space-y-5">
            <div>
              <label
                htmlFor="titulo"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Título del Libro <span className="text-red-500">*</span>
              </label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                required
                placeholder="Ej. Ficciones"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="autor"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Autor <span className="text-red-500">*</span>
              </label>
              <input
                id="autor"
                name="autor"
                type="text"
                required
                placeholder="Ej. Jorge Luis Borges"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="anio_publicacion"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Año de Publicación (opcional)
              </label>
              <input
                id="anio_publicacion"
                name="anio_publicacion"
                type="number"
                placeholder="Ej. 1944"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                id="disponible"
                name="disponible"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label
                htmlFor="disponible"
                className="text-sm font-medium text-slate-700 select-none"
              >
                Disponible inmediatamente para préstamo
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Link
                href="/libros"
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg transition"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
              >
                Guardar Libro
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
