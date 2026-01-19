-- Adicionar colunas para sistema de ativação na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS activation_token UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days');

-- Atualizar RLS para permitir verificação de token sem autenticação
DROP POLICY IF EXISTS "Permitir verificar email para criar senha" ON public.profiles;

CREATE POLICY "Permitir verificar token de ativação"
ON public.profiles
FOR SELECT
TO anon
USING (true);

-- Permitir atualização via service role (edge function usará service role)
CREATE POLICY "Service role pode atualizar profiles"
ON public.profiles
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);