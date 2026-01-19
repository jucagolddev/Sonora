/**
 * INTERFAZ DE SONIDO (Sound)
 * ------------------------------------------------------------------
 * Define la estructura de datos para los archivos de audio en la aplicación.
 * Asegura que todos los componentes manejen el mismo contrato de datos.
 */
export interface Sound {
  id: number;
  titulo: string;
  autor: string;
  // URL de la imagen de portada
  imgUrl: string;
  // URL de descarga/reproducción del archivo MP3
  audioUrl: string;
  // Categoría del sonido para filtrado y organización (Incluso variaciones frecuentes)
  categoria: 'Naturaleza' | 'Instrumento' | 'Instrumentos' | 'Extraño' | 'Extraños' | 'Grito' | 'Gritos' | 'Musica' | 'Música' | 'Efectos' | 'Notificacion' | 'Notificaciones' | 'Transicion' | 'Transiciones' | 'Silbido' | 'Silbidos' | 'Coche' | 'Coches' | 'Moto' | 'Motos' | 'Otros';
  duracion?: number;
}
