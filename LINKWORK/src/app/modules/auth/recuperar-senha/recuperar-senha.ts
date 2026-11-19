import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-recuperar-senha',
  standalone: false,
  templateUrl: './recuperar-senha.html',
})
export class RecuperarSenha {
  email = '';
  novaSenha = '';
  erro = '';
  sucesso = false;

  constructor(private auth: AuthService) {}

  redefinir(): void {
    const erro = this.auth.redefinirSenha(this.email, this.novaSenha);
    this.erro = erro ? erro : '';
    this.sucesso = !erro;
  }
}
