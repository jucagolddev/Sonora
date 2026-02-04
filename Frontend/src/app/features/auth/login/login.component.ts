/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Componente de Inicio de Sesión (Login)
 * Descripción: En esta sección gestionamos el acceso de los usuarios a Sonora.
 *              Hemos implementado formularios reactivos para asegurar que los
 *              datos introducidos sean válidos antes de enviarlos a nuestro servidor.
 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacionService } from '../../../core/services/notificacion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  // Nuestro formulario controlado por Angular
  formularioLogin: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificacionService: NotificacionService
  ) {
    /**
     * Construcción de nuestro Formulario Reactivo
     * -------------------------------------------------------------------
     * Definimos las reglas de validación:
     * - Email: Es obligatorio y debe tener una estructura decorosa.
     * - Password: Es obligatorio para proteger la cuenta.
     */
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Proceso de Autenticación
   * ------------------------------------------------------------------
   * Cuando el usuario pulsa el botón de entrar, nosotros verificamos los 
   * datos y nos comunicamos con nuestro servicio de identidad.
   */
  onSubmit() {
    // Solo actuamos si nosotros consideramos que el formulario es válido
    if (this.formularioLogin.valid) {
      this.authService
        .login(this.formularioLogin.value)
        .subscribe({
          next: (response) => {
            if (response && response.token) {
              // Si el servidor nos da el visto bueno, saludamos y entramos
              this.notificacionService.mostrar('¡Es genial verte de nuevo en Sonora!', 'success');
              this.router.navigate(['/']);
            }
          },
          error: (err) => {
            console.error('Error durante el login en nuestro componente:', err);
            const msg = err.error?.mensaje || 'No hemos podido reconocer tus credenciales. Por favor, inténtalo de nuevo.';
            this.notificacionService.mostrar(msg, 'error');
          }
        });

    } else {
      // Si faltan datos, nosotros avisamos amablemente al usuario
      this.notificacionService.mostrar('Por favor, rellena todos los campos para que podamos identificarte.', 'warning');
    }
  }
}
