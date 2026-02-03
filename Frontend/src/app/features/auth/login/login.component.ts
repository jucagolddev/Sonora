/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Componente de Acceso (Login)
 * Descripción: Gestiona la autenticación de usuarios existentes.
 *              Incluye validación de formularios y redirección post-login.
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
  // Definición del formulario reactivo
  formularioLogin: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificacionService: NotificacionService
  ) {
    /**
     * Inicialización de validaciones dinámicas:
     * - email: obligatorio y con formato válido.
     * - password: obligatorio (mínimo 6 caracteres).
     */
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Procesa el envío del formulario.
   */
  onSubmit() {
    if (this.formularioLogin.valid) {
      // Llamada al servicio de autenticación
      this.authService
        .login(this.formularioLogin.value)
        .subscribe({
          next: (response) => {
            if (response && response.token) {
              this.notificacionService.mostrar('¡Bienvenido de nuevo!', 'success');
              this.router.navigate(['/']);
            }
          },
          error: (err) => {
            console.error('Error en login:', err);
            const msg = err.error?.mensaje || 'Error al iniciar sesión. Revisa tus credenciales.';
            this.notificacionService.mostrar(msg, 'error');
          }
        });

    } else {
      this.notificacionService.mostrar('Por favor, completa el formulario correctamente.', 'warning');
    }
  }
}