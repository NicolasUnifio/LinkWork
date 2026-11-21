import { Injectable } from '@angular/core';
import { gravar, ler, proximoId } from './armazenamento';
import { Mensagem } from './models';

@Injectable({ providedIn: 'root' })
export class MensagemService {
  porProjeto(projetoId: number): Mensagem[] {
    return ler<Mensagem>('mensagens').filter((m) => m.projetoId === projetoId);
  }

  enviar(projetoId: number, autorId: number, texto: string): void {
    const lista = ler<Mensagem>('mensagens');
    lista.push({
      id: proximoId(lista),
      projetoId,
      autorId,
      texto,
      data: new Date().toISOString(),
    });
    gravar('mensagens', lista);
  }
}
