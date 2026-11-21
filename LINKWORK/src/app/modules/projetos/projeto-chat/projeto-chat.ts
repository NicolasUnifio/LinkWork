import { Component, HostListener, Input, OnChanges } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { Mensagem } from '../../../core/models';
import { MensagemService } from '../../../core/mensagem.service';

@Component({
  selector: 'app-projeto-chat',
  standalone: false,
  styleUrl: './projeto-chat.scss',
  templateUrl: './projeto-chat.html',
})
export class ProjetoChat implements OnChanges {
  @Input() projetoId = 0;

  mensagens: Mensagem[] = [];
  texto = '';

  constructor(
    private auth: AuthService,
    private mensagensSrv: MensagemService,
  ) {}

  ngOnChanges(): void {
    this.carregar();
  }

  // Se a outra pessoa escrever em outra aba do navegador, a conversa se atualiza.
  @HostListener('window:storage')
  aoMudarArmazenamento(): void {
    this.carregar();
  }

  get meuId(): number {
    return this.auth.usuario ? this.auth.usuario.id : 0;
  }

  nomeDe(id: number): string {
    return this.auth.nomeDe(id);
  }

  carregar(): void {
    this.mensagens = this.mensagensSrv.porProjeto(this.projetoId);
    setTimeout(() => {
      const lista = document.getElementById('lista-chat');
      if (lista) {
        lista.scrollTop = lista.scrollHeight;
      }
    });
  }

  enviar(): void {
    const texto = this.texto.trim();
    if (!this.auth.usuario || texto === '') {
      return;
    }
    this.mensagensSrv.enviar(this.projetoId, this.auth.usuario.id, texto);
    this.texto = '';
    this.carregar();
  }
}
