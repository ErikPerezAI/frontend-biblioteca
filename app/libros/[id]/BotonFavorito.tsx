"use client";

import { useState } from "react";

export default function BotonFavorito() {
  const [esFavorito, setEsFavorito] = useState<boolean>(false);

  return (
    <button
      type="button"
      onClick={() => setEsFavorito((prev) => !prev)}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer border ${
        esFavorito
          ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 shadow-sm"
          : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className="text-base text-amber-500">{esFavorito ? "★" : "☆"}</span>
      <span>{esFavorito ? "Favorito" : "Marcar como favorito"}</span>
    </button>
  );
}
