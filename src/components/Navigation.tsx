import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Play, Grid3X3, Home, House } from "lucide-react";
import { useBrandConfig } from "@/hooks/useBrandConfig";

const Navigation = () => {
  const location = useLocation();
  const { config } = useBrandConfig();

  const navItems = config?.navigation.items || [
    { label: "Home", path: "/" },
    { label: "Library", path: "/library" },
  ];

  const getIconForPath = (path: string) => {
    if (path === "/") return Home;
    if (path === "/library") return Grid3X3;
    return Home;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-lg py-md">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-xs transition-smooth hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded"
            aria-label={`${config?.brand.name || 'Home'} home page`}
          >
            <Play className="w-6 h-6 text-accent fill-accent" />
            <span className="text-title font-semibold text-foreground">
              {config?.brand.name || "YourStreamingSite"}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-xl">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-xs text-body transition-smooth hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded px-2 py-1 min-h-[44px] min-w-[44px]",
                isActive("/") ? "text-accent" : "text-muted-foreground"
              )}
              aria-label="Navigate to Home"
            >
              <House className="w-4 h-4" />
              Home
            </Link>
            {navItems.filter(item => item.path !== "/").map((item) => {
              const Icon = getIconForPath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-xs text-body transition-smooth hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded px-2 py-1 min-h-[44px] min-w-[44px]",
                    isActive(item.path) ? "text-accent" : "text-muted-foreground"
                  )}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-md">
            <Link
              to="/"
              className={cn(
                "p-sm rounded-md transition-smooth hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background min-h-[44px] min-w-[44px] flex items-center justify-center",
                isActive("/") ? "text-accent bg-surface" : "text-muted-foreground"
              )}
              aria-label="Navigate to Home"
            >
              <House className="w-5 h-5" />
            </Link>
            {navItems.filter(item => item.path !== "/").map((item) => {
              const Icon = getIconForPath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "p-sm rounded-md transition-smooth hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background min-h-[44px] min-w-[44px] flex items-center justify-center",
                    isActive(item.path) ? "text-accent bg-surface" : "text-muted-foreground"
                  )}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;