import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sound } from '../../../core/models/sound.interface';
import { AudioService } from '../../../core/services/audio.service';
import { Subscription } from 'rxjs';

/**
 * COMPONENTE: SoundCardComponent
 * -------------------------------------------------------------------
 * Representa una tarjeta de sonido individual con controles completos.
 */
@Component({
  selector: 'app-sound-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sound-card.component.html',
  styleUrls: [], // Estilos globales en _cards.scss
})
export class SoundCardComponent implements OnInit, OnDestroy {
  @Input() sonido!: Sound;

  // Estado local para UI
  estaReproduciendo = false;
  progreso = 0;
  tiempoActual = '0:00';
  duracionTotal = '0:00';

  private subscripciones = new Subscription();

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    // Sincronizar con el estado global de reproducción
    this.subscripciones.add(
      this.audioService.currentSound$.subscribe((s) => {
        // Reset visual si no es mi sonido
        if (s?.id !== this.sonido.id) {
          this.estaReproduciendo = false;
          this.progreso = 0;
          this.tiempoActual = '0:00';
        }
      }),
    );

    this.subscripciones.add(
      this.audioService.isPlaying$.subscribe((playing) => {
        if (this.estaSiendoReproducido()) {
          this.estaReproduciendo = playing;
        } else {
          this.estaReproduciendo = false;
        }
      }),
    );

    this.subscripciones.add(
      this.audioService.progress$.subscribe((p) => {
        if (this.estaSiendoReproducido()) {
          this.progreso = p;
          this.actualizarTiempos();
        }
      }),
    );

    this.subscripciones.add(
      this.audioService.duration$.subscribe((d) => {
        if (this.estaSiendoReproducido()) {
          this.duracionTotal = this.formatearTiempo(d);
        }
      }),
    );

    // Inicializar duración si viene del backend
    if (this.sonido.duracion) {
      this.duracionTotal = this.sonido.duracion;
    }
  }

  ngOnDestroy() {
    this.subscripciones.unsubscribe();
  }

  /**
   * Comprueba si este componente es el que está en el AudioService.
   */
  estaSiendoReproducido(): boolean {
    const current = this.audioService.currentSoundValue;
    return current?.id === this.sonido.id;
  }

  togglePlay() {
    if (this.estaReproduciendo) {
      this.audioService.pause();
    } else {
      this.audioService.play(this.sonido);
    }
  }

  stop() {
    if (this.estaSiendoReproducido()) {
      this.audioService.stop();
    }
  }

  restart() {
    if (this.estaSiendoReproducido()) {
      this.audioService.restart();
    }
  }

  onSeek(event: any) {
    const value = event.target.value;
    if (this.estaSiendoReproducido()) {
      this.audioService.seek(Number(value));
    }
  }

  descargar() {
    // Simular descarga (en entorno real sería una petición al backend para contar descarga)
    const link = document.createElement('a');
    link.href = this.sonido.audioUrl;
    link.download = `${this.sonido.titulo}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private actualizarTiempos() {
    const duracionSegs = this.audioService.getDuration();
    if (duracionSegs > 0) {
      const segsActuales = (this.progreso / 100) * duracionSegs;
      this.tiempoActual = this.formatearTiempo(segsActuales);
      this.duracionTotal = this.formatearTiempo(duracionSegs);
    }
  }

  private formatearTiempo(segundos: number): string {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
  }
}
