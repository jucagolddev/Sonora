import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importamos Router
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs'; // Importamos Observable

/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Componente de Cabecera (Header)
 * Descripción: Gestionamos la barra de navegación superior.
 *              Mostramos opciones diferentes según si el usuario ha iniciado sesión o no.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], // Añadimos RouterModule para routerLink
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  // Observables para reaccionar a cambios en el estado de la sesión
  estaLogueado$: Observable<boolean>;
  usuarioActual$: Observable<any>;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    // Inicializamos los observables conectándolos al servicio de autenticación
    this.estaLogueado$ = this.authService.isLoggedIn$;
    this.usuarioActual$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Tareas de inicialización si fueran necesarias
  }

  /**
   * Método para cerrar la sesión del usuario.
   * Llamamos al servicio y redirigimos al inicio o login.
   */
  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
