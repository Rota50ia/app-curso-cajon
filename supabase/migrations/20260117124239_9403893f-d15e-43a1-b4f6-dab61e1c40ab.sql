-- Remover policy anônima de leitura total em profiles (substituída por verificação via função backend)
DROP POLICY IF EXISTS "Permitir verificar email para criar senha" ON public.profiles;