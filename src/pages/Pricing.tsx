import React, { useState, useEffect } from 'react';
import { ArrowLeft, Crown, Check, X, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePricingConfig } from '@/hooks/usePricingConfig';
import { MockCheckout } from '@/components/MockCheckout';
import { MerchClaimModal } from '@/components/MerchClaimModal';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { CryptoPaymentModal } from '@/components/CryptoPaymentModal';

const Pricing = () => {
  const navigate = useNavigate();
  const { pricingConfig } = usePricingConfig();
  const { activateSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showMerchClaim, setShowMerchClaim] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
  };

  const handleCheckoutSuccess = (planId: string, email: string) => {
    setSelectedPlan(null);
    
    // Activate subscription in localStorage
    activateSubscription(planId === 'inner-circle' ? 'Inner Circle' : 'Access', email);
    
    // Wait briefly to ensure state is fully updated before redirecting
    setTimeout(() => {
      if (planId === 'inner-circle') {
        setShowMerchClaim(true);
      } else {
        // For Access plan, redirect to library after state update
        navigate('/library');
      }
    }, 500); // Reduced delay but ensures state propagation
  };

  const handleBack = () => {
    setSelectedPlan(null);
  };

  if (!pricingConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pricing...</p>
        </div>
      </div>
    );
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
    <>
      {/* Background with parallax effect */}
      <div className="fixed inset-0 bg-black">
        {/* Background with parallax effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url('/images/studio-vault-new.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy-deep/50 to-navy-deep/75" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header with back link */}
        <header className="p-6 pt-24">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Homepage</span>
          </button>
        </header>

        {/* Hero Section */}
        <section className="text-center px-6 pb-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-white font-bold text-center leading-tight" style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: 'clamp(32px, 5vw, 56px)',
              letterSpacing: '0.02em'
            }}>
              Exclusive acoustic performances, behind the scenes, unreleased moments. Choose your access.
            </h1>
            
            <p className="text-white/90 font-medium italic text-center max-w-2xl mx-auto" style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              letterSpacing: '0.01em'
            }}>
              Not just a subscription. Your all-access pass.
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-20">
              {pricingConfig.plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative rounded-2xl p-8 transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-navy-deep to-electric-blue text-white shadow-2xl shadow-electric-blue/25 hover:shadow-electric-blue/40 transform hover:scale-105' 
                      : 'bg-black/60 backdrop-blur-sm border border-accent-blue/20 text-white hover:border-accent-blue/40 hover:bg-black/70'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-electric-blue to-accent-blue px-4 py-2 rounded-full text-white font-semibold text-sm flex items-center gap-1">
                      • Fan Favourite
                    </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="font-bold text-2xl">{plan.name}</h3>
                        {plan.id === 'inner-circle' && <Crown className="w-6 h-6 text-yellow-400" />}
                      </div>
                      <div className="text-4xl font-bold">
                        £{plan.price}
                        <span className="text-lg font-normal opacity-70">/year</span>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-electric-blue flex-shrink-0 mt-2" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handlePlanSelect(plan)}
                      className={`w-full font-medium py-4 transition-all duration-200 ${
                        plan.popular
                          ? 'bg-white text-navy-deep hover:bg-white/90'
                          : 'bg-electric-blue hover:bg-accent-blue text-white'
                      }`}
                      size="lg"
                    >
                      {plan.ctaText}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Options */}
            <div className="text-center mb-20">
              <h3 className="text-white text-xl font-semibold mb-6">Payment Options</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-2 text-white/80 bg-black/40 px-4 py-2 rounded-lg">
                  <span>💳</span>
                  <span>Card • Apple Pay • Google Pay</span>
                </div>
                <button
                  onClick={() => setShowCryptoModal(true)}
                  className="flex items-center gap-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 px-4 py-2 rounded-lg transition-colors"
                >
                  <Bitcoin className="w-4 h-4" />
                  <span>Pay with crypto (optional)</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-white text-3xl font-semibold text-center mb-4 tracking-wide">What's Included</h2>
            <p className="text-white/80 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
              A complete fan experience designed for those who want to get closer to the music.
            </p>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-accent-blue/20">
              <div className="grid gap-6">
                {pricingConfig.featureComparison.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                    <span className="text-white font-medium tracking-wide">{feature.feature}</span>
                    <div className="flex gap-12">
                      <div className="text-center w-20">
                        {feature.access ? (
                          <div className="w-3 h-3 rounded-full bg-electric-blue mx-auto" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-white/30 mx-auto" />
                        )}
                      </div>
                      <div className="text-center w-20">
                        {feature.innerCircle ? (
                          <div className="w-3 h-3 rounded-full bg-accent-blue mx-auto" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-white/30 mx-auto" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-12 mt-8 pt-6 border-t border-white/10">
                <div className="text-center w-20">
                  <div className="text-white font-medium tracking-wide">Access</div>
                  <div className="text-electric-blue text-sm mt-1">£14.99/yr</div>
                </div>
                <div className="text-center w-20">
                  <div className="text-white font-medium tracking-wide">Inner Circle</div>
                  <div className="text-accent-blue text-sm mt-1">£24.99/yr</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal */}
        <footer className="px-6 pb-12">
          <p className="text-white/60 text-center text-sm">
            {pricingConfig.legal.disclaimer}
          </p>
        </footer>
      </div>

      {/* Crypto Modal */}
      {showCryptoModal && (
        <CryptoPaymentModal onClose={() => setShowCryptoModal(false)} />
      )}

    </>
  );
};

export default Pricing;