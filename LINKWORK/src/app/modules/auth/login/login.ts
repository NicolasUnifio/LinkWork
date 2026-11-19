import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
})
export class Login {
  email = '';
  senha = '';
  mensagem = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  entrar(): void {
    const erro = this.auth.entrar(this.email, this.senha);
    if (erro) {
      this.mensagem = erro;
      return;
    }
    this.router.navigate(['/dashboard']);
  }

  limpar(form: NgForm): void {
    form.resetForm({ email: '', senha: '' });
    this.mensagem = '';
  }
}
