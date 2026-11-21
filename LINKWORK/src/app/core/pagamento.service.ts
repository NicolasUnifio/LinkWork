import { Injectable } from '@angular/core';
import { gravar, ler, proximoId } from './armazenamento';
import { MetodoPagamento, Pagamento, Projeto } from './models';
import { ProjetoService } from './projeto.service';

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  constructor(private projetos: ProjetoService) {}

  listar(): Pagamento[] {
    return ler<Pagamento>('pagamentos');
  }

  porProjeto(projetoId: number): Pagamento | undefined {
    return this.listar().find((p) => p.projetoId === projetoId);
  }

  /** Registra o pagamento em custódia e inicia o projeto. */
  pagar(projeto: Projeto, metodo: MetodoPagamento): void {
    const lista = this.listar();
    lista.push({
      id: proximoId(lista),
      projetoId: projeto.id,
      valor: projeto.valorAcordado ?? projeto.orcamento,
      metodo,
      status: 'EM_CUSTODIA',
      dataPagamento: new Date().toISOString(),
    });
    gravar('pagamentos', lista);
    this.projetos.mudarStatus(projeto, 'EM_ANDAMENTO');
  }

  /** Libera o valor ao freelancer e conclui o projeto. */
  liberar(projeto: Projeto): void {
    const lista = this.listar();
    for (const p of lista) {
      if (p.projetoId === projeto.id) {
        p.status = 'LIBERADO';
        p.dataLiberacao = new Date().toISOString();
      }
    }
    gravar('pagamentos', lista);
    this.projetos.mudarStatus(projeto, 'CONCLUIDO');
  }
}
