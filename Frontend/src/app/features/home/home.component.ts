/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Componente Principal de Inicio (Home)
 * Descripción: En nuestra página de inicio, presentamos a los usuarios el 
 *              catálogo musical completo. Hemos diseñado esta sección para 
 *              que se carguen dinámicamente tanto las categorías como los 
 *              sonidos destacados, ofreciendo una experiencia interactiva.
 */

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { SoundService } from '../../core/services/sound.service';
import { Sound } from '../../core/models/sound.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Referencia al Video del Hero
   * -------------------------------------------------------------------
   * Hemos incluido un video decorativo en la cabecera. Utilizamos ViewChild 
   * para poder manipular sus propiedades (como el silencio) desde nuestra lógica.
   */
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  // Variables de estado para la interactividad de nuestra página
  terminoBusqueda: string = ''; // Captura lo que el usuario escribe en nuestro buscador
  listaSonidos: Sound[] = [];   // Albergamos todos los sonidos recuperados del backend
  categorias: string[] = [];    // Lista de géneros disponibles en Sonora

  /**
   * Carruseles Dinámicos
   * ------------------------------------------------------------------
   * Para hacer la página más atractiva, nosotros generamos grupos de sonidos 
   * clasificados por sus categorías para mostrarlos en formato carrusel.
   */
  carruselesDinamicos: { nombre: string; sonidos: Sound[] }[] = [];

  constructor(
    private router: Router,
    private soundService: SoundService,
  ) {}

  /**
   * Inicialización del Componente
   * ------------------------------------------------------------------
   * Al cargar la página, nosotros disparamos la petición para traer los datos
   * iniciales de nuestros servicios de audio.
   */
  ngOnInit(): void {
    this.cargarDatos();
  }

  /**
   * Gestión Post-Visualización
   * ------------------------------------------------------------------
   * Una vez que la vista se ha renderizado, nosotros nos aseguramos de que 
   * el video de nuestra portada se reproduzca sin sonido, cumpliendo con 
   * las directrices de experiencia de usuario.
   */
  ngAfterViewInit(): void {
    if (this.heroVideo && this.heroVideo.nativeElement) {
      this.heroVideo.nativeElement.muted = true;
      this.heroVideo.nativeElement.volume = 0;
    }
  }

  ngOnDestroy(): void {
    // Aquí nosotros limpiaríamos suscripciones si fuera necesario
  }

  /**
   * Carga y Organización de Datos
   * ------------------------------------------------------------------
   * En esta función nos encargamos de:
   * 1. Solicitar las categorías a nuestra API y barajarlas para dar variedad.
   * 2. Recoger todos los sonidos y agruparlos para alimentar los carruseles.
   */
  private cargarDatos() {
    // Cargamos las categorías de nuestra base de datos
    this.soundService.getCategories().subscribe({
      next: (cats) => {
        // Seleccionamos un número aleatorio de ellas para nuestra rejilla de filtros
        const numRandom = Math.floor(Math.random() * 6) + 10;
        this.categorias = cats
          .sort(() => Math.random() - 0.5)
          .slice(0, numRandom);
      },
      error: (err) => console.error('Hemos tenido un error al cargar las categorías:', err),
    });

    // Recuperamos la colección completa de sonidos de Sonora
    this.soundService.getAllSounds().subscribe({
      next: (sonidos) => {
        this.listaSonidos = sonidos;

        // Organizamos nuestros carruseles de forma dinámica agrupando por categoría
        const grupos: { [key: string]: Sound[] } = {};

        sonidos.forEach((s) => {
          if (!grupos[s.categoria]) {
            grupos[s.categoria] = [];
          }
          grupos[s.categoria].push(s);
        });

        // Barajamos las categorías disponibles para mostrar diferentes grupos cada vez
        const nombresCategorias = Object.keys(grupos);
        const categoriasBarajadas = nombresCategorias.sort(
          () => Math.random() - 0.5,
        );

        // Seleccionamos hasta 3 grupos para mostrar en la página principal
        this.carruselesDinamicos = categoriasBarajadas
          .slice(0, 3)
          .map((cat) => ({
            nombre: cat,
            sonidos: grupos[cat],
          }));
      },
      error: (err) => console.error('Error al recuperar los sonidos de nuestro catálogo:', err),
    });
  }

  // -----------------------------------------------------------------
  // MÉTODOS DE NAVEGACIÓN
  // -----------------------------------------------------------------

  /**
   * Gestión de Búsqueda
   * Redirigimos al usuario a la vista de resultados cuando utiliza nuestra barra de búsqueda.
   */
  buscarSonidos() {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/buscar', this.terminoBusqueda]);
    }
  }

  /**
   * Control de Carrusel
   * Hemos programado esta función para que los botones laterales desplacen 
   * el contenedor de sonidos de forma horizontal y suave.
   */
  moverCarrusel(direccion: string, contenedor: HTMLElement) {
    const scrollAmount = direccion === 'izquierda' ? -400 : 400;
    contenedor.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

