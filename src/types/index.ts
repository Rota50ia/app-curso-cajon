export interface Faixa {
  id: number;
  titulo: string;
  estilo: string;
  bpm: number;
  arquivo_url: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface HistoricoItem {
  faixaId: number;
  playedAt: string;
}
