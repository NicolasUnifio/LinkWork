import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: false,
  styleUrl: './logo.scss',
  templateUrl: './logo.html',
})
export class Logo {
  @Input() tamanho = 30;
  @Input() mostrarNome = true;
}
