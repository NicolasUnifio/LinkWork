import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: false,
  styleUrl: './avatar.scss',
  templateUrl: './avatar.html',
})
export class Avatar {
  @Input() nome = '';
  @Input() foto: string | undefined = '';
  @Input() tamanho = 40;

  get inicial(): string {
    return this.nome ? this.nome.charAt(0).toUpperCase() : '?';
  }
}
