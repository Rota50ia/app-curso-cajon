import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import cajonIcon from "@/assets/cajon-icon.png";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="relative flex h-10 w-10 items-center justify-center">
            <img src={cajonIcon} alt="Cajón" className="h-10 w-10 object-contain" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink opacity-30 blur-lg" />
          </div>
          <span className="font-display text-lg font-bold gradient-neon-text whitespace-nowrap">
            Curso Rápido de Cajón
          </span>
        </button>

        <nav className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className={`relative h-10 w-10 rounded-xl transition-all ${
              isActive("/") 
                ? "bg-primary/10 text-primary box-glow-blue" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Home className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/favorites")}
            className={`relative h-10 w-10 rounded-xl transition-all ${
              isActive("/favorites") 
                ? "bg-accent/10 text-accent box-glow-pink" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Heart className="h-5 w-5" />
          </Button>

          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
