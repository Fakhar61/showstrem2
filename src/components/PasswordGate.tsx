import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordGateProps {
  children: React.ReactNode;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const DEMO_PASSWORD = 'show2025';

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('demo-authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('demo-authenticated', 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-lg">
      <div className="w-full max-w-md space-y-xl animate-fade-in">
        
        {/* Lock Icon */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-lg">
            <Lock className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-display font-semibold text-foreground mb-sm">
            Access Required
          </h1>
          <p className="text-body text-muted-foreground">
            Please enter the access code to continue.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-lg">
          <div className="space-y-sm">
            <label htmlFor="password" className="sr-only">
              Demo password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter demo password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12 h-12 text-body focus:ring-2 focus:ring-accent"
                aria-describedby={error ? 'password-error' : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {error && (
              <p id="password-error" className="text-caption text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-body font-medium bg-accent hover:bg-accent-hover text-accent-foreground"
            disabled={!password.trim()}
          >
            Access Demo
          </Button>
        </form>

        {/* Access Info */}
        <div className="text-center space-y-sm p-lg bg-surface/30 rounded-lg border border-border/50">
          <p className="text-caption font-medium text-foreground">Access Information</p>
          <p className="text-caption text-muted-foreground">
            Password: <code className="bg-surface px-1 py-0.5 rounded text-accent">show2025</code>
          </p>
        </div>
      </div>
    </div>
  );
};