import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFaixas } from "@/hooks/useFaixas";
import { useHistorico } from "@/hooks/useHistorico";
import { useFavoritos } from "@/hooks/useFavoritos";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import BPMControls from "@/components/BPMControls";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Heart, 
  Repeat, 
  SkipBack, 
  Music,
  Volume2
} from "lucide-react";

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { faixas, loading: loadingFaixas, error } = useFaixas();
  const { addToHistory } = useHistorico();
  const { favoritos, toggleFavorite } = useFavoritos();
  
  const [currentBPM, setCurrentBPM] = useState(100);
  
  const {
    isPlaying,
    currentTime,
    duration,
    isLooping,
    toggle,
    seek,
    setPlaybackRate,
    toggleLoop,
    loadTrack
  } = useAudioPlayer();

  const faixa = faixas.find((f) => f.id === Number(id));

  useEffect(() => {
    if (faixa) {
      loadTrack(faixa.arquivo_url);
      setCurrentBPM(faixa.bpm);
    }
  }, [faixa?.id]);

  useEffect(() => {
    if (faixa && isPlaying) {
      const currentBpmValue = Math.round(faixa.bpm * (currentBPM / faixa.bpm));
      addToHistory(faixa.id, currentBpmValue);
    }
  }, [isPlaying, faixa?.id]);

  useEffect(() => {
    if (faixa) {
      const rate = currentBPM / faixa.bpm;
      setPlaybackRate(rate);
    }
  }, [currentBPM, faixa, setPlaybackRate]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const restart = () => {
    seek(0);
  };

  if (loadingFaixas) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando faixa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-destructive">Erro: {error}</p>
      </div>
    );
  }

  if (!faixa) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Faixa não encontrada</p>
      </div>
    );
  }

  const isFavorite = favoritos.includes(faixa.id);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-neon-blue/20 blur-[100px]" />
        <div className="absolute -right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-neon-purple/20 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <span className="font-display text-sm font-medium">Player</span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(faixa.id)}
            className={`rounded-xl ${isFavorite ? "text-accent" : "text-muted-foreground"}`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </header>

      <main className="container relative z-10 px-4 py-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink animate-pulse-glow">
            <Music className="h-16 w-16 text-background" />
          </div>
          
          <div>
            <h1 className="font-display text-xl font-bold leading-tight">
              {faixa.titulo}
            </h1>
            <Badge 
              variant="secondary" 
              className="mt-2 bg-muted capitalize"
            >
              {faixa.estilo}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              BPM Original: {faixa.bpm}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={restart}
            className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground"
          >
            <SkipBack className="h-6 w-6" />
          </Button>

          <Button
            onClick={toggle}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink transition-all hover:opacity-90 hover:shadow-[0_0_40px_hsl(187_100%_50%/0.5)]"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-background" />
            ) : (
              <Play className="h-8 w-8 text-background ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLoop}
            className={`h-12 w-12 rounded-full transition-all ${
              isLooping 
                ? "bg-primary/20 text-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Repeat className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex justify-center">
          <Badge 
            variant={isLooping ? "default" : "secondary"}
            className={isLooping ? "bg-primary/20 text-primary border-primary/50" : ""}
          >
            <Repeat className="mr-1 h-3 w-3" />
            Loop {isLooping ? "ON" : "OFF"}
          </Badge>
        </div>

        <BPMControls
          currentBPM={currentBPM}
          originalBPM={faixa.bpm}
          onBPMChange={setCurrentBPM}
          minBPM={50}
          maxBPM={120}
        />

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Volume2 className="h-4 w-4" />
          <span>Streaming de alta qualidade</span>
        </div>
      </main>
    </div>
  );
};

export default Player;
