import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Cadastro } from './cadastro/cadastro';
import { Login } from './login/login';
import { RecuperarSenha } from './recuperar-senha/recuperar-senha';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'recuperar-senha', component: RecuperarSenha },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
