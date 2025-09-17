import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check, Crown, Gift } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  ctaText: string;
}

interface MockCheckoutProps {
  selectedPlan: Plan;
  onBack: () => void;
  onSuccess: (planId: string, email: string) => void;
}

export const MockCheckout: React.FC<MockCheckoutProps> = ({
  selectedPlan,
  onBack,
  onSuccess
}) => {
  const [step, setStep] = useState<'email' | 'confirm'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep('confirm');
    }
  };

  const handleConfirm = () => {
    setLoading(true);
    // Mock processing delay with proper state management
    setTimeout(() => {
      onSuccess(selectedPlan.id, email);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-lg">
      <div className="bg-background rounded-xl shadow-xl max-w-md w-full p-2xl space-y-xl">
        {/* Header */}
        <div className="flex items-center gap-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground p-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-title font-semibold text-foreground">
              {step === 'email' ? 'Join now' : 'Confirm your order'}
            </h2>
            <p className="text-caption text-muted-foreground">
              {selectedPlan.name} • £{selectedPlan.price}/year
            </p>
          </div>
        </div>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-lg">
            <div className="space-y-md">
              <label className="text-body font-medium text-foreground block">
                Email address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-surface border-border text-foreground"
                required
              />
            </div>

            <div className="space-y-md">
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-accent-foreground py-md text-body font-medium"
                disabled={!email}
              >
                Continue to confirmation
              </Button>
              
              <p className="text-caption text-muted-foreground text-center">
                By continuing, you agree to our terms and privacy policy
              </p>
            </div>
          </form>
        )}

        {step === 'confirm' && (
          <div className="space-y-lg">
            <div className="bg-surface/50 rounded-lg p-lg space-y-md">
              <div className="flex items-center justify-between">
                <span className="text-body font-medium text-foreground">{selectedPlan.name}</span>
                <span className="text-body font-semibold text-foreground">£{selectedPlan.price}</span>
              </div>
              <div className="flex items-center justify-between text-caption text-muted-foreground">
                <span>Billed annually</span>
                <span>Includes VAT</span>
              </div>
              <div className="pt-xs border-t border-border">
                <div className="flex items-center justify-between text-body font-semibold text-foreground">
                  <span>Total</span>
                  <span>£{selectedPlan.price}</span>
                </div>
              </div>
            </div>

            <div className="space-y-sm">
              <div className="text-caption text-muted-foreground">
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Payment:</strong> Demo mode (no charge)</p>
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-accent-foreground py-md text-body font-medium"
            >
              {loading ? (
                <div className="flex items-center gap-xs">
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Processing...
                </div>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Complete subscription
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};