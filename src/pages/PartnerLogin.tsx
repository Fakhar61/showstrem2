import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePartnerAuth } from '@/contexts/PartnerAuthContext';
import { useNavigate } from 'react-router-dom';
import { useBrandConfig } from '@/hooks/useBrandConfig';

const PartnerLogin = () => {
  const [email, setEmail] = useState('');
  const { login } = usePartnerAuth();
  const navigate = useNavigate();
  const { config: brandConfig } = useBrandConfig();

  const handleLogin = () => {
    if (email.trim()) {
      login(email);
      navigate('/partner/insights');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <head>
        <meta name="robots" content="noindex" />
      </head>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Partner Access
            </h1>
            <p className="text-muted-foreground">
              Sign in to access partner insights
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
                autoFocus
              />
            </div>
            
            <Button 
              onClick={handleLogin}
              className="w-full"
              disabled={!email.trim()}
            >
              Send magic link
            </Button>
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            © 2024 {brandConfig?.brand.name}. Confidential.
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerLogin;