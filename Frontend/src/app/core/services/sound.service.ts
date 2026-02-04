/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Servicio de Sonidos (Frontend)
 * Descripción: Este servicio actúa como el puente entre nuestra base de datos
 *              musical y la interfaz de usuario. Facilita la obtención de
 *              las canciones y las categorías disponibles.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sound } from '../models/sound.interface';
import { Observable, map } from 'rxjs';

/**
 * SERVICIO DE SONIDOS (SoundService)
 * -------------------------------------------------------------------
 * Hemos programado este servicio para gestionar la carga y el filtrado
 * de nuestra biblioteca de audio de forma centralizada.
 */
@Injectable({
  providedIn: 'root',
})
export class SoundService {
  // URLs de conexión a nuestra API del backend
  private apiUrl = 'http://localhost:3000/api/canciones';
  private backendBaseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Colección Completa de Sonidos
   * -----------------------------------------------------------------
   * Realiza la petición a nuestro servidor para traer los audios.
   * Hemos incluido la capacidad de filtrar por categoría desde la consulta.
   */
  getAllSounds(categoria?: string): Observable<Sound[]> {
    let url = this.apiUrl;
    if (categoria) {
      url += `?categoria=${encodeURIComponent(categoria)}`;
    }

    return this.http.get<any>(url).pipe(
      map((response) => {
        /**
         * Transformación de Datos (Mapping)
         * ------------------------------------------------------------
         * Adaptamos la estructura que nos devuelve SQL al formato que 
         * nosotros manejamos en nuestra interfaz de Angular.
         */
        return response.audios.map((a: any) => ({
          id: a.id_cancion,
          titulo: a.titulo,
          autor: a.autor_nombre || 'Desconocido',
          imgUrl: 'assets/img/pajaro.jpg', // Imagen por defecto de nuestra app
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
   * Catálogo de Categorías
   * -----------------------------------------------------------------
   * Recupera los géneros musicales y tipos de efectos que nosotros 
   * tenemos registrados en Sonora.
   */
  getCategories(): Observable<string[]> {
    return this.http
      .get<any>(`${this.apiUrl}/categorias`)
      .pipe(map((response) => response.categorias));
  }

  /**
   * Motor de Búsqueda Local
   * -----------------------------------------------------------------
   * Nos permite filtrar nuestra lista de sonidos cargada en memoria
   * según el término que el usuario escriba.
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

