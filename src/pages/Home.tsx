import { useNavigate } from "react-router-dom";
import { useFaixas } from "@/hooks/useFaixas";
import { useFavoritos } from "@/hooks/useFavoritos";
import Header from "@/components/Header";
import TrackCard from "@/components/TrackCard";
import { Badge } from "@/components/ui/badge";
import { Music, Clock, Heart, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { faixas, loading, error } = useFaixas();
  const { favoritos, toggleFavorite } = useFavoritos();

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando faixas...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-destructive">Erro ao carregar: {error}</p>
      </div>
    );
  }

  const stats = [
    { 
      icon: Music, 
      label: "Faixas", 
      value: faixas.length,
      color: "text-neon-blue" 
    },
    { 
      icon: Heart, 
      label: "Favoritos", 
      value: favoritos.length,
      color: "text-neon-pink" 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="mt-2 font-display text-2xl font-bold">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* All tracks */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-neon-orange" />
              <h2 className="font-display text-lg font-semibold">Todas as Faixas</h2>
            </div>
            <Badge variant="secondary" className="bg-muted">
              {faixas.length} faixas
            </Badge>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faixas.map((faixa) => (
              <TrackCard
                key={faixa.id}
                faixa={faixa}
                isFavorite={favoritos.includes(faixa.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {faixas.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma faixa disponível no momento.</p>
              <p className="text-sm text-muted-foreground mt-2">Verifique se há faixas cadastradas no banco.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
