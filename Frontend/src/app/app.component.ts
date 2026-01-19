import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',

})
export class AppComponent {
  title = 'Sonora';
  isLoggedIn$: Observable<boolean>;
  isHomePage: boolean = true;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;

    // Me suscribo a los eventos del router para saber en qué página estoy.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isHomePage = event.urlAfterRedirects === '/';
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); 
  }
}
