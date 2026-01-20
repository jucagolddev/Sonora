import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Sonora';

  constructor() {
    // La gestión de la sesión y navegación ahora se delega al HeaderComponent
  }
}
