import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Check, X } from 'lucide-react';
import { usePricingConfig } from '@/hooks/usePricingConfig';
import { MockCheckout } from './MockCheckout';
import { MerchClaimModal } from './MerchClaimModal';
import { useSubscription } from '@/hooks/useSubscription';

interface PremiumOverlayProps {
  onUnlock?: () => void;
  className?: string;
}

export const PremiumOverlay: React.FC<PremiumOverlayProps> = ({ 
  onUnlock, 
  className = "" 
}) => {
  const { pricingConfig } = usePricingConfig();
  const { activateSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showMerchClaim, setShowMerchClaim] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
  };

  const handleCheckoutSuccess = (planId: string, email: string) => {
    setSelectedPlan(null);
    setUserPlan(planId);
    
    // Activate subscription in localStorage
    activateSubscription(planId === 'inner-circle' ? 'Inner Circle' : 'Access', email);
    
    // Unlock premium content
    if (onUnlock) {
      onUnlock();
    }
    
    // Show merch claim for Inner Circle
    if (planId === 'inner-circle') {
      setShowMerchClaim(true);
    }
  };

  const handleBack = () => {
    setSelectedPlan(null);
  };

  if (!pricingConfig) {
    return null;
  }

  // Show checkout flow
  if (selectedPlan) {
    return (
      <MockCheckout
        selectedPlan={selectedPlan}
        onBack={handleBack}
        onSuccess={handleCheckoutSuccess}
      />
    );
  }

  // Show merch claim modal
  if (showMerchClaim) {
    return (
      <MerchClaimModal
        claimCode={pricingConfig.legal.merchClaimCode}
        onClose={() => setShowMerchClaim(false)}
      />
    );
  }

  return (
    <div className={`absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 max-w-full overflow-x-hidden ${className}`}>
      <div className="bg-background rounded-xl shadow-xl w-full max-w-[min(1120px,100%)] mx-auto p-6 space-y-8 max-sm:p-4">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-accent" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-semibold text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.25]" style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}>
              Unlock all access
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
              Full performances, behind the scenes, and unreleased moments. Choose your level of access.
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {pricingConfig.plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-surface max-w-[420px] mx-auto w-full border-2 transition-smooth overflow-wrap-anywhere word-break-normal max-sm:p-4 ${
                plan.popular 
                  ? 'border-accent shadow-lg' 
                  : 'border-border hover:border-accent/50'
              }`}
              style={{ 
                padding: '24px 24px 28px',
                borderRadius: '14px'
              }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-medium" style={{ fontSize: 'clamp(12px, 1.6vw, 14px)' }}>
                    Most Popular
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Plan header */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="font-semibold text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.25]" style={{ fontSize: 'clamp(16px, 2.4vw, 20px)' }}>
                      {plan.name}
                    </h3>
                    {plan.id === 'inner-circle' && <Crown className="w-5 h-5 text-accent flex-shrink-0" />}
                  </div>
                  <p className="text-muted-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center space-y-1">
                  <div className="font-bold text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.25]">
                    <span style={{ fontSize: 'clamp(28px, 6vw, 44px)' }}>£{plan.price}</span>
                    <span className="font-normal text-muted-foreground" style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>/year</span>
                  </div>
                  <p className="text-muted-foreground leading-[1.5]" style={{ fontSize: 'clamp(12px, 1.6vw, 14px)' }}>
                    {pricingConfig.billingPeriod}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full font-medium transition-smooth whitespace-nowrap min-w-0 ${
                    plan.popular
                      ? 'bg-accent hover:bg-accent-hover text-accent-foreground'
                      : 'bg-surface-hover hover:bg-accent text-foreground hover:text-accent-foreground border border-border'
                  }`}
                  style={{ 
                    height: '44px',
                    padding: '10px 16px',
                    fontSize: 'clamp(14px, 1.8vw, 16px)'
                  }}
                >
                  {plan.ctaText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature comparison */}
        <div className="bg-surface/30 rounded-lg p-6 space-y-4" style={{ marginTop: '32px' }}>
          <h4 className="font-medium text-foreground text-center overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.25]" style={{ fontSize: 'clamp(16px, 2.4vw, 20px)' }}>
            What's included
          </h4>
          <div className="grid gap-3">
            {pricingConfig.featureComparison.map((comparison, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-center">
                <span className="text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
                  {comparison.feature}
                </span>
                <div className="text-center">
                  {comparison.access ? (
                    <Check className="w-4 h-4 text-accent mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground mx-auto" />
                  )}
                </div>
                <div className="text-center">
                  {comparison.innerCircle ? (
                    <Check className="w-4 h-4 text-accent mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
            <div></div>
            <div className="text-center font-medium text-muted-foreground leading-[1.5]" style={{ fontSize: 'clamp(12px, 1.6vw, 14px)' }}>
              Access
            </div>
            <div className="text-center font-medium text-muted-foreground leading-[1.5]" style={{ fontSize: 'clamp(12px, 1.6vw, 14px)' }}>
              Inner Circle
            </div>
          </div>
        </div>

        {/* Perks Section */}
        <div className="bg-surface rounded-lg p-6 space-y-4 border border-border" style={{ marginTop: '32px' }}>
          <h4 className="font-semibold text-foreground text-center overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.25]" style={{ fontSize: 'clamp(18px, 2.8vw, 22px)' }}>
            Perks for subscribers
          </h4>
          <div className="grid gap-3 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
                Year 1 subscribers: free T-shirt drop
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
                Priority ticket pre-sale access
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
                Exclusive behind-the-scenes videos
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
                Acoustic sets & one-off shows
              </span>
            </div>
          </div>
        </div>

        {/* Legal */}
        <p className="text-muted-foreground text-center overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(12px, 1.6vw, 14px)' }}>
          {pricingConfig.legal.disclaimer}
        </p>
      </div>
    </div>
  );
};