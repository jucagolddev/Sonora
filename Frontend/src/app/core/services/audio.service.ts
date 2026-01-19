import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Audio } from '../models/audio.model';

@Injectable({ providedIn: 'root' })
export class AudioService {
    private API_URL = 'http://localhost:3000/api'; // Cambia esto a tu URL real

    constructor(private http: HttpClient) { }

    getAudios(): Observable<Audio[]> {
        return this.http.get<{ audios: Audio[] }>(this.API_URL).pipe(
            map(response => response.audios) 
        );
    }

    // Para buscar sonidos
    buscarAudios(termino: string): Observable<Audio[]> {
        return this.http.get<Audio[]>(`${this.API_URL}/audios/search?q=${termino}`);
    }
}