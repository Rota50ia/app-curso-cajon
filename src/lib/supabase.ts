import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ctvdlamxicoxniyqcpfd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dmRsYW14aWNveG5peXFjcGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjQ0MDksImV4cCI6MjA1NjAwMDQwOX0.H00Y_vwQQBVmWrdIBdSb-IklfMfe7bzxdAESh7J0ouc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          nome: string | null
          avatar_url: string | null
          ativo: boolean
          activation_token: string | null
          token_expires_at: string | null
          created_at: string
          updated_at: string
        }
      }
      faixas: {
        Row: {
          id: number
          aula_id: number | null
          titulo: string
          estilo: string
          bpm: number
          arquivo_url: string
          duracao: number | null
          created_at: string
          updated_at: string
        }
      }
      favoritos: {
        Row: {
          id: number
          usuario_email: string
          faixa_id: number
          created_at: string
        }
      }
      historico: {
        Row: {
          id: number
          usuario_email: string
          faixa_id: number
          bpm_tocado: number
          created_at: string
        }
      }
    }
  }
}
