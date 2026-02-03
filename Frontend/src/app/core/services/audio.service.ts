/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Servicio de Audio Global
 * Descripción: Gestiona un único objeto Audio para toda la aplicación.
 *              Asegura que solo suene un sonido a la vez y sincroniza
 *              el estado entre diferentes componentes.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sound } from '../models/sound.interface';
import { NotificacionService } from './notificacion.service';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audio = new Audio();

  // Estado actual del sonido
  private currentSoundSubject = new BehaviorSubject<Sound | null>(null);
  public currentSound$ = this.currentSoundSubject.asObservable();

  // Estado de reproducción
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  public isPlaying$ = this.isPlayingSubject.asObservable();

  // Progreso (0 a 100)
  private progressSubject = new BehaviorSubject<number>(0);
  public progress$ = this.progressSubject.asObservable();

  // Duración actual (segundos)
  private durationSubject = new BehaviorSubject<number>(0);
  public duration$ = this.durationSubject.asObservable();

  constructor(private notificacionService: NotificacionService) {
    // Configurar listeners del objeto Audio
    this.audio.ontimeupdate = () => {
      if (this.audio.duration) {
        this.durationSubject.next(this.audio.duration);
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressSubject.next(progress);
      }
    };

    this.audio.onplay = () => this.isPlayingSubject.next(true);
    this.audio.onpause = () => this.isPlayingSubject.next(false);
    this.audio.onended = () => {
      this.isPlayingSubject.next(false);
      this.progressSubject.next(0);
    };

    this.audio.onloadedmetadata = () => {
      if (this.audio.duration) {
        this.durationSubject.next(this.audio.duration);
      }
    };

    this.audio.onerror = (e) => {
      console.error('Error en AudioService:', e);
      this.isPlayingSubject.next(false);
      this.notificacionService.mostrar('No se pudo cargar el audio. Verifique la conexión.', 'error');
    };
  }

  /**
   * Obtiene el sonido que está cargado actualmente.
   */
  get currentSoundValue(): Sound | null {
    return this.currentSoundSubject.value;
  }

  /**
   * Reproduce un sonido nuevo o reanuda el actual.
   */
  play(sound: Sound) {
    const current = this.currentSoundSubject.value;

    if (current && current.id === sound.id) {
      this.audio.play();
    } else {
      this.audio.pause();
      this.audio.src = sound.audioUrl;
      this.audio.load();
      this.currentSoundSubject.next(sound);
      this.audio.play();
    }
  }

  /**
   * Pausa el sonido actual.
   */
  pause() {
    this.audio.pause();
  }

  /**
   * Detiene el sonido y vuelve al inicio.
   */
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.progressSubject.next(0);
  }

  /**
   * Reinicia la pista desde el principio.
   */
  restart() {
    this.audio.currentTime = 0;
    this.audio.play();
  }

  /**
   * Cambia la posición de reproducción.
   * @param percent Porcentaje (0 a 100)
   */
  seek(percent: number) {
    if (this.audio.duration) {
      this.audio.currentTime = (percent / 100) * this.audio.duration;
    }
  }

  /**
   * Obtiene la duración de forma asíncrona si aún no está disponible.
   */
  getDuration(): number {
    return this.audio.duration || 0;
  }
}
