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
import { ProjetoChat } from './projeto-chat/projeto-chat';
import { ProjetoDetalhe } from './projeto-detalhe/projeto-detalhe';
import { ProjetoForm } from './projeto-form/projeto-form';
import { ProjetoLista } from './projeto-lista/projeto-lista';
import { ProjetoVersoes } from './projeto-versoes/projeto-versoes';
import { ProjetosRoutingModule } from './projetos-routing-module';

@NgModule({
  declarations: [ProjetoLista, ProjetoForm, ProjetoDetalhe, ProjetoChat, ProjetoVersoes],
  imports: [
    CommonModule,
    FormsModule,
    ProjetosRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
})
export class ProjetosModule {}
