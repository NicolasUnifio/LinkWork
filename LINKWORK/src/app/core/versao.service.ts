import { Injectable } from '@angular/core';
import { gravar, ler, proximoId } from './armazenamento';
import { Versao } from './models';

@Injectable({ providedIn: 'root' })
export class VersaoService {
  porProjeto(projetoId: number): Versao[] {
    return ler<Versao>('versoes').filter((v) => v.projetoId === projetoId);
  }

  /** Progresso da última versão registrada (0 quando ainda não há versões). */
  progresso(projetoId: number): number {
    const lista = this.porProjeto(projetoId);
    return lista.length === 0 ? 0 : lista[lista.length - 1].progresso;
  }

  registrar(projetoId: number, autorId: number, resumo: string, notas: string, progresso: number): void {
    const todas = ler<Versao>('versoes');
    const anteriores = todas.filter((v) => v.projetoId === projetoId);
    const anterior = anteriores.length === 0 ? 0 : anteriores[anteriores.length - 1].progresso;
    todas.push({
      id: proximoId(todas),
      projetoId,
      numero: anteriores.length + 1,
      resumo,
      notas,
      progresso,
      incremento: progresso - anterior,
      data: new Date().toISOString(),
      autorId,
    });
    gravar('versoes', todas);
  }
}
