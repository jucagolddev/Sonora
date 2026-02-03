import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SoundService } from '../../core/services/sound.service';
import { Sound } from '../../core/models/sound.interface';

/**
 * COMPONENTE DE CATEGORÍA (CategoryComponent)
 * ------------------------------------------------------------------
 * Visualiza el catálogo de sonidos filtrado por una categoría específica.
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

  constructor(
    private route: ActivatedRoute,
    private soundService: SoundService,
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
    if (!this.categoriaNombre) return;

    this.soundService.getAllSounds(this.categoriaNombre).subscribe({
      next: (datos: Sound[]) => {
        this.listaSonidos = datos;
      },
      error: (err) => console.error('Error al cargar la categoría:', err),
    });
  }

  /**
   * Limpieza preventiva.
   */
  ngOnDestroy() {}
}
