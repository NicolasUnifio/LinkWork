import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CompartilhadoModule } from '../compartilhado/compartilhado-module';
import { PerfilEditar } from './perfil-editar/perfil-editar';
import { PerfilLista } from './perfil-lista/perfil-lista';
import { PerfilRoutingModule } from './perfil-routing-module';
import { PerfilVer } from './perfil-ver/perfil-ver';

@NgModule({
  declarations: [PerfilLista, PerfilVer, PerfilEditar],
  imports: [
    CommonModule,
    FormsModule,
    PerfilRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    CompartilhadoModule,
  ],
})
export class PerfilModule {}
