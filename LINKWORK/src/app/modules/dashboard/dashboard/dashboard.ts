import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { AvaliacaoService } from '../../../core/avaliacao.service';
import { PagamentoService } from '../../../core/pagamento.service';
import { ProjetoService } from '../../../core/projeto.service';
import { PropostaService } from '../../../core/proposta.service';

export interface Indicador {
  rotulo: string;
  valor: number | string;
  tipo: 'numero' | 'moeda';
  icone: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  nome = '';
  ehEmpresa = false;
  indicadores: Indicador[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private projetos: ProjetoService,
    private propostas: PropostaService,
    private pagamentos: PagamentoService,
    private avaliacoes: AvaliacaoService,
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.usuario;
    if (!usuario) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.nome = usuario.nome;
    this.ehEmpresa = usuario.perfil === 'EMPRESA';
    this.indicadores = this.ehEmpresa ? this.indicadoresEmpresa(usuario.id) : this.indicadoresFreelancer(usuario.id);
  }

  private indicadoresEmpresa(id: number): Indicador[] {
    const meus = this.projetos.listar().filter((p) => p.empresaId === id);
    const ids = meus.map((p) => p.id);

    let emCustodia = 0;
    for (const pag of this.pagamentos.listar()) {
      if (ids.includes(pag.projetoId) && pag.status === 'EM_CUSTODIA') {
        emCustodia += pag.valor;
      }
    }
    const pendentes = this.propostas.listar().filter((p) => ids.includes(p.projetoId) && p.status === 'PENDENTE');

    return [
      { rotulo: 'Projetos em andamento', valor: meus.filter((p) => p.status === 'EM_ANDAMENTO').length, tipo: 'numero', icone: 'work' },
      { rotulo: 'Valor em custódia', valor: emCustodia, tipo: 'moeda', icone: 'lock' },
      { rotulo: 'Propostas recebidas pendentes', valor: pendentes.length, tipo: 'numero', icone: 'mail' },
      { rotulo: 'Projetos concluídos', valor: meus.filter((p) => p.status === 'CONCLUIDO').length, tipo: 'numero', icone: 'check_circle' },
    ];
  }

  private indicadoresFreelancer(id: number): Indicador[] {
    const meus = this.projetos.listar().filter((p) => p.freelancerId === id);
    const ids = meus.map((p) => p.id);
    const pendentes = this.propostas.listar().filter((p) => p.freelancerId === id && p.status === 'PENDENTE');

    let recebido = 0;
    for (const pag of this.pagamentos.listar()) {
      if (ids.includes(pag.projetoId) && pag.status === 'LIBERADO') {
        recebido += pag.valor;
      }
    }
    const media = this.avaliacoes.media(id);

    return [
      { rotulo: 'Projetos em andamento', valor: meus.filter((p) => p.status === 'EM_ANDAMENTO').length, tipo: 'numero', icone: 'work' },
      { rotulo: 'Propostas pendentes', valor: pendentes.length, tipo: 'numero', icone: 'mail' },
      { rotulo: 'Valor recebido', valor: recebido, tipo: 'moeda', icone: 'payments' },
      { rotulo: 'Média das avaliações', valor: media === null ? '—' : media.toFixed(1), tipo: 'numero', icone: 'star' },
    ];
  }
}
