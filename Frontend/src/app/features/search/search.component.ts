import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SoundService } from '../../core/services/sound.service';
import { Sound } from '../../core/models/sound.interface';

/**
 * COMPONENTE DE BÚSQUEDA (SearchComponent)
 * ------------------------------------------------------------------
 * Maneja la lógica de filtrado de sonidos basada en un término de búsqueda.
 * Visualiza los resultados en tiempo real según el parámetro de la URL.
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit, OnDestroy {
  // Estado de la búsqueda
  terminoBusqueda: string = '';
  listaSonidos: Sound[] = [];

  // Lógica de reproducción de audio local (Estado interno)
  audioActual: HTMLAudioElement | null = null;
  sonidoActualIndice: number = -1;
  estaReproduciendo: boolean = false;
  progresoActual: number = 0;

  constructor(
    private route: ActivatedRoute,
    private soundService: SoundService
  ) {}

  /**
   * Reacciona a los cambios en la URL para actualizar la búsqueda.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.terminoBusqueda = params.get('termino') || '';
      this.cargarSonidos();
    });
  }

  /**
   * Obtiene todos los sonidos y filtra localmente por título (Case Insensitive).
   */
  cargarSonidos() {
    this.soundService.getAllSounds().subscribe({
      next: (datos: Sound[]) => {
        if (this.terminoBusqueda) {
          const termino = this.terminoBusqueda.toLowerCase();
          this.listaSonidos = datos.filter((sound) =>
            sound.titulo.toLowerCase().includes(termino)
          );
        } else {
          this.listaSonidos = [];
        }
      },
      error: (err) => console.error('Error en la búsqueda:', err)
    });
  }

  ngOnDestroy() {
    this.detenerAudio();
  }

  // -----------------------------------------------------------------
  // CONTROL DE AUDIO
  // -----------------------------------------------------------------

  toggleReproduccion(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index) {
      if (this.estaReproduciendo) {
        this.pausarAudio();
      } else {
        this.reanudarAudio();
      }
    } else {
      this.reproducirNuevoSonido(sonido, index);
    }
  }

  /**
   * Reinicia el audio desde el principio.
   */
  replaySonido(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index && this.audioActual) {
      this.audioActual.currentTime = 0;
      if (!this.estaReproduciendo) {
        this.reanudarAudio();
      }
    } else {
      this.reproducirNuevoSonido(sonido, index);
    }
  }

  /**
   * Detiene el sonido actual (manual).
   */
  stopSonido(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index) {
      this.detenerAudio();
    }
  }

  private reproducirNuevoSonido(sonido: Sound, index: number) {
    this.detenerAudio();
    this.audioActual = new Audio(sonido.audioUrl);
    this.audioActual.load();
    this.sonidoActualIndice = index;

    this.audioActual.ontimeupdate = () => {
      this.actualizarProgreso();
    };

    this.audioActual.onended = () => {
      this.estaReproduciendo = false;
      this.progresoActual = 0;
      this.sonidoActualIndice = -1;
    };

    this.audioActual.play()
      .then(() => this.estaReproduciendo = true)
      .catch((error) => console.error('Error al reproducir:', error));
  }

  private pausarAudio() {
    if (this.audioActual) {
      this.audioActual.pause();
      this.estaReproduciendo = false;
    }
  }

  private reanudarAudio() {
    if (this.audioActual) {
      this.audioActual.play();
      this.estaReproduciendo = true;
    }
  }

  private detenerAudio() {
    if (this.audioActual) {
      this.audioActual.pause();
      this.audioActual = null;
      this.estaReproduciendo = false;
      this.progresoActual = 0;
      this.sonidoActualIndice = -1;
    }
  }

  private actualizarProgreso() {
    if (this.audioActual && this.audioActual.duration) {
      this.progresoActual =
        (this.audioActual.currentTime / this.audioActual.duration) * 100;
    }
  }

  buscarPosicion(evento: any) {
    const valor = evento.target.value;
    if (this.audioActual && this.audioActual.duration) {
      const tiempo = (valor / 100) * this.audioActual.duration;
      this.audioActual.currentTime = tiempo;
    }
  }
}
