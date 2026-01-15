import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  isActive: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkUserActive(session.user.email!)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await checkUserActive(session.user.email!)
      } else {
        setIsActive(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUserActive = async (email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('ativo')
      .eq('email', email)
      .single()
    
    if (!error && data) {
      setIsActive(data.ativo)
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ativo')
        .eq('email', email)
        .single()

      if (profileError) {
        throw new Error('Perfil não encontrado. Entre em contato com o suporte.')
      }

      if (!profile.ativo) {
        await supabase.auth.signOut()
        throw new Error('Sua conta está inativa. Entre em contato com o suporte.')
      }

      setUser(data.user)
      setIsActive(true)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsActive(false)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isActive }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
