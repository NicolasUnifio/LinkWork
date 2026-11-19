import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CompartilhadoModule } from '../compartilhado/compartilhado-module';
import { AuthRoutingModule } from './auth-routing-module';
import { Cadastro } from './cadastro/cadastro';
import { Login } from './login/login';
import { RecuperarSenha } from './recuperar-senha/recuperar-senha';

@NgModule({
  declarations: [Login, Cadastro, RecuperarSenha],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CompartilhadoModule,
  ],
})
export class AuthModule {}
