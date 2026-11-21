import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { AREAS } from '../../../core/constantes';
import { ProjetoService } from '../../../core/projeto.service';

@Component({
  selector: 'app-projeto-form',
  standalone: false,
  templateUrl: './projeto-form.html',
})
export class ProjetoForm implements OnInit {
  areas = AREAS;
  hoje = new Date().toISOString().slice(0, 10);

  id = 0; // 0 = projeto novo
  titulo = '';
  descricao = '';
  area = '';
  orcamento: number | null = null;
  prazo = '';
  erro = '';

  constructor(
    private auth: AuthService,
    private projetos: ProjetoService,
    private rota: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.usuario;
    if (!usuario) {
      this.router.navigate(['/auth/login']);
      return;
    }
    // Só empresa publica projetos.
    if (usuario.perfil !== 'EMPRESA') {
      this.router.navigate(['/projetos']);
      return;
    }

    const parametro = this.rota.snapshot.paramMap.get('id');
    if (!parametro) {
      return;
    }
    const projeto = this.projetos.obter(Number(parametro));
    // Só o dono edita, e somente enquanto o projeto está aberto.
    if (!projeto || projeto.empresaId !== usuario.id || projeto.status !== 'ABERTO') {
      this.router.navigate(['/projetos']);
      return;
    }
    this.id = projeto.id;
    this.titulo = projeto.titulo;
    this.descricao = projeto.descricao;
    this.area = projeto.area;
    this.orcamento = projeto.orcamento;
    this.prazo = projeto.prazo;
  }

  get editando(): boolean {
    return this.id !== 0;
  }

  salvar(): void {
    const usuario = this.auth.usuario;
    if (!usuario || this.orcamento === null) {
      return;
    }
    if (!this.editando && this.prazo < this.hoje) {
      this.erro = 'O prazo não pode estar no passado.';
      return;
    }

    const existente = this.projetos.obter(this.id);
    const salvo = this.projetos.salvar({
      id: this.id,
      titulo: this.titulo.trim(),
      descricao: this.descricao.trim(),
      area: this.area,
      orcamento: this.orcamento,
      prazo: this.prazo,
      status: existente ? existente.status : 'ABERTO',
      empresaId: usuario.id,
    });
    this.router.navigate(['/projetos', salvo.id]);
  }

  cancelar(): void {
    this.router.navigate(['/projetos']);
  }
}
