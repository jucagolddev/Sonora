/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Componente de Subida de Archivos (Upload)
 * Descripción: En este componente hemos desarrollado la funcionalidad para que 
 *              nuestros usuarios puedan compartir sus creaciones. Gestionamos
 *              la selección del archivo, validamos su formato y mostramos el
 *              progreso de la subida en tiempo real.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { SoundService } from '../../../core/services/sound.service';
import { NotificacionService } from '../../../core/services/notificacion.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent implements OnInit {
  // Formulario reactivo para capturar metadatos del audio
  formularioSubida: FormGroup;
  
  // Gestión del archivo físico seleccionado por el usuario
  archivoSeleccionado: File | null = null;
  nombreArchivo: string = '';

  // Estados interactivos para informar al usuario de la subida
  porcentaje: number = 0;
  subiendo: boolean = false;

  // Lista de categorías que nosotros cargamos desde la base de datos
  categorias: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private soundService: SoundService,
    private notificacionService: NotificacionService,
  ) {
    /**
     * Definición de Campos Requeridos
     * -------------------------------------------------------------------
     * Nosotros pedimos título, autor, categoría y una breve descripción
     * para que el catálogo de Sonora sea fácil de navegar.
     */
    this.formularioSubida = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      nombreArchivo: ['', Validators.required],
    });
  }

  /**
   * Carga Inicial
   * ------------------------------------------------------------------
   * Al entrar en la vista de subida, nosotros traemos las categorías 
   * disponibles para que el usuario pueda clasificar su audio correctly.
   */
  ngOnInit(): void {
    this.soundService.getCategories().subscribe({
      next: (cats) => (this.categorias = cats),
      error: (err) => console.error('Error al recuperar categorías en la subida:', err),
    });
  }

  /**
   * Selección de Archivo
   * ------------------------------------------------------------------
   * Validamos que el archivo sea de un tipo de audio o video permitido
   * antes de aceptarlo para la subida.
   */
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Definimos los tipos MIME y extensiones que nosotros autorizamos
      const validTypes = ['audio/mpeg', 'video/mp4', 'audio/wav', 'audio/ogg', 'audio/mp3'];
      const validExtensions = ['.mp3', '.mp4', '.wav', '.ogg'];

      const isTypeValid = validTypes.includes(file.type);
      const isExtensionValid = validExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext),
      );

      if (!isTypeValid && !isExtensionValid) {
        this.notificacionService.mostrar(
          'Lo sentimos, solo permitimos archivos MP3, MP4, WAV u OGG.',
          'warning',
        );
        return;
      }

      // Si es válido, lo guardamos y actualizamos la interfaz
      this.archivoSeleccionado = file;
      this.nombreArchivo = file.name;
      this.formularioSubida.patchValue({ nombreArchivo: file.name });
    }
  }

  /**
   * Tramitación de la Subida
   * ------------------------------------------------------------------
   * Este método coordina el envío del archivo y sus datos a nuestra API.
   * Utilizamos FormData para empaquetar el archivo binario y los textos.
   */
  onSubmit() {
    if (this.formularioSubida.valid && this.archivoSeleccionado) {
      this.subiendo = true;
      this.porcentaje = 0;

      const formData = new FormData();
      formData.append('archivo', this.archivoSeleccionado);
      formData.append('titulo', this.formularioSubida.get('titulo')?.value);
      formData.append('autor', this.formularioSubida.get('autor')?.value);
      formData.append('categoria', this.formularioSubida.get('categoria')?.value);

      // Recuperamos el ID del usuario de nuestra sesión local
      const currentUser = localStorage.getItem('sonora_current_user');

      if (currentUser) {
        try {
          const userObj = JSON.parse(currentUser);
          formData.append('id_usuario_fk', userObj.id_usuario.toString());
        } catch (e) {
          console.error('Error al interpretar los datos del usuario:', e);
          return;
        }
      } else {
        this.notificacionService.mostrar('Para subir contenido a Sonora, primero debes iniciar sesión.', 'warning');
        this.subiendo = false;
        return;
      }

      /**
       * Petición HTTP con Seguimiento
       * --------------------------------------------------------------
       * Nosotros configuramos la petición para observar los eventos y poder
       * calcular el porcentaje de subida para nuestra barra de progreso.
       */
      this.http
        .post('http://localhost:3000/api/archivos/subir', formData, {
          reportProgress: true,
          observe: 'events',
        })
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              // Calculamos el avance de la subida
              this.porcentaje = Math.round((100 * event.loaded) / event.total);
            } else if (event.type === HttpEventType.Response) {
              // Finalización exitosa
              this.notificacionService.mostrar('¡Magnífico! Tu archivo se ha compartido correctamente en Sonora.', 'success');
              this.limpiarFormulario();
            }
          },
          error: (err) => {
            console.error('Error durante el proceso de envío:', err);
            const mensajeError = err.error?.detalle || err.error?.mensaje || 'Ha ocurrido un problema al subir tu archivo.';
            this.notificacionService.mostrar(mensajeError, 'error');
            this.subiendo = false;
          },
        });
    } else {
      this.notificacionService.mostrar('Por favor, asegúrate de haber seleccionado un archivo y rellenado los campos.', 'warning');
    }
  }

  /**
   * Limpieza de Interfaz
   * Restablecemos los valores del formulario para permitir una nueva subida.
   */
  private limpiarFormulario() {
    this.subiendo = false;
    this.porcentaje = 0;
    this.formularioSubida.reset();
    this.nombreArchivo = '';
    this.archivoSeleccionado = null;
  }
}

