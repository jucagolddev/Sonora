/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Componente de Registro de Usuarios
 * Descripción: En este componente gestionamos el alta de nuevos miembros en
 *              nuestra comunidad. Nos encargamos de validar la información
 *              proporcionada y de enviarla a nuestro servidor de forma segura.
 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificacionService } from '../../../core/services/notificacion.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  // Estructura de nuestro formulario de inscripción
  formularioRegistro: FormGroup;
  isLoading: boolean = false; // Controlamos el estado de carga para dar feedback visual

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificacionService: NotificacionService
  ) {
    /**
     * Definición de Campos de Registro
     * -------------------------------------------------------------------
     * Nosotros requerimos nombre, apellidos, correo, contraseña y país 
     * para completar el perfil del usuario en Sonora.
     */
    this.formularioRegistro = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      pais: ['', Validators.required],
    });
  }

  /**
   * Proceso de Alta de Usuario
   * ------------------------------------------------------------------
   * Al enviar el formulario, realizamos validaciones de seguridad locales 
   * antes de contactar con nuestra API.
   */
  onSubmit() {
    if (this.formularioRegistro.valid) {
      this.isLoading = true; // Iniciamos la animación de espera
      
      const pass = this.formularioRegistro.get('password')?.value;
      const confirm = this.formularioRegistro.get('confirmPassword')?.value;

      // Validación interna: Nos aseguramos de que las contraseñas coincidan
      if (pass !== confirm) {
        this.notificacionService.mostrar('Las contraseñas que has introducido no coinciden.', 'warning');
        this.isLoading = false;
        return;
      }

      /**
       * ADAPTACIÓN DE DATOS (Mapping)
       * --------------------------------------------------------------
       * Nuestro backend espera el campo 'nombre_usuario'. Nosotros hemos
       * decidido combinar el nombre y los apellidos para generar este campo.
       */
      const datosParaBackend = {
        nombre_usuario: `${this.formularioRegistro.value.nombre} ${this.formularioRegistro.value.apellidos}`,
        email: this.formularioRegistro.value.email,
        password: this.formularioRegistro.value.password,
      };

      // Solicitamos a nuestro servicio de autenticación que tramite el registro
      this.authService.register(datosParaBackend).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.notificacionService.mostrar(
            '¡Bienvenido a Sonora! Tu cuenta ha sido creada y ya puedes disfrutar del catálogo.',
            'success'
          );
          this.router.navigate(['/']); // Redirigimos al inicio de la plataforma
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error durante el proceso de registro de nuestro equipo:', err);
          
          // Capturamos el mensaje de error específico que nos devuelva el servidor
          const msg = err.error?.mensaje || 'No hemos podido completar tu registro. Por favor, revisa tu conexión.';
          this.notificacionService.mostrar(`Error: ${msg}`, 'error');
        },
      });
    } else {
      // Si el formulario está incompleto, avisamos al usuario y marcamos los errores
      this.notificacionService.mostrar('Por favor, rellena todos los campos correctamente.', 'warning');
      this.formularioRegistro.markAllAsTouched();
    }
  }
}

