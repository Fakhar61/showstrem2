import React from 'react';
import { X, Bitcoin, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CryptoPaymentModalProps {
  onClose: () => void;
}

export const CryptoPaymentModal: React.FC<CryptoPaymentModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-xl max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Crypto Payment</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Bitcoin className="w-6 h-6 text-orange-500" />
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            
            <h4 className="text-lg font-medium text-foreground">
              Blockchain Payments Available
            </h4>
            
            <p className="text-muted-foreground leading-relaxed">
              We support Bitcoin and Ethereum payments for your subscription. 
              Blockchain payments are processed manually and available upon request.
            </p>

            <div className="bg-surface rounded-lg p-4 space-y-2">
              <h5 className="font-medium text-foreground">How it works:</h5>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>1. Contact support with your preferred cryptocurrency</li>
                <li>2. Receive payment address and exact amount</li>
                <li>3. Complete payment within 24 hours</li>
                <li>4. Account activated after confirmation</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                window.open('mailto:support@example.com?subject=Crypto Payment Request', '_blank');
                onClose();
              }}
              className="w-full bg-premium-purple hover:bg-gradient-cyan text-white"
            >
              Contact Support for Crypto Payment
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Back to Standard Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};