import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

const CriarSenha = () => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    // Validações
    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      // 1. Verificar se email existe em profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, ativo, nome')
        .eq('email', email)
        .single()

      if (profileError || !profile) {
        setErro('Email não encontrado. Você já comprou o curso?')
        return
      }

      if (!profile.ativo) {
        setErro('Sua conta está inativa. Entre em contato com o suporte.')
        return
      }

      // 2. Criar Auth user (isso dispara o trigger que adiciona UUID)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
          emailRedirectTo: `${window.location.origin}/home`,
          data: {
            nome: profile.nome
          }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setErro('Este email já tem senha cadastrada. Use "Esqueci minha senha".')
        } else {
          setErro(authError.message)
        }
        return
      }

      // 3. Sucesso!
      setSucesso(true)
      
      // 4. Redirecionar para login após 2 segundos
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)

    } catch (err: any) {
      setErro(err.message || 'Erro ao criar senha')
    }
  }

  if (sucesso) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            ✅ Senha criada com sucesso!
          </h2>
          <p className="text-slate-400">
            Redirecionando para o login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-4">
            Criar Senha
          </h1>
          <p className="text-slate-400">
            Configure sua senha para acessar o app
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-glass p-8 rounded-[2.5rem]">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">
                Seu email (usado na compra)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">
                Criar senha
              </label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">
                Confirmar senha
              </label>
              <input
                type="password"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white"
                placeholder="Digite a senha novamente"
              />
            </div>

            {erro && (
              <p className="text-red-500 text-sm">{erro}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-slate-950 font-black rounded-xl"
            >
              Criar Senha e Acessar
            </button>
          </div>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Já tem senha? <a href="/login" className="text-neon-blue hover:underline">Fazer login</a>
        </p>
      </div>
    </div>
  )
}

export default CriarSenha
