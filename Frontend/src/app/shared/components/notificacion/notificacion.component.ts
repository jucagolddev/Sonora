import { Component } from '@angular/core';
import { NotificacionService, Notificacion } from '../../../core/services/notificacion.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-notificacion',
    templateUrl: './notificacion.component.html',
    styleUrls: ['./notificacion.component.scss'],
})
export class NotificacionComponent {
    notificaciones$: Observable<Notificacion[]>;

    constructor(private notificacionService: NotificacionService) {
        this.notificaciones$ = this.notificacionService.notificaciones$;
    }

    cerrar(id: number) {
        this.notificacionService.eliminar(id);
    }
}
