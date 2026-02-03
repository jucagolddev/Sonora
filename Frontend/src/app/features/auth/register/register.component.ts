/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Componente de Registro
 * Descripción: Gestiona el alta de nuevos usuarios en el sistema.
 *              Valida formularios y datos antes de enviarlos al backend.
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
  // Formulario reactivo para capturar múltiples datos del usuario
  formularioRegistro: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificacionService: NotificacionService
  ) {
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
   * Lógica de procesamiento de registro.
   */
  onSubmit() {
    if (this.formularioRegistro.valid) {
      this.isLoading = true; // Block C: Feedback interactivo
      const pass = this.formularioRegistro.get('password')?.value;
      const confirm = this.formularioRegistro.get('confirmPassword')?.value;

      // Validación extra en cliente: coincidencia de contraseñas
      if (pass !== confirm) {
        alert('Las contraseñas no coinciden.');
        this.isLoading = false;
        return;
      }

      /**
       * TRANSFORMACIÓN DE DATOS
       * El backend espera 'nombre_usuario'. Combinamos nombre y apellidos.
       */
      const datosParaBackend = {
        nombre_usuario: `${this.formularioRegistro.value.nombre} ${this.formularioRegistro.value.apellidos}`,
        email: this.formularioRegistro.value.email,
        password: this.formularioRegistro.value.password,
      };

      // Comunicación con el servicio
      this.authService.register(datosParaBackend).subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log('Registro exitoso:', res);
          this.notificacionService.mostrar(
            '¡Usuario registrado con éxito! Sesión iniciada automáticamente.',
            'success'
          );
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error detallado en registro:', err);
          // Intentamos mostrar el mensaje específico del backend si existe
          const msg =
            err.error?.mensaje ||
            'No se pudo completar el registro. Verifica que el servidor (Backend) esté corriendo y que la base de datos esté accesible.';
          this.notificacionService.mostrar(`Error: ${msg}`, 'error');
        },
      });
    } else {
      // Block C: Feedback error visual (podría añadirse wiggle animation aquí)
      alert('Por favor, completa todos los campos requeridos correctamente.');
      this.formularioRegistro.markAllAsTouched();
    }
  }
}
