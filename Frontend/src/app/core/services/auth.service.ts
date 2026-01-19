/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Servicio de Autenticación (Frontend)
 * Descripción: Gestiona la comunicación HTTP con el API de Usuarios.
 *              Mantiene el estado de la sesión (Login/Logout) usando RxJS.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

// =================================================================
// INTERFACES DEL SERVICIO
// Definición de tipos de datos para las peticiones y respuestas.
// =================================================================

/**
 * Estructura de la respuesta del servidor tras autenticación.
 */
interface AuthResponse {
  mensaje: string;
  token: string;
  id_usuario?: number;
  nombre_usuario: string;
  es_administrador?: number;
}

/**
 * Datos requeridos para iniciar sesión o registrarse.
 */
interface Credentials {
  email: string;
  password: string;
  nombre_usuario?: string; // Opcional si solo es Login
}

/**
 * SERVICIO DE AUTENTICACIÓN (AuthService)
 * ------------------------------------------------------------------
 * Gestiona toda la lógica relacionada con la seguridad del usuario:
 * - Login (Inicio de sesión)
 * - Registro
 * - Almacenamiento y gestión del Token JWT.
 * - Estado de la sesión (Observables para saber si el usuario está conectado).
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Clave usada para persistir el token en LocalStorage
  private TOKEN_KEY = 'sonora_token';

  // URL base de la API para gestión de usuarios
  private baseUrl = 'http://localhost:3000/api/usuarios';

  /**
   * BehaviorSubject que mantiene el estado actual de la sesión (true/false).
   * Permite a los componentes reaccionar reactivamente cuando el usuario entra o sale.
   */
  private loggedIn = new BehaviorSubject<boolean>(this.checkLoginStatus());

  /**
   * BehaviorSubject que mantiene los datos del usuario actual.
   * Útil para mostrar el nombre del usuario en el Header, por ejemplo.
   */
  private currentUserSubject = new BehaviorSubject<any>(
    this.getUserFromStorage()
  );

  constructor(private http: HttpClient) {}

  // -----------------------------------------------------------------
  // GETTERS (Observables Públicos)
  // -----------------------------------------------------------------

  /**
   * Observable para saber si hay alguien conectado.
   */
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  /**
   * Observable para obtener los datos del usuario conectado.
   */
  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  // -----------------------------------------------------------------
  // MÉTODOS PÚBLICOS (API Calls)
  // -----------------------------------------------------------------

  /**
   * Iniciar Sesión en el servidor.
   * POST /api/usuarios/login
   *
   * @param credentials Email y contraseña del usuario.
   * @returns Observable con la respuesta del servidor (token y datos).
   */
  login(credentials: Credentials): Observable<AuthResponse> {
    const url = `${this.baseUrl}/login`;

    return this.http.post<AuthResponse>(url, credentials).pipe(
      tap((response) => {
        // Al recibir el token, guardamos la sesión inmediatamente
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
   * Registrar un nuevo usuario.
   * POST /api/usuarios/registro
   *
   * @param userData Datos del formulario de registro.
   * @returns Observable con la respuesta (token y datos).
   */
  register(userData: Credentials): Observable<AuthResponse> {
    const url = `${this.baseUrl}/registro`;

    return this.http.post<AuthResponse>(url, userData).pipe(
      tap((response) => {
        // En esta app, al registrarse, se inicia sesión automáticamente
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
   * Cerrar Sesión.
   * Elimina el token y limpia el estado global de la aplicación.
   */
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('sonora_current_user');
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Obtiene el token JWT actual (Raw String).
   * Útil para los Interceptores HTTP que adjuntan el token a las peticiones.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // -----------------------------------------------------------------
  // MÉTODOS PRIVADOS (Gestión Interna)
  // -----------------------------------------------------------------

  /**
   * Guarda la sesión en LocalStorage y actualiza los Subjects.
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

    // Notificar cambios al resto de la app
    this.loggedIn.next(true);
    this.currentUserSubject.next(userPayload);
  }

  /**
   * Verifica al iniciar el servicio si existe un token guardado.
   */
  private checkLoginStatus(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Recupera los datos del usuario del LocalStorage al recargar la página.
   */
  private getUserFromStorage(): any {
    const user = localStorage.getItem('sonora_current_user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  }
}

