/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Componente de Subida de Archivos
 * Descripción: Permite al usuario cargar audio/video al servidor.
 *              Implementa validación de tipos, barra de progreso y
 *              vinculación de metadatos (título, autor, categoría).
 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent {

  formularioSubida: FormGroup;
  archivoSeleccionado: File | null = null;
  // Nombre del archivo mostrado en la UI (Matriz con template)
  nombreArchivo: string = ''; 
  
  // Estados de la subida
  porcentaje: number = 0;
  subiendo: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient
  ) {
    this.formularioSubida = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required], 
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      notas: ['']
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const validTypes = ['audio/mpeg', 'video/mp4', 'audio/wav', 'audio/ogg'];
      const validExtensions = ['.mp3', '.mp4', '.wav', '.ogg'];
      
      const isTypeValid = validTypes.includes(file.type);
      const isExtensionValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

      if (!isTypeValid && !isExtensionValid) {
        alert('Solo se permiten archivos de audio/video válidos (MP3, MP4, WAV, OGG).');
        return;
      }
      this.archivoSeleccionado = file;
      this.nombreArchivo = file.name;
    }
  }

  onSubmit() {
    if (this.formularioSubida.valid && this.archivoSeleccionado) {
      this.subiendo = true;
      this.porcentaje = 0;

      const formData = new FormData();
      formData.append('archivo', this.archivoSeleccionado);
      formData.append('titulo', this.formularioSubida.get('titulo')?.value);
      formData.append('autor', this.formularioSubida.get('autor')?.value);
      formData.append('categoria', this.formularioSubida.get('categoria')?.value);
      
      const currentUser = localStorage.getItem('sonora_current_user'); 

      if (currentUser) {
        try {
          const userObj = JSON.parse(currentUser);
          const idUsuario = userObj.id_usuario;
          formData.append('id_usuario_fk', idUsuario.toString());
        } catch (e) {
          console.error('Error al procesar sesión:', e);
          return;
        }
      } else {
        alert('Inicie sesión para subir contenido.');
        this.subiendo = false;
        return;
      }

      this.http.post('http://localhost:3000/api/archivos/subir', formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.porcentaje = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            alert('¡Archivo subido correctamente!');
            this.limpiarFormulario();
          }
        },
        error: (err) => {
          console.error('Error durante la subida:', err);
          alert('Error crítico al subir el archivo.');
          this.subiendo = false;
        }
      });
    } else {
      alert('Por favor, completa el formulario y selecciona un archivo.');
    }
  }

  private limpiarFormulario() {
    this.subiendo = false;
    this.porcentaje = 0;
    this.formularioSubida.reset();
    this.nombreArchivo = '';
    this.archivoSeleccionado = null;
  }
}