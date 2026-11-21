import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth.service';
import { AvaliacaoService } from '../../../core/avaliacao.service';
import { ROTULO_METODO, ROTULO_STATUS } from '../../../core/constantes';
import { Avaliacao, MetodoPagamento, Pagamento, Projeto, Proposta, Usuario } from '../../../core/models';
import { PagamentoService } from '../../../core/pagamento.service';
import { ProjetoService } from '../../../core/projeto.service';
import { PropostaService } from '../../../core/proposta.service';
import { VersaoService } from '../../../core/versao.service';

@Component({
  selector: 'app-projeto-detalhe',
  standalone: false,
  styleUrl: './projeto-detalhe.scss',
  templateUrl: './projeto-detalhe.html',
})
export class ProjetoDetalhe implements OnInit, OnDestroy {
  rotuloStatus = ROTULO_STATUS;
  rotuloMetodo = ROTULO_METODO;
  notas = [1, 2, 3, 4, 5];

  usuario!: Usuario;
  projeto?: Projeto;
  propostas: Proposta[] = [];
  minhaProposta?: Proposta;
  pagamento?: Pagamento;
  avaliacoesProjeto: Avaliacao[] = [];

  // formulário de proposta
  valor: number | null = null;
  prazoDias: number | null = null;
  mensagem = '';
  editandoProposta = false;

  // pagamento
  metodo: MetodoPagamento | '' = '';

  // avaliação
  nota: number | null = null;
  comentario = '';

  // Pix fictício
  codigoPix = '';
  qrCelulas: { x: number; y: number }[] = [];
  segundosPix = 0;
  private relogio: ReturnType<typeof setInterval> | undefined;

  constructor(
    private auth: AuthService,
    private projetos: ProjetoService,
    private propostasSrv: PropostaService,
    private pagamentos: PagamentoService,
    private avaliacoes: AvaliacaoService,
    private versoes: VersaoService,
    private cd: ChangeDetectorRef,
    private rota: ActivatedRoute,
    private router: Router,
    private aviso: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if (!this.auth.usuario) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.usuario = this.auth.usuario;
    this.carregar();
  }

  ngOnDestroy(): void {
    this.pararRelogio();
  }

  // ---------- quem é quem ----------
  get ehDono(): boolean {
    return !!this.projeto && this.projeto.empresaId === this.usuario.id;
  }

  get ehContratado(): boolean {
    return !!this.projeto && this.projeto.freelancerId === this.usuario.id;
  }

  get jaAvaliou(): boolean {
    return this.avaliacoesProjeto.some((a) => a.avaliadorId === this.usuario.id);
  }

  get podeAvaliar(): boolean {
    return this.projeto?.status === 'CONCLUIDO' && (this.ehDono || this.ehContratado) && !this.jaAvaliou;
  }

  nomeDe(id?: number): string {
    return this.auth.nomeDe(id);
  }

  // ---------- carregamento ----------
  carregar(): void {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    const projeto = this.projetos.obter(id);
    // Freelancer só enxerga projetos abertos ou os que está executando.
    let acessivel = false;
    if (projeto) {
      acessivel =
        projeto.empresaId === this.usuario.id ||
        projeto.freelancerId === this.usuario.id ||
        (this.usuario.perfil === 'FREELANCER' && projeto.status === 'ABERTO');
    }
    if (!projeto || !acessivel) {
      this.router.navigate(['/projetos']);
      return;
    }
    this.projeto = projeto;
    this.propostas = this.propostasSrv.porProjeto(projeto.id);
    this.minhaProposta = this.propostas.find((p) => p.freelancerId === this.usuario.id);
    this.pagamento = this.pagamentos.porProjeto(projeto.id);
    this.avaliacoesProjeto = this.avaliacoes.porProjeto(projeto.id);
  }

  // ---------- proposta (freelancer) ----------
  enviarProposta(): void {
    if (!this.projeto || this.valor === null || this.prazoDias === null) {
      return;
    }
    this.propostasSrv.salvar({
      id: this.minhaProposta ? this.minhaProposta.id : 0,
      projetoId: this.projeto.id,
      freelancerId: this.usuario.id,
      valor: this.valor,
      prazoDias: this.prazoDias,
      mensagem: this.mensagem.trim(),
      status: 'PENDENTE',
    });
    this.editandoProposta = false;
    this.limparFormularioProposta();
    this.carregar();
    this.notificar('Proposta enviada.');
  }

  editarProposta(): void {
    if (!this.minhaProposta) {
      return;
    }
    this.valor = this.minhaProposta.valor;
    this.prazoDias = this.minhaProposta.prazoDias;
    this.mensagem = this.minhaProposta.mensagem;
    this.editandoProposta = true;
  }

  cancelarEdicaoProposta(): void {
    this.editandoProposta = false;
    this.limparFormularioProposta();
  }

  excluirProposta(): void {
    if (!this.minhaProposta || !confirm('Excluir sua proposta?')) {
      return;
    }
    this.propostasSrv.excluir(this.minhaProposta.id);
    this.editandoProposta = false;
    this.limparFormularioProposta();
    this.carregar();
    this.notificar('Proposta excluída.');
  }

  // ---------- decisão da empresa ----------
  aceitar(proposta: Proposta): void {
    this.propostasSrv.aceitar(proposta);
    this.carregar();
    this.notificar('Proposta aceita. Falta pagar para o freelancer começar.');
  }

  recusar(proposta: Proposta): void {
    this.propostasSrv.recusar(proposta);
    this.carregar();
  }

  pagar(): void {
    if (!this.projeto || this.metodo === '') {
      return;
    }
    this.pagamentos.pagar(this.projeto, this.metodo);
    this.pararRelogio();
    this.metodo = '';
    this.carregar();
    this.notificar('Pagamento confirmado e mantido em custódia.');
  }

  // ---------- Pix fictício ----------
  aoEscolherMetodo(): void {
    if (this.metodo === 'PIX') {
      this.gerarQr();
    } else {
      this.pararRelogio();
    }
  }

  gerarQr(): void {
    const idProjeto = this.projeto ? this.projeto.id : 0;
    this.codigoPix =
      '00020126FICTICIO' + idProjeto + '5204000053039865802BR5910LINKWORK6009SAOPAULO' +
      Math.random().toString(36).slice(2, 8).toUpperCase();
    this.qrCelulas = this.desenharQr(this.codigoPix);
    this.segundosPix = 300; // 5 minutos

    this.pararRelogio();
    this.relogio = setInterval(() => {
      this.segundosPix--;
      if (this.segundosPix <= 0) {
        this.pararRelogio();
      }
      // o projeto não usa zone.js, então o contador precisa avisar o Angular
      this.cd.markForCheck();
    }, 1000);
  }

  get tempoRestante(): string {
    const minutos = Math.floor(this.segundosPix / 60);
    const segundos = this.segundosPix % 60;
    return String(minutos).padStart(2, '0') + ':' + String(segundos).padStart(2, '0');
  }

  copiarCodigo(): void {
    navigator.clipboard.writeText(this.codigoPix).then(
      () => this.notificar('Código copiado.'),
      () => this.notificar('Não foi possível copiar. Selecione o código e use Ctrl+C.'),
    );
  }

  private pararRelogio(): void {
    if (this.relogio !== undefined) {
      clearInterval(this.relogio);
      this.relogio = undefined;
    }
  }

  /** Desenha um QR de mentira (25x25) a partir do código. */
  private desenharQr(semente: string): { x: number; y: number }[] {
    let n = 0;
    for (const letra of semente) {
      n = (n * 31 + letra.charCodeAt(0)) % 4294967296;
    }
    const lado = 25;
    const cantos = [[0, 0], [0, 18], [18, 0]]; // os três quadrados de posição
    const celulas: { x: number; y: number }[] = [];

    for (let linha = 0; linha < lado; linha++) {
      for (let coluna = 0; coluna < lado; coluna++) {
        let ligada: boolean | null = null;
        for (const [linhaCanto, colunaCanto] of cantos) {
          const dl = linha - linhaCanto;
          const dc = coluna - colunaCanto;
          if (dl >= 0 && dl < 7 && dc >= 0 && dc < 7) {
            ligada = dl === 0 || dl === 6 || dc === 0 || dc === 6 || (dl >= 2 && dl <= 4 && dc >= 2 && dc <= 4);
          } else if (dl >= -1 && dl <= 7 && dc >= -1 && dc <= 7) {
            ligada = false;
          }
        }
        if (ligada === null) {
          n = (n * 1664525 + 1013904223) % 4294967296;
          ligada = n / 4294967296 > 0.5;
        }
        if (ligada) {
          celulas.push({ x: coluna, y: linha });
        }
      }
    }
    return celulas;
  }

  // ---------- execução ----------
  entregar(): void {
    if (!this.projeto) {
      return;
    }
    this.versoes.registrar(this.projeto.id, this.usuario.id, 'Entrega final', 'Entrega enviada para aprovação.', 100);
    this.projetos.mudarStatus(this.projeto, 'ENTREGUE');
    this.carregar();
    this.notificar('Entrega registrada. Aguardando aprovação da empresa.');
  }

  aprovar(): void {
    if (!this.projeto) {
      return;
    }
    this.pagamentos.liberar(this.projeto);
    this.carregar();
    this.notificar('Entrega aprovada e pagamento liberado.');
  }

  // ---------- avaliação ----------
  avaliar(): void {
    if (!this.projeto || this.nota === null) {
      return;
    }
    const avaliadoId = this.ehDono ? this.projeto.freelancerId : this.projeto.empresaId;
    if (avaliadoId === undefined) {
      return;
    }
    this.avaliacoes.salvar({
      id: 0,
      projetoId: this.projeto.id,
      avaliadorId: this.usuario.id,
      avaliadoId: avaliadoId,
      nota: this.nota,
      comentario: this.comentario.trim(),
    });
    this.nota = null;
    this.comentario = '';
    this.carregar();
    this.notificar('Avaliação registrada.');
  }

  // ---------- projeto ----------
  excluirProjeto(): void {
    if (!this.projeto || !confirm('Excluir este projeto e suas propostas?')) {
      return;
    }
    this.projetos.excluir(this.projeto.id);
    this.notificar('Projeto excluído.');
    this.router.navigate(['/projetos']);
  }

  voltar(): void {
    this.router.navigate(['/projetos']);
  }

  private limparFormularioProposta(): void {
    this.valor = null;
    this.prazoDias = null;
    this.mensagem = '';
  }

  private notificar(texto: string): void {
    this.aviso.open(texto, 'OK', { duration: 3500 });
  }
}
