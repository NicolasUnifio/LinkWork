import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth.service';
import { AREAS } from '../../../core/constantes';
import { Usuario } from '../../../core/models';

@Component({
  selector: 'app-perfil-editar',
  standalone: false,
  styleUrl: './perfil-editar.scss',
  templateUrl: './perfil-editar.html',
})
export class PerfilEditar implements OnInit {
  areas = AREAS;
  atual?: Usuario;
  ehEmpresa = false;

  nome = '';
  titulo = '';
  localizacao = '';
  area = '';
  resumo = '';
  habilidades = '';
  site = '';
  foto = '';
  erroFoto = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private aviso: MatSnackBar,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (!this.auth.usuario) {
      this.router.navigate(['/auth/login']);
      return;
    }
    // lê de novo do armazenamento para não editar uma cópia antiga
    this.atual = this.auth.obterUsuario(this.auth.usuario.id);
    if (!this.atual) {
      return;
    }
    this.ehEmpresa = this.atual.perfil === 'EMPRESA';
    this.nome = this.atual.nome;
    this.titulo = this.atual.titulo ?? '';
    this.localizacao = this.atual.localizacao ?? '';
    this.area = this.atual.area;
    this.resumo = this.atual.resumo ?? '';
    this.habilidades = this.atual.habilidades ?? '';
    this.site = this.atual.site ?? '';
    this.foto = this.atual.foto ?? '';
  }

  /** Lê a imagem escolhida, recorta em quadrado e reduz para 256 px antes de guardar. */
  escolherFoto(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const arquivo = campo.files ? campo.files[0] : undefined;
    if (!arquivo) {
      return;
    }
    if (!arquivo.type.startsWith('image/')) {
      this.erroFoto = 'Escolha um arquivo de imagem (JPG, PNG ou WEBP).';
      return;
    }
    this.erroFoto = '';

    const leitor = new FileReader();
    leitor.onload = () => {
      const imagem = new Image();
      imagem.onload = () => {
        const lado = 256;
        const menor = Math.min(imagem.width, imagem.height);
        const canvas = document.createElement('canvas');
        canvas.width = lado;
        canvas.height = lado;
        const desenho = canvas.getContext('2d');
        if (desenho) {
          desenho.fillStyle = '#ffffff';
          desenho.fillRect(0, 0, lado, lado);
          desenho.drawImage(
            imagem,
            (imagem.width - menor) / 2,
            (imagem.height - menor) / 2,
            menor,
            menor,
            0,
            0,
            lado,
            lado,
          );
          this.foto = canvas.toDataURL('image/jpeg', 0.85);
        }
        this.cd.markForCheck(); // sem zone.js: avisa o Angular que a foto chegou
      };
      imagem.onerror = () => {
        this.erroFoto = 'Não foi possível abrir essa imagem.';
        this.cd.markForCheck();
      };
      imagem.src = leitor.result as string;
    };
    leitor.readAsDataURL(arquivo);
    campo.value = ''; // permite escolher o mesmo arquivo de novo
  }

  removerFoto(): void {
    this.foto = '';
    this.erroFoto = '';
  }

  salvar(): void {
    if (!this.atual) {
      return;
    }
    const atualizado: Usuario = {
      ...this.atual,
      nome: this.nome.trim(),
      titulo: this.titulo.trim(),
      localizacao: this.localizacao.trim(),
      area: this.area,
      resumo: this.resumo.trim(),
      habilidades: this.habilidades.trim(),
      site: this.site.trim(),
      foto: this.foto,
    };
    this.auth.atualizarPerfil(atualizado);
    this.aviso.open('Perfil atualizado.', 'OK', { duration: 3000 });
    this.router.navigate(['/perfil', atualizado.id]);
  }

  cancelar(): void {
    if (this.atual) {
      this.router.navigate(['/perfil', this.atual.id]);
    }
  }
}
