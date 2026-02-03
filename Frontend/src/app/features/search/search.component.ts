import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SoundService } from '../../core/services/sound.service';
import { Sound } from '../../core/models/sound.interface';

/**
 * COMPONENTE DE BÚSQUEDA (SearchComponent)
 * ------------------------------------------------------------------
 * Gestiona la lógica de filtrado de sonidos basada en un término de búsqueda.
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

  constructor(
    private route: ActivatedRoute,
    private soundService: SoundService,
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
            sound.titulo.toLowerCase().includes(termino),
          );
        } else {
          this.listaSonidos = [];
        }
      },
      error: (err) => console.error('Error en la búsqueda:', err),
    });
  }

  ngOnDestroy() {}
}
