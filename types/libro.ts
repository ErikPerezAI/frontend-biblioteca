export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  anio_publicacion?: number | null;
  disponible: boolean | number;
  created_at?: string;
  updated_at?: string;
}
