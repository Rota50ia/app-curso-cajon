import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Faixa {
  id: number
  aula_id: number | null
  titulo: string
  estilo: string
  bpm: number
  arquivo_url: string
  duracao: number | null
  created_at?: string
  updated_at?: string
}

export const useFaixas = () => {
  const [faixas, setFaixas] = useState<Faixa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFaixas = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('faixas')
          .select('*')
          .order('id', { ascending: true })
        
        if (fetchError) throw fetchError
        
        setFaixas(data || [])
      } catch (err: any) {
        console.error('Erro ao buscar faixas:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFaixas()
  }, [])

  return { faixas, loading, error }
}
