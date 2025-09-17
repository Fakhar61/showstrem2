import React, { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await login(email);
      toast({
        title: "Authentication successful",
        description: "Welcome to the Artist Admin dashboard",
      });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="w-full max-w-md bg-surface border-border shadow-xl">
        <CardHeader className="text-center pb-8 pt-12">
          <CardTitle className="text-3xl font-light tracking-wide mb-4">Artist Admin</CardTitle>
          <p className="text-muted-foreground text-sm font-light">Sign in to your dashboard</p>
        </CardHeader>
        
        <CardContent className="space-y-8 pb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-border h-12 text-base"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium" 
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Sending magic link...
                </>
              ) : (
                <>
                  Send magic link
                  <ArrowRight className="w-5 h-5 ml-3" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-xs text-muted-foreground font-light">
              Secure authentication • No passwords required
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}