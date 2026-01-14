import { useState, useEffect } from "react";
import { mockFaixas } from "@/constants/mockData";
import { Faixa, HistoricoItem } from "@/types";
import Header from "@/components/Header";
import TrackCard from "@/components/TrackCard";
import { Badge } from "@/components/ui/badge";
import { Music, Clock, Heart, Zap } from "lucide-react";

const Home = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("cajon_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedHistorico = localStorage.getItem("cajon_historico");
    if (savedHistorico) {
      setHistorico(JSON.parse(savedHistorico));
    }
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(f => f !== id) 
        : [...prev, id];
      localStorage.setItem("cajon_favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const recentTracks = historico
    .slice(0, 3)
    .map(h => mockFaixas.find(f => f.id === h.faixaId))
    .filter(Boolean) as Faixa[];

  const stats = [
    { 
      icon: Music, 
      label: "Faixas", 
      value: mockFaixas.length,
      color: "text-neon-blue" 
    },
    { 
      icon: Heart, 
      label: "Favoritos", 
      value: favorites.length,
      color: "text-neon-pink" 
    },
    { 
      icon: Clock, 
      label: "Sessões", 
      value: historico.length,
      color: "text-neon-purple" 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-3 gap-3">
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

        {/* Recent tracks */}
        {recentTracks.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-neon-purple" />
              <h2 className="font-display text-lg font-semibold">Recentes</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {recentTracks.map((faixa) => (
                <div key={faixa.id} className="min-w-[200px]">
                  <TrackCard
                    faixa={faixa}
                    isFavorite={favorites.includes(faixa.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All tracks */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-neon-orange" />
              <h2 className="font-display text-lg font-semibold">Todas as Faixas</h2>
            </div>
            <Badge variant="secondary" className="bg-muted">
              {mockFaixas.length} faixas
            </Badge>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockFaixas.map((faixa) => (
              <TrackCard
                key={faixa.id}
                faixa={faixa}
                isFavorite={favorites.includes(faixa.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
