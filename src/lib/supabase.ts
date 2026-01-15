import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Helper types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string | null
          email: string
          nome: string | null
          avatar_url: string | null
          ativo: boolean
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
