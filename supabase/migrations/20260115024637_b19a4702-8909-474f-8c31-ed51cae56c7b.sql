-- 1. Tabela profiles (Usuários)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  avatar_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
ON public.profiles FOR SELECT
USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
ON public.profiles FOR UPDATE
USING (auth.jwt() ->> 'email' = email);

-- 2. Tabela faixas (Músicas/Aulas)
CREATE TABLE public.faixas (
  id SERIAL PRIMARY KEY,
  aula_id INTEGER,
  titulo TEXT NOT NULL,
  estilo TEXT NOT NULL,
  bpm INTEGER NOT NULL,
  arquivo_url TEXT NOT NULL,
  duracao INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS para faixas (leitura pública para usuários autenticados)
ALTER TABLE public.faixas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faixas são visíveis para usuários autenticados"
ON public.faixas FOR SELECT
TO authenticated
USING (true);

-- 3. Tabela favoritos (Relação Usuário + Faixa)
CREATE TABLE public.favoritos (
  id SERIAL PRIMARY KEY,
  usuario_email TEXT NOT NULL,
  faixa_id INTEGER NOT NULL REFERENCES public.faixas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(usuario_email, faixa_id)
);

-- RLS para favoritos
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios favoritos"
ON public.favoritos FOR SELECT
USING (auth.jwt() ->> 'email' = usuario_email);

CREATE POLICY "Usuários podem adicionar favoritos"
ON public.favoritos FOR INSERT
WITH CHECK (auth.jwt() ->> 'email' = usuario_email);

CREATE POLICY "Usuários podem remover seus favoritos"
ON public.favoritos FOR DELETE
USING (auth.jwt() ->> 'email' = usuario_email);

-- 4. Tabela historico (Registro de Reproduções)
CREATE TABLE public.historico (
  id SERIAL PRIMARY KEY,
  usuario_email TEXT NOT NULL,
  faixa_id INTEGER NOT NULL REFERENCES public.faixas(id) ON DELETE CASCADE,
  bpm_tocado INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS para historico
ALTER TABLE public.historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio histórico"
ON public.historico FOR SELECT
USING (auth.jwt() ->> 'email' = usuario_email);

CREATE POLICY "Usuários podem adicionar ao histórico"
ON public.historico FOR INSERT
WITH CHECK (auth.jwt() ->> 'email' = usuario_email);

-- 5. Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faixas_updated_at
BEFORE UPDATE ON public.faixas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Storage bucket para áudios
INSERT INTO storage.buckets (id, name, public)
VALUES ('curso-rapido-cajon-faixas-audio', 'curso-rapido-cajon-faixas-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Política de leitura pública para o bucket
CREATE POLICY "Áudios são públicos para leitura"
ON storage.objects FOR SELECT
USING (bucket_id = 'curso-rapido-cajon-faixas-audio');

-- 7. Dados iniciais de faixas para teste
INSERT INTO public.faixas (titulo, estilo, bpm, arquivo_url) VALUES
('Rumba Básica', 'Flamenco', 120, 'https://kcqehtfbcrwrdgojoejc.supabase.co/storage/v1/object/public/curso-rapido-cajon-faixas-audio/rumba-basica.mp3'),
('Tango Groove', 'Tango', 130, 'https://kcqehtfbcrwrdgojoejc.supabase.co/storage/v1/object/public/curso-rapido-cajon-faixas-audio/tango-groove.mp3'),
('Bossa Nova Beat', 'Bossa Nova', 110, 'https://kcqehtfbcrwrdgojoejc.supabase.co/storage/v1/object/public/curso-rapido-cajon-faixas-audio/bossa-nova-beat.mp3');