import { Injectable } from '@angular/core';
import { gravar, ler, proximoId } from './armazenamento';
import { Proposta } from './models';
import { ProjetoService } from './projeto.service';

@Injectable({ providedIn: 'root' })
export class PropostaService {
  constructor(private projetos: ProjetoService) {}

  listar(): Proposta[] {
    return ler<Proposta>('propostas');
  }

  porProjeto(projetoId: number): Proposta[] {
    return this.listar().filter((p) => p.projetoId === projetoId);
  }

  /** id igual a 0 cria uma proposta nova; qualquer outro id edita a existente. */
  salvar(proposta: Proposta): void {
    const lista = this.listar();
    const posicao = lista.findIndex((p) => p.id === proposta.id);
    if (proposta.id === 0 || posicao < 0) {
      proposta.id = proximoId(lista);
      lista.push(proposta);
    } else {
      lista[posicao] = proposta;
    }
    gravar('propostas', lista);
  }

  excluir(id: number): void {
    gravar('propostas', this.listar().filter((p) => p.id !== id));
  }

  /** Aceita a proposta, recusa as outras e deixa o projeto aguardando o pagamento. */
  aceitar(proposta: Proposta): void {
    const lista = this.listar();
    for (const p of lista) {
      if (p.projetoId === proposta.projetoId) {
        p.status = p.id === proposta.id ? 'ACEITA' : 'RECUSADA';
      }
    }
    gravar('propostas', lista);

    const projeto = this.projetos.obter(proposta.projetoId);
    if (projeto) {
      projeto.freelancerId = proposta.freelancerId;
      projeto.valorAcordado = proposta.valor;
      projeto.status = 'AGUARDANDO_PAGAMENTO';
      this.projetos.salvar(projeto);
    }
  }

  recusar(proposta: Proposta): void {
    proposta.status = 'RECUSADA';
    this.salvar(proposta);
  }
}
