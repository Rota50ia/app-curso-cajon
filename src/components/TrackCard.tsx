import { Faixa } from "@/types";
import { useNavigate } from "react-router-dom";
import { Play, Heart, Music } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TrackCardProps {
  faixa: Faixa;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const estiloColors: Record<string, { bg: string; text: string; glow: string }> = {
  baiao: { 
    bg: "bg-neon-orange/20", 
    text: "text-neon-orange", 
    glow: "hover:shadow-[0_0_20px_hsl(25_100%_50%/0.3)]" 
  },
  baião: { 
    bg: "bg-neon-orange/20", 
    text: "text-neon-orange", 
    glow: "hover:shadow-[0_0_20px_hsl(25_100%_50%/0.3)]" 
  },
  ijexa: { 
    bg: "bg-neon-purple/20", 
    text: "text-neon-purple", 
    glow: "hover:shadow-[0_0_20px_hsl(270_91%_65%/0.3)]" 
  },
  ijexá: { 
    bg: "bg-neon-purple/20", 
    text: "text-neon-purple", 
    glow: "hover:shadow-[0_0_20px_hsl(270_91%_65%/0.3)]" 
  },
  xote: { 
    bg: "bg-neon-blue/20", 
    text: "text-neon-blue", 
    glow: "hover:shadow-[0_0_20px_hsl(187_100%_50%/0.3)]" 
  },
  forró: { 
    bg: "bg-neon-green/20", 
    text: "text-neon-green", 
    glow: "hover:shadow-[0_0_20px_hsl(142_70%_50%/0.3)]" 
  },
  samba: { 
    bg: "bg-neon-yellow/20", 
    text: "text-neon-yellow", 
    glow: "hover:shadow-[0_0_20px_hsl(48_100%_50%/0.3)]" 
  },
};

const TrackCard = ({ faixa, isFavorite, onToggleFavorite }: TrackCardProps) => {
  const navigate = useNavigate();
  const colors = estiloColors[faixa.estilo.toLowerCase()] || estiloColors.baiao;

  return (
    <Card 
      className={`group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 ${colors.glow}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}>
              <Music className={`h-6 w-6 ${colors.text}`} />
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-sm font-semibold leading-tight truncate">
                {faixa.titulo}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`${colors.bg} ${colors.text} border-0 text-xs font-medium capitalize`}
                >
                  {faixa.estilo}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {faixa.bpm} BPM
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(faixa.id);
            }}
            className={`h-9 w-9 shrink-0 rounded-full transition-all ${
              isFavorite 
                ? "bg-accent/20 text-accent hover:bg-accent/30" 
                : "text-muted-foreground hover:text-accent hover:bg-accent/10"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>

        <Button
          onClick={() => navigate(`/player/${faixa.id}`)}
          className="mt-4 w-full bg-gradient-to-r from-primary via-secondary to-accent font-display font-semibold transition-all hover:opacity-90 hover:shadow-[0_0_30px_hsl(187_100%_50%/0.4)]"
        >
          <Play className="mr-2 h-4 w-4" />
          Tocar
        </Button>
      </div>
    </Card>
  );
};

export default TrackCard;
