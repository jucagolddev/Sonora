import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * INTERCEPTOR DE TOKEN (TokenInterceptor)
 * ------------------------------------------------------------------
 * Este interceptor captura todas las peticiones HTTP salientes desde Angular.
 * Si existe un token JWT en el localStorage, lo añade a la cabecera
 * de la petición con el formato 'Bearer <token>'.
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Intentamos recuperar el token guardado en el navegador durante el login
    const token = localStorage.getItem('sonora_token');

    // Si el token existe, clonamos la petición y le añadimos el Header Authorization
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }

    // Si no hay token, la petición sigue su curso normal
    return next.handle(request);
  }
}
