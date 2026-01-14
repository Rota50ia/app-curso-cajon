import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Gauge } from "lucide-react";

interface BPMControlsProps {
  currentBPM: number;
  originalBPM: number;
  onBPMChange: (bpm: number) => void;
  minBPM?: number;
  maxBPM?: number;
}

const BPMControls = ({ 
  currentBPM, 
  originalBPM, 
  onBPMChange, 
  minBPM = 50, 
  maxBPM = 120 
}: BPMControlsProps) => {
  const playbackRate = currentBPM / originalBPM;
  
  const handleSliderChange = (value: number[]) => {
    onBPMChange(value[0]);
  };

  const incrementBPM = () => {
    if (currentBPM < maxBPM) {
      onBPMChange(Math.min(currentBPM + 5, maxBPM));
    }
  };

  const decrementBPM = () => {
    if (currentBPM > minBPM) {
      onBPMChange(Math.max(currentBPM - 5, minBPM));
    }
  };

  const resetBPM = () => {
    onBPMChange(originalBPM);
  };

  const getSpeedColor = () => {
    if (playbackRate < 0.8) return "text-neon-blue";
    if (playbackRate > 1.2) return "text-neon-orange";
    return "text-neon-purple";
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          <span className="font-display text-sm font-medium text-muted-foreground">
            Velocidade
          </span>
        </div>
        <button
          onClick={resetBPM}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Reset ({originalBPM} BPM)
        </button>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={decrementBPM}
          disabled={currentBPM <= minBPM}
          className="h-12 w-12 rounded-xl border-border/50 hover:border-primary hover:bg-primary/10"
        >
          <Minus className="h-5 w-5" />
        </Button>

        <div className="text-center">
          <div className={`font-display text-4xl font-bold ${getSpeedColor()} transition-colors`}>
            {currentBPM}
          </div>
          <div className="text-xs text-muted-foreground">BPM</div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={incrementBPM}
          disabled={currentBPM >= maxBPM}
          className="h-12 w-12 rounded-xl border-border/50 hover:border-primary hover:bg-primary/10"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-2">
        <Slider
          value={[currentBPM]}
          min={minBPM}
          max={maxBPM}
          step={1}
          onValueChange={handleSliderChange}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{minBPM}</span>
          <span className="text-primary">{Math.round(playbackRate * 100)}% velocidade</span>
          <span>{maxBPM}</span>
        </div>
      </div>
    </div>
  );
};

export default BPMControls;
