
export function ler<T>(chave: string): T[] {
  const texto = localStorage.getItem('linkwork:' + chave);
  return texto ? JSON.parse(texto) : [];
}

export function gravar<T>(chave: string, lista: T[]): void {
  localStorage.setItem('linkwork:' + chave, JSON.stringify(lista));
}

export function proximoId(lista: { id: number }[]): number {
  let maior = 0;
  for (const item of lista) {
    if (item.id > maior) {
      maior = item.id;
    }
  }
  return maior + 1;
}
