import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { AREAS } from '../../../core/constantes';
import { Perfil } from '../../../core/models';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  templateUrl: './cadastro.html',
})
export class Cadastro {
  areas = AREAS;

  nome = '';
  email = '';
  senha = '';
  perfil: Perfil = 'FREELANCER';
  area = '';
  mensagem = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  cadastrar(): void {
    const erro = this.auth.cadastrar(this.nome, this.email, this.senha, this.perfil, this.area);
    if (erro) {
      this.mensagem = erro;
      return;
    }
    this.router.navigate(['/dashboard']);
  }
}
