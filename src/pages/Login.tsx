import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Music } from "lucide-react";
import cajonIcon from "@/assets/cajon-icon.png";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Bem-vindo ao Curso Rápido de Cajón!");
        navigate("/");
      } else {
        toast.error("Erro ao fazer login");
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-neon-blue/20 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-neon-purple/20 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-pink/10 blur-[100px]" />
      </div>

      {/* Floating music notes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <Music
            key={i}
            className="absolute animate-float text-primary/10"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${20 + i * 5}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center">
            <img src={cajonIcon} alt="Cajón" className="h-20 w-20 object-contain" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink opacity-30 blur-xl" />
          </div>
          <h1 className="font-display text-3xl font-bold gradient-neon-text">
            Curso Rápido de Cajón
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pratique ritmos brasileiros
          </p>
        </div>

        {/* Login form */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="font-display text-2xl">Entrar</CardTitle>
            <CardDescription>
              Use qualquer email e senha para testar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border/50 bg-background/50 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border/50 bg-background/50 focus-visible:ring-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink font-display font-semibold transition-all hover:opacity-90 hover:shadow-[0_0_30px_hsl(187_100%_50%/0.4)]"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          MVP de demonstração • Dados salvos localmente
        </p>
      </div>
    </div>
  );
};

export default Login;
