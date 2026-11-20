export type Perfil = 'FREELANCER' | 'EMPRESA';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
  area: string;
  // dados opcionais do perfil (editáveis pelo próprio usuário)
  titulo?: string;
  localizacao?: string;
  resumo?: string;
  habilidades?: string; // separadas por vírgula
  site?: string;
  foto?: string; // imagem em texto (data URL), já reduzida
}

export type StatusProjeto =
  | 'ABERTO'
  | 'AGUARDANDO_PAGAMENTO'
  | 'EM_ANDAMENTO'
  | 'ENTREGUE'
  | 'CONCLUIDO';

export interface Projeto {
  id: number;
  titulo: string;
  descricao: string;
  area: string;
  orcamento: number;
  prazo: string; // yyyy-MM-dd
  status: StatusProjeto;
  empresaId: number;
  freelancerId?: number;
  valorAcordado?: number;
}

export type StatusProposta = 'PENDENTE' | 'ACEITA' | 'RECUSADA';

export interface Proposta {
  id: number;
  projetoId: number;
  freelancerId: number;
  valor: number;
  prazoDias: number;
  mensagem: string;
  status: StatusProposta;
}

export type MetodoPagamento = 'PIX' | 'CARTAO' | 'BOLETO';
export type StatusPagamento = 'EM_CUSTODIA' | 'LIBERADO';

export interface Pagamento {
  id: number;
  projetoId: number;
  valor: number;
  metodo: MetodoPagamento;
  status: StatusPagamento;
  dataPagamento: string;
  dataLiberacao?: string;
}

export interface Avaliacao {
  id: number;
  projetoId: number;
  avaliadorId: number;
  avaliadoId: number;
  nota: number;
  comentario: string;
}

export interface Mensagem {
  id: number;
  projetoId: number;
  autorId: number;
  texto: string;
  data: string;
}

export interface Versao {
  id: number;
  projetoId: number;
  numero: number;
  resumo: string;
  notas: string;
  progresso: number;
  incremento: number;
  data: string;
  autorId: number;
}
