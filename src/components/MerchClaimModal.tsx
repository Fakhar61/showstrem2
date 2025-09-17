import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLastViewedContent } from '@/hooks/useSubscription';

interface MerchClaimModalProps {
  claimCode: string;
  onClose: () => void;
}

export const MerchClaimModal: React.FC<MerchClaimModalProps> = ({
  claimCode,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const copyClaimCode = () => {
    navigator.clipboard.writeText(claimCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartWatching = () => {
    onClose();
    
    // Check for last viewed content
    const lastViewed = getLastViewedContent();
    if (lastViewed) {
      navigate(`/watch/${lastViewed.seriesId}/${lastViewed.episodeId}`);
    } else {
      navigate('/library');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-lg">
      <div className="bg-background rounded-xl shadow-xl max-w-sm w-full p-2xl text-center space-y-lg">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
          <Gift className="w-8 h-8 text-accent" />
        </div>

        <div className="space-y-md">
          <h3 className="text-title font-semibold text-foreground">
            Claim your merch
          </h3>
          <p className="text-body text-muted-foreground leading-relaxed">
            Welcome to Inner Circle! Use this code to claim your exclusive merchandise drop.
          </p>
        </div>

        <div className="bg-surface/50 rounded-lg p-lg space-y-sm">
          <p className="text-caption text-muted-foreground font-medium">Your claim code</p>
          <div className="flex items-center gap-md">
            <code className="flex-1 text-body font-mono bg-surface px-md py-sm rounded border border-border text-foreground">
              {claimCode}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyClaimCode}
              className="border-border hover:bg-surface text-foreground"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-md">
          <Button
            onClick={handleStartWatching}
            className="w-full bg-accent hover:bg-accent-hover text-accent-foreground py-md"
          >
            Start watching
          </Button>
          
          <p className="text-caption text-muted-foreground">
            Save this code.
          </p>
        </div>
      </div>
    </div>
  );
};