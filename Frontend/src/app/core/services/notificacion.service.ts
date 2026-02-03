/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Servicio de Notificaciones
 * Descripción: Gestiona el estado y ciclo de vida de las notificaciones
 *              globales de la aplicación.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notificacion {
  id: number;
  tipo: 'success' | 'error' | 'info' | 'warning';
  mensaje: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);
  public notificaciones$ = this.notificacionesSubject.asObservable();
  private contadorId = 0;

  constructor() {}

  /**
   * Muestra una nueva notificación.
   * @param mensaje Texto a mostrar
   * @param tipo Tipo de alerta (por defecto 'info')
   * @param duracion Duración en ms (por defecto 3000ms)
   */
  mostrar(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning' = 'info', duracion: number = 3000) {
    const id = ++this.contadorId;
    const nuevaNotificacion: Notificacion = { id, tipo, mensaje };

    const actual = this.notificacionesSubject.value;
    this.notificacionesSubject.next([...actual, nuevaNotificacion]);

    if (duracion > 0) {
      setTimeout(() => this.eliminar(id), duracion);
    }
  }

  /**
   * Elimina una notificación por su ID.
   */
  eliminar(id: number) {
    const actual = this.notificacionesSubject.value;
    this.notificacionesSubject.next(actual.filter((n) => n.id !== id));
  }
}
