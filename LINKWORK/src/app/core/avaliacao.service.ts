import { Injectable } from '@angular/core';
import { gravar, ler, proximoId } from './armazenamento';
import { Avaliacao } from './models';

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  listar(): Avaliacao[] {
    return ler<Avaliacao>('avaliacoes');
  }

  porProjeto(projetoId: number): Avaliacao[] {
    return this.listar().filter((a) => a.projetoId === projetoId);
  }

  recebidas(avaliadoId: number): Avaliacao[] {
    return this.listar().filter((a) => a.avaliadoId === avaliadoId);
  }

  salvar(avaliacao: Avaliacao): void {
    const lista = this.listar();
    avaliacao.id = proximoId(lista);
    lista.push(avaliacao);
    gravar('avaliacoes', lista);
  }

  media(avaliadoId: number): number | null {
    const notas = this.listar().filter((a) => a.avaliadoId === avaliadoId);
    if (notas.length === 0) {
      return null;
    }
    let soma = 0;
    for (const a of notas) {
      soma += a.nota;
    }
    return soma / notas.length;
  }
}
