import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-cabecalho',
  standalone: false,
  styleUrl: './cabecalho.scss',
  templateUrl: './cabecalho.html',
})
export class Cabecalho {
  @Input() logado = false;
  @Output() alternar = new EventEmitter<void>();

  constructor(public auth: AuthService) {}

  sair(): void {
    this.auth.sair();
  }
}
