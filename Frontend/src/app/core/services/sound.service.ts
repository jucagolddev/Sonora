/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Servicio de Sonidos (Frontend)
 * Descripción: Servicio encargado de la gestión de recursos de audio.
 *              Actualmente utiliza Mock Data, preparado para integración API.
 */

import { Injectable } from '@angular/core';
import { Sound } from '../models/sound.interface';
import { of } from 'rxjs';

/**
 * SERVICIO DE SONIDOS (SoundService)
 * -------------------------------------------------------------------
 * Responsable de la obtención y filtrado de los recursos de audio.
 */
@Injectable({
  providedIn: 'root',
})
export class SoundService {
  // Datos simulados (Mock Data) para desarrollo y pruebas de UI
  private sonidosMock: Sound[] = [
    {
      id: 1,
      titulo: 'Canto matutino',
      autor: 'Juan Pérez',
      imgUrl: 'assets/img/pajaro.jpg',
      audioUrl: 'assets/audio/test.mp3',
      categoria: 'Naturaleza',
    },
    {
      id: 2,
      titulo: 'Motor V8',
      autor: 'Ana G.',
      imgUrl: 'assets/img/coche.jpg',
      audioUrl: 'assets/audio/motor.mp3',
      categoria: 'Coches',
    },
  ];

  constructor() {}

  /**
   * Obtener todos los sonidos.
   * Simula una petición HTTP asíncrona usando 'of'.
   * @returns Observable con el array de sonidos.
   */
  getAllSounds() {
    return of(this.sonidosMock);
  }

  /**
   * Buscar sonidos por título.
   * Realiza un filtrado en el cliente sobre los datos mockeados.
   * @param termino Texto a buscar.
   * @returns Observable con los sonidos filtrados.
   */
  searchSounds(termino: string) {
    const filtrados = this.sonidosMock.filter((s) =>
      s.titulo.toLowerCase().includes(termino.toLowerCase())
    );
    return of(filtrados);
  }
}

