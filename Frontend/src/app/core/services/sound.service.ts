/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Servicio de Sonidos (Frontend)
 * Descripción: Servicio encargado de la gestión de recursos de audio.
 *              Actualmente utiliza Mock Data, preparado para integración API.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sound } from '../models/sound.interface';
import { Observable, map } from 'rxjs';

/**
 * SERVICIO DE SONIDOS (SoundService)
 * -------------------------------------------------------------------
 * Responsable de la obtención y filtrado de los recursos de audio.
 */
@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private apiUrl = 'http://localhost:3000/api/canciones';
  private backendBaseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los sonidos desde el API.
   * @returns Observable con el array de sonidos.
   */
  /**
   * Obtener todos los sonidos desde el API.
   * opcionalmente filtrados por categoría.
   * @param categoria Filtro opcional por categoría
   * @returns Observable con el array de sonidos.
   */
  getAllSounds(categoria?: string): Observable<Sound[]> {
    let url = this.apiUrl;
    if (categoria) {
      url += `?categoria=${encodeURIComponent(categoria)}`;
    }

    return this.http.get<any>(url).pipe(
      map((response) => {
        // Mapeamos la respuesta del backend al formato de nuestra interfaz
        return response.audios.map((a: any) => ({
          id: a.id_cancion,
          titulo: a.titulo,
          autor: a.autor_nombre || 'Desconocido',
          imgUrl: 'assets/img/pajaro.jpg', // Placeholder
          audioUrl: `${this.backendBaseUrl}${a.url_audio}`,
          categoria: a.categoria || 'Otros',
          duracion: a.duracion,
          descargas: a.descargas,
          reproducciones: a.reproducciones,
        }));
      }),
    );
  }

  /**
   * Obtener lista única de categorías desde el backend.
   */
  getCategories(): Observable<string[]> {
    return this.http
      .get<any>(`${this.apiUrl}/categorias`)
      .pipe(map((response) => response.categorias));
  }

  /**
   * Buscar sonidos por título.
   * @param termino Texto a buscar.
   * @returns Observable con los sonidos filtrados.
   */
  searchSounds(termino: string): Observable<Sound[]> {
    return this.getAllSounds().pipe(
      map((sonidos) =>
        sonidos.filter((s) =>
          s.titulo.toLowerCase().includes(termino.toLowerCase()),
        ),
      ),
    );
  }
}
