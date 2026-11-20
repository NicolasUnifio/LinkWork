import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilEditar } from './perfil-editar/perfil-editar';
import { PerfilLista } from './perfil-lista/perfil-lista';
import { PerfilVer } from './perfil-ver/perfil-ver';

const routes: Routes = [
  { path: '', component: PerfilLista },
  { path: 'editar', component: PerfilEditar },
  { path: ':id', component: PerfilVer },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilRoutingModule {}
