import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'projetos', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: 'perfil',
    loadChildren: () => import('./modules/perfil/perfil-module').then((m) => m.PerfilModule),
  },
  {
    path: 'projetos',
    loadChildren: () => import('./modules/projetos/projetos-module').then((m) => m.ProjetosModule),
  },
  { path: '**', redirectTo: 'projetos' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
