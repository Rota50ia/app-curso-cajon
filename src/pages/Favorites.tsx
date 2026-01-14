import { useState, useEffect } from "react";
import { mockFaixas } from "@/constants/mockData";
import { Faixa } from "@/types";
import Header from "@/components/Header";
import TrackCard from "@/components/TrackCard";
import { Heart, Music } from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<Faixa[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("cajon_favorites");
    if (savedFavorites) {
      const ids = JSON.parse(savedFavorites);
      setFavorites(ids);
      const tracks = mockFaixas.filter(f => ids.includes(f.id));
      setFavoriteTracks(tracks);
    }
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(f => f !== id) 
        : [...prev, id];
      localStorage.setItem("cajon_favorites", JSON.stringify(newFavorites));
      
      const tracks = mockFaixas.filter(f => newFavorites.includes(f.id));
      setFavoriteTracks(tracks);
      
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
            <Heart className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Favoritos</h1>
            <p className="text-sm text-muted-foreground">
              {favoriteTracks.length} {favoriteTracks.length === 1 ? "faixa" : "faixas"}
            </p>
          </div>
        </div>

        {favoriteTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
              <Music className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold">
              Nenhum favorito ainda
            </h2>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Toque no coração nas faixas para adicioná-las aqui
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTracks.map((faixa) => (
              <TrackCard
                key={faixa.id}
                faixa={faixa}
                isFavorite={favorites.includes(faixa.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
