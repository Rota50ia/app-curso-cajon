import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export interface HistoricoItem {
  id: number
  usuario_email: string
  faixa_id: number
  bpm_tocado: number
  created_at: string
}

export const useHistorico = () => {
  const { user } = useAuth()
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.email) {
      setHistorico([])
      setLoading(false)
      return
    }

    const fetchHistorico = async () => {
      try {
        const { data, error } = await supabase
          .from('historico')
          .select('*')
          .eq('usuario_email', user.email!)
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error

        setHistorico(data || [])
      } catch (err) {
        console.error('Erro ao buscar histórico:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistorico()
  }, [user?.email])

  const addToHistory = async (faixaId: number, bpmTocado: number) => {
    if (!user?.email) return

    try {
      const { error } = await supabase
        .from('historico')
        .insert({
          usuario_email: user.email!,
          faixa_id: faixaId,
          bpm_tocado: bpmTocado
        })

      if (error) throw error

      const { data } = await supabase
        .from('historico')
        .select('*')
        .eq('usuario_email', user.email!)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) setHistorico(data)
    } catch (err) {
      console.error('Erro ao adicionar ao histórico:', err)
    }
  }

  return { historico, addToHistory, loading }
}
