-- Permitir acesso anônimo para verificar se email existe na tabela profiles (para página de criar senha)
CREATE POLICY "Permitir verificar email para criar senha"
ON public.profiles
FOR SELECT
TO anon
USING (true);