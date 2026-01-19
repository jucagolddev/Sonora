import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { UploadComponent } from './features/projects/upload/upload.component';
import { SearchComponent } from './features/search/search.component';
import { CategoryComponent } from './features/category/category.component';

/**
 * CONFIGURACIÓN DE RUTAS (AppRoutingModule)
 * ------------------------------------------------------------------
 * Define qué componente se carga según la URL.
 * Se han estandarizado los nombres a español para coincidir con los templates.
 */
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'subir', component: UploadComponent },
  { path: 'buscar/:termino', component: SearchComponent },
  { path: 'categoria/:nombre', component: CategoryComponent },
  // Comodín: Cualquier ruta no definida redirige al inicio
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
