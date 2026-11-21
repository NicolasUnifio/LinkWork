import { Component, Input, OnChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth.service';
import { Versao } from '../../../core/models';
import { VersaoService } from '../../../core/versao.service';

@Component({
  selector: 'app-projeto-versoes',
  standalone: false,
  styleUrl: './projeto-versoes.scss',
  templateUrl: './projeto-versoes.html',
})
export class ProjetoVersoes implements OnChanges {
  @Input() projetoId = 0;
  @Input() status = '';
  @Input() podeRegistrar = false; // só o freelancer contratado registra versões

  versoes: Versao[] = [];
  progressoAtual = 0;

  resumo = '';
  notas = '';
  progresso = 0;
  erro = '';

  constructor(
    private auth: AuthService,
    private versoesSrv: VersaoService,
    private aviso: MatSnackBar,
  ) {}

  ngOnChanges(): void {
    this.carregar();
  }

  /** O formulário só aparece enquanto o projeto está em andamento. */
  get podeNovaVersao(): boolean {
    return this.podeRegistrar && this.status === 'EM_ANDAMENTO';
  }

  /** Versões da mais nova para a mais antiga. */
  get recentes(): Versao[] {
    return [...this.versoes].reverse();
  }

  nomeDe(id: number): string {
    return this.auth.nomeDe(id);
  }

  carregar(): void {
    this.versoes = this.versoesSrv.porProjeto(this.projetoId);
    this.progressoAtual = this.versoesSrv.progresso(this.projetoId);
    if (this.progresso < this.progressoAtual) {
      this.progresso = this.progressoAtual;
    }
  }

  registrar(): void {
    const resumo = this.resumo.trim();
    if (!this.auth.usuario) {
      return;
    }
    if (resumo.length < 3) {
      this.erro = 'Escreva um resumo da versão (mínimo 3 letras).';
      return;
    }
    this.versoesSrv.registrar(this.projetoId, this.auth.usuario.id, resumo, this.notas.trim(), this.progresso);
    this.resumo = '';
    this.notas = '';
    this.erro = '';
    this.carregar();
    this.aviso.open('Versão registrada.', 'OK', { duration: 3000 });
  }
}
