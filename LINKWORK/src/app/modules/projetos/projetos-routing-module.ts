import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjetoDetalhe } from './projeto-detalhe/projeto-detalhe';
import { ProjetoForm } from './projeto-form/projeto-form';
import { ProjetoLista } from './projeto-lista/projeto-lista';

const routes: Routes = [
  { path: '', component: ProjetoLista },
  { path: 'novo', component: ProjetoForm },
  { path: ':id/editar', component: ProjetoForm },
  { path: ':id', component: ProjetoDetalhe },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjetosRoutingModule {}
