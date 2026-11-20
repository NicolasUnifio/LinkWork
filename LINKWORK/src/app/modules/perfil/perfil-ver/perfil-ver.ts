import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { AvaliacaoService } from '../../../core/avaliacao.service';
import { Avaliacao, Usuario } from '../../../core/models';
import { ProjetoService } from '../../../core/projeto.service';

@Component({
  selector: 'app-perfil-ver',
  standalone: false,
  styleUrl: './perfil-ver.scss',
  templateUrl: './perfil-ver.html',
})
export class PerfilVer implements OnInit {
  pessoa?: Usuario;
  habilidades: string[] = [];
  media: number | null = null;
  recebidas: Avaliacao[] = [];
  concluidos = 0;
  ehMeuPerfil = false;

  constructor(
    private auth: AuthService,
    private projetos: ProjetoService,
    private avaliacoes: AvaliacaoService,
    private rota: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.auth.usuario) {
      this.router.navigate(['/auth/login']);
      return;
    }
    // ao ir de um perfil para outro o componente é reaproveitado, então escutamos o id
    this.rota.paramMap.subscribe((parametros) => this.carregar(Number(parametros.get('id'))));
  }

  carregar(id: number): void {
    this.pessoa = this.auth.obterUsuario(id);
    if (!this.pessoa) {
      this.router.navigate(['/perfil']);
      return;
    }
    this.ehMeuPerfil = this.auth.usuario?.id === id;
    this.habilidades = (this.pessoa.habilidades ?? '')
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h !== '');
    this.media = this.avaliacoes.media(id);
    this.recebidas = this.avaliacoes.recebidas(id);
    this.concluidos = this.projetos
      .listar()
      .filter((p) => p.status === 'CONCLUIDO' && (p.empresaId === id || p.freelancerId === id)).length;
  }

  nomeDe(id: number): string {
    return this.auth.nomeDe(id);
  }

  estrelas(nota: number): string {
    return '★'.repeat(nota) + '☆'.repeat(5 - nota);
  }
}
