import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth.service';
import { AREAS, ROTULO_STATUS } from '../../../core/constantes';
import { Projeto } from '../../../core/models';
import { ProjetoService } from '../../../core/projeto.service';

@Component({
  selector: 'app-projeto-lista',
  standalone: false,
  styleUrl: './projeto-lista.scss',
  templateUrl: './projeto-lista.html',
})
export class ProjetoLista implements OnInit {
  areas = AREAS;
  rotulo: Record<string, string> = ROTULO_STATUS;
  statusOpcoes = Object.entries(ROTULO_STATUS);

  todos: Projeto[] = [];
  ehEmpresa = false;

  // filtros
  busca = '';
  area = '';
  status = '';

  // paginação feita à mão
  pagina = 0;
  porPagina = 5;

  constructor(
    private auth: AuthService,
    private router: Router,
    private projetos: ProjetoService,
    private aviso: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if (!this.auth.usuario) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.ehEmpresa = this.auth.usuario.perfil === 'EMPRESA';
    this.carregar();
  }

  /** Empresa vê os próprios projetos; freelancer vê os abertos e os que está executando. */
  carregar(): void {
    const usuario = this.auth.usuario;
    if (!usuario) {
      return;
    }
    this.todos = this.projetos.listar().filter((p) => {
      if (usuario.perfil === 'EMPRESA') {
        return p.empresaId === usuario.id;
      }
      return p.status === 'ABERTO' || p.freelancerId === usuario.id;
    });
  }

  get filtrados(): Projeto[] {
    const texto = this.busca.trim().toLowerCase();
    return this.todos.filter(
      (p) =>
        (texto === '' || p.titulo.toLowerCase().includes(texto) || p.descricao.toLowerCase().includes(texto)) &&
        (this.area === '' || p.area === this.area) &&
        (this.status === '' || p.status === this.status),
    );
  }

  get visiveis(): Projeto[] {
    const inicio = this.pagina * this.porPagina;
    return this.filtrados.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.filtrados.length / this.porPagina));
  }

  filtrar(): void {
    this.pagina = 0;
  }

  limparFiltros(): void {
    this.busca = '';
    this.area = '';
    this.status = '';
    this.pagina = 0;
  }

  anterior(): void {
    if (this.pagina > 0) {
      this.pagina--;
    }
  }

  proxima(): void {
    if (this.pagina < this.totalPaginas - 1) {
      this.pagina++;
    }
  }

  excluir(projeto: Projeto): void {
    if (!confirm('Excluir o projeto "' + projeto.titulo + '"? Esta ação não pode ser desfeita.')) {
      return;
    }
    this.projetos.excluir(projeto.id);
    this.carregar();
    if (this.pagina >= this.totalPaginas) {
      this.pagina = this.totalPaginas - 1;
    }
    this.aviso.open('Projeto excluído.', 'OK', { duration: 3000 });
  }
}
