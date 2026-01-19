import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SoundService } from '../../core/services/sound.service';
import { Sound } from '../../core/models/sound.interface';

/**
 * COMPONENTE DE CATEGORÍA (CategoryComponent)
 * ------------------------------------------------------------------
 * Muestra el catálogo de sonidos filtrado por una categoría específica.
 * Obtiene el nombre de la categoría desde los parámetros de la URL.
 */
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit, OnDestroy {
  // Información de la categoría y resultados
  categoriaNombre: string = '';
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
   * Ciclo de Vida: Inicialización
   * Se suscribe a los cambios de parámetros de la URL para recargar los sonidos
   * si el usuario navega entre diferentes categorías.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.categoriaNombre = params.get('nombre') || '';
      this.cargarSonidos();
    });
  }

  /**
   * Obtiene los sonidos desde el servicio y aplica el filtro de categoría.
   */
  cargarSonidos() {
    this.soundService.getAllSounds().subscribe({
      next: (datos: Sound[]) => {
        if (this.categoriaNombre) {
          // Filtrado insensible a mayúsculas
          this.listaSonidos = datos.filter(
            (sound) =>
              sound.categoria &&
              sound.categoria.toLowerCase() === this.categoriaNombre.toLowerCase()
          );
        }
      },
      error: (err) => console.error('Error al cargar la categoría:', err)
    });
  }

  /**
   * Limpieza preventiva.
   */
  ngOnDestroy() {
    this.detenerAudio();
  }

  // -----------------------------------------------------------------
  // LÓGICA DE REPRODUCCIÓN (Audio Playback)
  // -----------------------------------------------------------------

  /**
   * Alterna entre reproducir y pausar un sonido.
   */
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

  private reproducirNuevoSonido(sonido: Sound, index: number) {
    this.detenerAudio();
    this.audioActual = new Audio(sonido.audioUrl);
    this.audioActual.load();
    this.sonidoActualIndice = index;

    // Actualizar la barra de progreso reactivamente
    this.audioActual.ontimeupdate = () => {
      this.actualizarProgreso();
    };

    this.audioActual.onended = () => {
      this.estaReproduciendo = false;
      this.progresoActual = 0;
    };

    this.audioActual.play()
      .then(() => this.estaReproduciendo = true)
      .catch((error) => console.error('Error al reproducir audio:', error));
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

  /**
   * Detiene el audio y limpia el estado.
   */

  private detenerAudio() {
    if (this.audioActual) {
      this.audioActual.pause();
      this.audioActual = null;
      this.estaReproduciendo = false;
      this.progresoActual = 0;
      this.sonidoActualIndice = -1;
    }
  }

  /**
   * Cálculo matemático del porcentaje de avance del audio.
   */
  private actualizarProgreso() {
    if (this.audioActual && this.audioActual.duration) {
      this.progresoActual =
        (this.audioActual.currentTime / this.audioActual.duration) * 100;
    }
  }

  /**
   * Permite al usuario saltar a un tiempo específico mediante el slider.
   */
  buscarPosicion(evento: any) {
    const valor = evento.target.value;
    if (this.audioActual && this.audioActual.duration) {
      const tiempo = (valor / 100) * this.audioActual.duration;
      this.audioActual.currentTime = tiempo;
    }
  }
}

