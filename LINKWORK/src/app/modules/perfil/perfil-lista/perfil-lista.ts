import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { AvaliacaoService } from '../../../core/avaliacao.service';
import { AREAS } from '../../../core/constantes';
import { Usuario } from '../../../core/models';

@Component({
  selector: 'app-perfil-lista',
  standalone: false,
  styleUrl: './perfil-lista.scss',
  templateUrl: './perfil-lista.html',
})
export class PerfilLista implements OnInit {
  areas = AREAS;
  pessoas: Usuario[] = [];

  busca = '';
  tipo = '';
  area = '';

  constructor(
    private auth: AuthService,
    private avaliacoes: AvaliacaoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.auth.usuario) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const meuId = this.auth.usuario.id;
    this.pessoas = this.auth.listarUsuarios().filter((u) => u.id !== meuId);
  }

  get filtradas(): Usuario[] {
    const texto = this.busca.trim().toLowerCase();
    return this.pessoas.filter(
      (u) =>
        (texto === '' ||
          u.nome.toLowerCase().includes(texto) ||
          (u.titulo ?? '').toLowerCase().includes(texto) ||
          (u.habilidades ?? '').toLowerCase().includes(texto)) &&
        (this.tipo === '' || u.perfil === this.tipo) &&
        (this.area === '' || u.area === this.area),
    );
  }

  habilidadesDe(u: Usuario): string[] {
    return (u.habilidades ?? '')
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h !== '')
      .slice(0, 4);
  }

  mediaDe(u: Usuario): string {
    const media = this.avaliacoes.media(u.id);
    return media === null ? 'Sem avaliações' : '★ ' + media.toFixed(1);
  }

  limpar(): void {
    this.busca = '';
    this.tipo = '';
    this.area = '';
  }
}
