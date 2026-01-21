export interface Faixa {
  id: number;
  titulo: string;
  estilo: string;
  bpm: number;
  arquivo_url: string;
  aula_id?: number | null;
  duracao?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  nome?: string | null;
  avatar_url?: string | null;
  ativo?: boolean;
}

export interface HistoricoItem {
  id: number;
  usuario_email: string;
  faixa_id: number;
  bpm_tocado: number;
  created_at: string;
}
