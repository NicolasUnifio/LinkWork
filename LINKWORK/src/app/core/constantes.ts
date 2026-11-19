import { MetodoPagamento, StatusProjeto } from './models';

export const AREAS = ['TI', 'Design', 'Marketing', 'Redação', 'Consultoria'];

export const ROTULO_STATUS: Record<StatusProjeto, string> = {
  ABERTO: 'Aberto',
  AGUARDANDO_PAGAMENTO: 'Aguardando pagamento',
  EM_ANDAMENTO: 'Em andamento',
  ENTREGUE: 'Entregue',
  CONCLUIDO: 'Concluído',
};

export const ROTULO_METODO: Record<MetodoPagamento, string> = {
  PIX: 'Pix',
  CARTAO: 'Cartão',
  BOLETO: 'Boleto',
};
