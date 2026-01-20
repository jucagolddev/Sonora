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
  categorias: string[] = [];
  sonidosNaturaleza: Sound[] = [];
  sonidosInstrumentos: Sound[] = [];
  sonidosExtranos: Sound[] = [];

  constructor(
    private router: Router,
    private soundService: SoundService,
  ) {}

  /**
   * Inicialización: Carga datos y organiza carruseles.
   */
  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {}

  /**
   * Obtiene todos los sonidos y los clasifica por categoría para rellenar los carruseles.
   */
  private cargarDatos() {
    // Cargar Categorías
    this.soundService.getCategories().subscribe({
      next: (cats) => {
        this.categorias = cats;
      },
      error: (err) => console.error('Error al cargar categorías:', err),
    });

    // Cargar Sonidos
    this.soundService.getAllSounds().subscribe({
      next: (sonidos) => {
        this.listaSonidos = sonidos;
        // Filtrado por categorías para los diferentes carruseles de la portada
        this.sonidosNaturaleza = sonidos.filter(
          (s) => s.categoria.toLowerCase() === 'naturaleza',
        );
        this.sonidosInstrumentos = sonidos.filter((s) =>
          s.categoria.toLowerCase().includes('instrumento'),
        );
        this.sonidosExtranos = sonidos.filter((s) =>
          s.categoria.toLowerCase().includes('extraño'),
        );
      },
      error: (err) => console.error('Error al cargar datos en Home:', err),
    });
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
