import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-principal',
  standalone: false,
  styleUrl: './principal.scss',
  templateUrl: './principal.html',
})
export class Principal {
  // Em janela estreita (celular) o menu vira uma gaveta sobre o conteúdo.
  movel = window.innerWidth <= 800;

  constructor(public auth: AuthService) {}

  @HostListener('window:resize')
  aoRedimensionar(): void {
    this.movel = window.innerWidth <= 800;
  }
}
