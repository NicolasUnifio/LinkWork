import { ApplicationRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { gravar, ler, proximoId } from './armazenamento';
import { Perfil, Usuario } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario: Usuario | null = null;

  constructor(
    private router: Router,
    private app: ApplicationRef,
  ) {
   
    if (ler<Usuario>('usuarios').length === 0) {
      this.cadastrarSemEntrar('Studio Aurora', 'empresa@linkwork.com', '123456', 'EMPRESA', 'TI');
      this.cadastrarSemEntrar('Marina Costa', 'freelancer@linkwork.com', '123456', 'FREELANCER', 'Design');
    }
    this.trocarNomesAntigos();

    
    const id = Number(localStorage.getItem('linkwork:sessao'));
    const encontrado = ler<Usuario>('usuarios').find((u) => u.id === id);
    this.usuario = encontrado ? encontrado : null;
  }

  
  entrar(email: string, senha: string): string | null {
    const emailBusca = email.trim().toLowerCase();
    const usuarios = ler<Usuario>('usuarios');
    const encontrado = usuarios.find((u) => u.email === emailBusca && u.senha === senha);
    if (!encontrado) {
      return 'E-mail ou senha inválidos.';
    }
    this.iniciarSessao(encontrado);
    return null;
  }

  cadastrar(nome: string, email: string, senha: string, perfil: Perfil, area: string): string | null {
    const emailNovo = email.trim().toLowerCase();
    if (ler<Usuario>('usuarios').some((u) => u.email === emailNovo)) {
      return 'Este e-mail já está cadastrado.';
    }
    const novo = this.cadastrarSemEntrar(nome.trim(), emailNovo, senha, perfil, area);
    this.iniciarSessao(novo);
    return null;
  }

  redefinirSenha(email: string, novaSenha: string): string | null {
    const usuarios = ler<Usuario>('usuarios');
    const encontrado = usuarios.find((u) => u.email === email.trim().toLowerCase());
    if (!encontrado) {
      return 'Nenhum usuário encontrado com este e-mail.';
    }
    encontrado.senha = novaSenha;
    gravar('usuarios', usuarios);
    return null;
  }

  sair(): void {
    localStorage.removeItem('linkwork:sessao');
    this.usuario = null;
    this.atualizarTela();
    this.router.navigate(['/auth/login']);
  }

  listarUsuarios(): Usuario[] {
    return ler<Usuario>('usuarios');
  }

  obterUsuario(id: number): Usuario | undefined {
    return this.listarUsuarios().find((u) => u.id === id);
  }

  
  atualizarPerfil(dados: Usuario): void {
    const usuarios = this.listarUsuarios();
    const posicao = usuarios.findIndex((u) => u.id === dados.id);
    if (posicao < 0) {
      return;
    }
    usuarios[posicao] = dados;
    gravar('usuarios', usuarios);
    if (this.usuario && this.usuario.id === dados.id) {
      this.usuario = dados;
      this.atualizarTela();
    }
  }

  nomeDe(id?: number): string {
    const usuario = ler<Usuario>('usuarios').find((u) => u.id === id);
    return usuario ? usuario.nome : '—';
  }

  private cadastrarSemEntrar(nome: string, email: string, senha: string, perfil: Perfil, area: string): Usuario {
    const usuarios = ler<Usuario>('usuarios');
    const novo: Usuario = { id: proximoId(usuarios), nome, email, senha, perfil, area };
    usuarios.push(novo);
    gravar('usuarios', usuarios);
    return novo;
  }

  private iniciarSessao(usuario: Usuario): void {
    localStorage.setItem('linkwork:sessao', String(usuario.id));
    this.usuario = usuario;
    this.atualizarTela();
  }


  private atualizarTela(): void {
    this.app.tick();
  }

  
  private trocarNomesAntigos(): void {
    const usuarios = ler<Usuario>('usuarios');
    let mudou = false;
    for (const u of usuarios) {
      if (u.nome === 'Empresa Demo') {
        u.nome = 'Studio Aurora';
        mudou = true;
      } else if (u.nome === 'Freelancer Demo') {
        u.nome = 'Marina Costa';
        mudou = true;
      }
    }
    if (mudou) {
      gravar('usuarios', usuarios);
    }
  }
}
