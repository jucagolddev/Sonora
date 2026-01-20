import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Interceptores
import { TokenInterceptor } from './core/interceptors/token.interceptor';

// Features
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { UploadComponent } from './features/projects/upload/upload.component';
import { SearchComponent } from './features/search/search.component';
import { CategoryComponent } from './features/category/category.component';

// Shared Components (Traditional)
// Removidos para arreglar error de compilación (obsoletos)

// Shared Components (Standalone)
import { AlertMsgComponent } from './shared/components/alert-msg/alert-msg.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { SoundCardComponent } from './shared/components/sound-card/sound-card.component';
import { HeaderComponent } from './shared/components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UploadComponent,
    SearchComponent,
    CategoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AlertMsgComponent,
    LoadingSpinnerComponent,
    SoundCardComponent,
    HeaderComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
