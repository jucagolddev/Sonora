/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Servicio de Autenticación (Frontend)
 * Descripción: En este servicio centralizamos toda la lógica de comunicación
 *              con nuestro backend para temas de identidad. Gestionamos el 
 *              inicio de sesión, el registro y la persistencia de la sesión
 *              mediante el almacenamiento local de tokens (JWT).
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

// =================================================================
// INTERFACES DEL SERVICIO: Nuestra estructura de datos
// =================================================================

/**
 * Respuesta del Servidor: Lo que nosotros esperamos recibir tras autenticarnos.
 */
interface AuthResponse {
  mensaje: string;
  token: string;
  id_usuario?: number;
  nombre_usuario: string;
  es_administrador?: number;
}

/**
 * Credenciales: Los datos que nosotros enviamos para identificarnos.
 */
interface Credentials {
  email: string;
  password: string;
  nombre_usuario?: string; 
}

/**
 * SERVICIO DE AUTENTICACIÓN (AuthService)
 * ------------------------------------------------------------------
 * Este servicio es el corazón de la seguridad en nuestro frontend. 
 * Nos permite saber en todo momento quién está usando la aplicación.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Clave para guardar el token de forma persistente en el navegador
  private TOKEN_KEY = 'sonora_token';

  // Nuestra URL base para las peticiones de usuario
  private baseUrl = 'http://localhost:3000/api/usuarios';

  /**
   * Estado de la Sesión: 
   * Utilizamos BehaviorSubject para que el resto de componentes puedan
   * saber si nosotros hemos iniciado sesión o no.
   */
  private loggedIn = new BehaviorSubject<boolean>(this.checkLoginStatus());

  /**
   * Usuario Actual:
   * Aquí guardamos los datos básicos del perfil (nombre, ID) para
   * personalizár la interfaz de usuario.
   */
  private currentUserSubject = new BehaviorSubject<any>(
    this.getUserFromStorage()
  );

  constructor(private http: HttpClient) {}

  // -----------------------------------------------------------------
  // ACCESO EXTERNO (Observables Públicos)
  // -----------------------------------------------------------------

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  // -----------------------------------------------------------------
  // ACCIONES PRINCIPALES
  // -----------------------------------------------------------------

  /**
   * Inicio de Sesión (Login)
   * -----------------------------------------------------------------
   * Enviamos las credenciales al backend y, si son correctas, nosotros
   * guardamos el token de acceso recibido.
   */
  login(credentials: Credentials): Observable<AuthResponse> {
    const url = `${this.baseUrl}/login`;

    return this.http.post<AuthResponse>(url, credentials).pipe(
      tap((response) => {
        if (response.token) {
          this.setSession(
            response.token,
            response.nombre_usuario,
            response.id_usuario
          );
        }
      })
    );
  }

  /**
   * Registro de Nuevo Usuario
   * -----------------------------------------------------------------
   * Tramitamos el alta en nuestro sistema. Hemos configurado la app para
   * que tras el registro, nosotros entremos directamente a Sonora.
   */
  register(userData: Credentials): Observable<AuthResponse> {
    const url = `${this.baseUrl}/registro`;

    return this.http.post<AuthResponse>(url, userData).pipe(
      tap((response) => {
        if (response && response.token) {
          this.setSession(
            response.token,
            response.nombre_usuario,
            response.id_usuario || 0
          );
        }
      })
    );
  }

  /**
   * Cierre de Sesión (Logout)
   * -----------------------------------------------------------------
   * Eliminamos los datos de sesión para que nadie más pueda acceder 
   * desde este navegador sin volver a identificarse.
   */
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('sonora_current_user');
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Recuperar el Token
   * Nosotros lo usamos para enviarlo en las cabeceras de peticiones seguras.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // -----------------------------------------------------------------
  // GESTIÓN INTERNA (Privada)
  // -----------------------------------------------------------------

  /**
   * Persistencia de Sesión
   * Guardamos los datos en el LocalStorage para que la sesión no se 
   * cierre al refrescar la página.
   */
  private setSession(
    token: string,
    nombre_usuario: string,
    id_usuario: number | undefined
  ) {
    localStorage.setItem(this.TOKEN_KEY, token);

    const userPayload = {
      id_usuario: id_usuario,
      nombre_usuario: nombre_usuario,
    };
    localStorage.setItem('sonora_current_user', JSON.stringify(userPayload));

    // Notificamos el cambio al resto de nuestra aplicación
    this.loggedIn.next(true);
    this.currentUserSubject.next(userPayload);
  }

  private checkLoginStatus(): boolean {
    const token = this.getToken();
    return !!token;
  }

  private getUserFromStorage(): any {
    const user = localStorage.getItem('sonora_current_user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  }
}


