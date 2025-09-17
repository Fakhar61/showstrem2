import { usePartnerAuth } from '@/contexts/PartnerAuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useBrandConfig } from '@/hooks/useBrandConfig';
import { LogOut } from 'lucide-react';
import PartnerLogin from './PartnerLogin';

const Partner = () => {
  const { isAuthenticated, logout } = usePartnerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { config: brandConfig } = useBrandConfig();

  if (!isAuthenticated) {
    return <PartnerLogin />;
  }

  const handleLogout = () => {
    logout();
    navigate('/partner');
  };

  const isInsights = location.pathname === '/partner/insights';
  const isStudio = location.pathname === '/partner/studio';

  return (
    <>
      <head>
        <meta name="robots" content="noindex" />
      </head>
      <div className="min-h-screen bg-background">
        
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">  
                <a 
                  href="/"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
                  aria-label="Home"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </a>
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-semibold text-foreground">
                    {brandConfig?.brand.name}
                  </h1>
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    Confidential
                  </div>
                </div>
                
                <Separator orientation="vertical" className="h-6" />
                
                {/* Navigation */}
                <nav className="flex gap-6">
                  <button
                    onClick={() => navigate('/partner/insights')}
                    className={`text-sm font-medium transition-colors hover:text-foreground ${
                      isInsights ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    Audience Insights
                  </button>
                  <button
                    onClick={() => navigate('/partner/studio')}
                    className={`text-sm font-medium transition-colors hover:text-foreground ${
                      isStudio ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    Recommendation Studio
                  </button>
                </nav>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="bg-surface/50 border-t border-border">
          <div className="container mx-auto px-6 py-4">
            <div className="text-center text-xs text-muted-foreground">
              Estimates only. Not actual financials.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Partner;