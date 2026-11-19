import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CompartilhadoModule } from '../compartilhado/compartilhado-module';
import { Cabecalho } from './cabecalho/cabecalho';
import { Principal } from './principal/principal';

@NgModule({
  declarations: [Cabecalho, Principal],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CompartilhadoModule,
  ],
  exports: [Principal],
})
export class CorpoModule {}
