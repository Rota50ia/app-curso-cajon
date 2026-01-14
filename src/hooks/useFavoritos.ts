import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export const useFavoritos = () => {
  const { user } = useAuth()
  const [favoritos, setFavoritos] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.email) {
      setFavoritos([])
      setLoading(false)
      return
    }

    const fetchFavoritos = async () => {
      try {
        const { data, error } = await supabase
          .from('favoritos')
          .select('faixa_id')
          .eq('usuario_email', user.email!)

        if (error) throw error

        setFavoritos(data?.map(f => f.faixa_id) || [])
      } catch (err) {
        console.error('Erro ao buscar favoritos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFavoritos()
  }, [user?.email])

  const toggleFavorite = async (faixaId: number) => {
    if (!user?.email) return

    const isFavorited = favoritos.includes(faixaId)

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('usuario_email', user.email)
          .eq('faixa_id', faixaId)

        if (error) throw error

        setFavoritos(prev => prev.filter(id => id !== faixaId))
      } else {
        const { error } = await supabase
          .from('favoritos')
          .insert({
            usuario_email: user.email!,
            faixa_id: faixaId
          })

        if (error) throw error

        setFavoritos(prev => [...prev, faixaId])
      }
    } catch (err) {
      console.error('Erro ao atualizar favorito:', err)
    }
  }

  return { favoritos, toggleFavorite, loading }
}
