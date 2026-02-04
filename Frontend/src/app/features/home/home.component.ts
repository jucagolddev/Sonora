/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Componente Principal (Home)
 * Descripción: Página de inicio que muestra el catálogo musical.
 *              Incluye carruseles por categoría y reproductor de audio integrado.
 */

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { SoundService } from '../../core/services/sound.service';
import { Sound } from '../../core/models/sound.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  // HERO VIDEO (Block A)
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  // Estado de la búsqueda
  terminoBusqueda: string = '';

  // Listas de sonidos para los carruseles (Requeridas por el template)
  listaSonidos: Sound[] = [];
  categorias: string[] = [];

  // Agrupación dinámica de sonidos por categoría para carruseles
  carruselesDinamicos: { nombre: string; sonidos: Sound[] }[] = [];

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

  ngAfterViewInit(): void {
      if (this.heroVideo && this.heroVideo.nativeElement) {
          this.heroVideo.nativeElement.muted = true;
          this.heroVideo.nativeElement.volume = 0;
      }
  }

  ngOnDestroy(): void {}

  /**
   * Obtiene todos los sonidos y los clasifica por categoría para rellenar los carruseles.
   */
  private cargarDatos() {
    // Cargar Categorías
    this.soundService.getCategories().subscribe({
      next: (cats) => {
        // Barajar aleatoriamente y seleccionar entre 10 y 15
        const numRandom = Math.floor(Math.random() * 6) + 10; // Entre 10 y 15
        this.categorias = cats
          .sort(() => Math.random() - 0.5)
          .slice(0, numRandom);
      },
      error: (err) => console.error('Error al cargar la categoría:', err),
    });

    // Cargar Sonidos
    this.soundService.getAllSounds().subscribe({
      next: (sonidos) => {
        this.listaSonidos = sonidos;

        // Organizar carruseles dinámicamente
        const grupos: { [key: string]: Sound[] } = {};

        sonidos.forEach((s) => {
          if (!grupos[s.categoria]) {
            grupos[s.categoria] = [];
          }
          grupos[s.categoria].push(s);
        });

        // Obtener nombres de categorías que tienen sonidos
        const nombresCategorias = Object.keys(grupos);

        // Barajar aleatoriamente las categorías
        const categoriasBarajadas = nombresCategorias.sort(
          () => Math.random() - 0.5,
        );

        // Seleccionar hasta 3 aleatorias
        this.carruselesDinamicos = categoriasBarajadas
          .slice(0, 3)
          .map((cat) => ({
            nombre: cat,
            sonidos: grupos[cat],
          }));
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
