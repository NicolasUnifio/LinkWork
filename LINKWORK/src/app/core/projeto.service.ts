import { Injectable } from '@angular/core';
import { gravar, ler, proximoId } from './armazenamento';
import { Projeto, Proposta, StatusProjeto } from './models';

@Injectable({ providedIn: 'root' })
export class ProjetoService {
  listar(): Projeto[] {
    return ler<Projeto>('projetos');
  }

  obter(id: number): Projeto | undefined {
    return this.listar().find((p) => p.id === id);
  }

  /** id igual a 0 cadastra um projeto novo; qualquer outro id edita o existente. */
  salvar(projeto: Projeto): Projeto {
    const lista = this.listar();
    const posicao = lista.findIndex((p) => p.id === projeto.id);
    if (projeto.id === 0 || posicao < 0) {
      projeto.id = proximoId(lista);
      lista.push(projeto);
    } else {
      lista[posicao] = projeto;
    }
    gravar('projetos', lista);
    return projeto;
  }

  excluir(id: number): void {
    gravar('projetos', this.listar().filter((p) => p.id !== id));
    // as propostas do projeto também saem
    gravar('propostas', ler<Proposta>('propostas').filter((p) => p.projetoId !== id));
  }

  mudarStatus(projeto: Projeto, status: StatusProjeto): void {
    projeto.status = status;
    this.salvar(projeto);
  }
}
