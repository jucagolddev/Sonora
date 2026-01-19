/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Componente Principal (Home)
 * Descripción: Página de inicio que muestra el catálogo musical.
 *              Incluye carruseles por categoría y reproductor de audio integrado.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SoundService } from '../../core/services/sound.service';
import { Sound } from '../../core/models/sound.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  // Estado de la búsqueda
  terminoBusqueda: string = '';

  // Listas de sonidos para los carruseles (Requeridas por el template)
  listaSonidos: Sound[] = [];
  sonidosNaturaleza: Sound[] = [];
  sonidosInstrumentos: Sound[] = [];
  sonidosExtranos: Sound[] = [];
  
  // Lógica de reproducción de audio (Estado interno)
  audioActual: HTMLAudioElement | null = null;
  sonidoActualIndice: number = -1;
  estaReproduciendo: boolean = false;
  progresoActual: number = 0;

  constructor(private router: Router, private soundService: SoundService) {}

  /**
   * Inicialización: Carga datos y organiza carruseles.
   */
  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.detenerAudio();
  }

  /**
   * Obtiene todos los sonidos y los clasifica por categoría para rrellenar los carruseles.
   */
  private cargarDatos() {
    this.soundService.getAllSounds().subscribe({
      next: (sonidos) => {
        this.listaSonidos = sonidos;
        // Filtrado por categorías para los diferentes carruseles de la portada
        this.sonidosNaturaleza = sonidos.filter(s => s.categoria === 'Naturaleza');
        this.sonidosInstrumentos = sonidos.filter(s => s.categoria === 'Instrumento');
        this.sonidosExtranos = sonidos.filter(s => s.categoria === 'Extraño');

        // Relleno de seguridad si hay pocos datos (Mock visual para presentación)
        if (this.sonidosNaturaleza.length < 5) this.sonidosNaturaleza = [...sonidos];
      },
      error: (err) => console.error('Error al cargar datos en Home:', err)
    });
  }

  // -----------------------------------------------------------------
  // MÉTODOS DE REPRODUCCIÓN (Requeridos por Template)
  // -----------------------------------------------------------------

  toggleReproduccion(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index && this.audioActual) {
      if (this.estaReproduciendo) {
        this.audioActual.pause();
        this.estaReproduciendo = false;
      } else {
        this.audioActual.play();
        this.estaReproduciendo = true;
      }
    } else {
      this.reproducirNuevo(sonido, index);
    }
  }

  private reproducirNuevo(sonido: Sound, index: number) {
    this.detenerAudio();
    this.audioActual = new Audio(sonido.audioUrl);
    this.sonidoActualIndice = index;
    
    this.audioActual.ontimeupdate = () => this.actualizarProgreso();
    this.audioActual.onended = () => {
      this.estaReproduciendo = false;
      this.sonidoActualIndice = -1;
    };

    this.audioActual.play().then(() => {
      this.estaReproduciendo = true;
    }).catch(err => console.error('Error al reproducir:', err));
  }

  replaySonido(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index && this.audioActual) {
      this.audioActual.currentTime = 0;
      this.estaReproduciendo = true;
      this.audioActual.play();
    } else {
      this.reproducirNuevo(sonido, index);
    }
  }

  stopSonido(sonido: Sound, index: number) {
    if (this.sonidoActualIndice === index) {
      this.detenerAudio();
    }
  }

  private detenerAudio() {
    if (this.audioActual) {
      this.audioActual.pause();
      this.audioActual = null;
      this.sonidoActualIndice = -1;
      this.estaReproduciendo = false;
      this.progresoActual = 0;
    }
  }

  private actualizarProgreso() {
    if (this.audioActual && this.audioActual.duration) {
      this.progresoActual = (this.audioActual.currentTime / this.audioActual.duration) * 100;
    }
  }

  buscarPosicion(evento: any) {
    const valor = evento.target.value;
    if (this.audioActual && this.audioActual.duration) {
      this.audioActual.currentTime = (valor / 100) * this.audioActual.duration;
    }
  }

  // -----------------------------------------------------------------
  // NAVEGACIÓN Y CARRUSEL
  // -----------------------------------------------------------------

  buscarSonidos() {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/buscar', this.terminoBusqueda]);
    }
  }


  moverCarrusel(direccion: string, contenedor: HTMLElement) {
    const scrollAmount = direccion === 'izquierda' ? -400 : 400;
    contenedor.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}
