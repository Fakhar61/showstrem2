import React from 'react';
import { usePricingConfig } from '@/hooks/usePricingConfig';
import { Crown, Check } from 'lucide-react';

const DebugTypography = () => {
  const { pricingConfig } = usePricingConfig();

  if (!pricingConfig) {
    return <div className="p-8">Loading pricing config...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Typography Debug</h1>
          <p className="text-muted-foreground">Test all pricing overlay text elements for overflow issues</p>
        </div>

        {/* Header Typography */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Header Typography</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Main Title (clamp(20px, 3vw, 28px))</label>
              <h3 className="font-semibold text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.25]" style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}>
                Unlock all access
              </h3>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Subtitle (clamp(14px, 1.8vw, 16px))</label>
              <p className="text-muted-foreground leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
                Full performances, behind the scenes, and unreleased moments. Choose your level of access.
              </p>
            </div>
          </div>
        </section>

        {/* Plan Typography */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Plan Typography</h2>
          {pricingConfig.plans.map((plan) => (
            <div key={plan.id} className="bg-surface p-6 rounded-lg space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Plan Name (clamp(16px, 2.4vw, 20px))</label>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.25]" style={{ fontSize: 'clamp(16px, 2.4vw, 20px)' }}>
                    {plan.name}
                  </h3>
                  {plan.id === 'inner-circle' && <Crown className="w-5 h-5 text-accent" />}
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Description (clamp(14px, 1.8vw, 16px))</label>
                <p className="text-muted-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
                  {plan.description}
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Price (clamp(28px, 6vw, 44px)) + /year (clamp(12px, 2vw, 16px))</label>
                <div className="font-bold text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.25]">
                  <span style={{ fontSize: 'clamp(28px, 6vw, 44px)' }}>£{plan.price}</span>
                  <span className="font-normal text-muted-foreground" style={{ fontSize: 'clamp(12px, 2vw, 16px)' }}>/year</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Features (clamp(14px, 1.8vw, 16px))</label>
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">CTA Button (clamp(14px, 1.8vw, 16px))</label>
                <button className="bg-accent text-accent-foreground rounded-md font-medium whitespace-nowrap min-w-0" style={{ 
                  height: '44px',
                  padding: '10px 16px',
                  fontSize: 'clamp(14px, 1.8vw, 16px)'
                }}>
                  {plan.ctaText}
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Feature Comparison Typography */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Feature Comparison Typography</h2>
          <div className="bg-surface/30 rounded-lg p-6 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Section Title (clamp(16px, 2.4vw, 20px))</label>
              <h4 className="font-medium text-foreground text-center overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.25]" style={{ fontSize: 'clamp(16px, 2.4vw, 20px)' }}>
                What's included
              </h4>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Feature Items (clamp(14px, 1.8vw, 16px))</label>
              <div className="space-y-2">
                {pricingConfig.featureComparison.slice(0, 3).map((comparison, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center">
                    <span className="text-foreground overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
                      {comparison.feature}
                    </span>
                    <div className="text-center">
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    </div>
                    <div className="text-center">
                      <Check className="w-4 h-4 text-accent mx-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Column Headers (clamp(12px, 1.6vw, 14px))</label>
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
          </div>
        </section>

        {/* Legal Typography */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Legal Typography</h2>
          <div>
            <label className="text-sm text-muted-foreground">Legal Disclaimer (clamp(12px, 1.6vw, 14px))</label>
            <p className="text-muted-foreground text-center overflow-wrap-anywhere word-break-normal hyphens-auto leading-[1.5]" style={{ fontSize: 'clamp(12px, 1.6vw, 14px)' }}>
              {pricingConfig.legal.disclaimer}
            </p>
          </div>
        </section>

        {/* Viewport Size Indicator */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Viewport Info</h2>
          <div className="bg-surface p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Current viewport width: <span className="font-mono" id="viewport-width">-</span>px
            </p>
            <p className="text-sm text-muted-foreground">
              Screen breakpoint: <span className="font-mono" id="breakpoint-info">-</span>
            </p>
          </div>
        </section>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          function updateViewportInfo() {
            const width = window.innerWidth;
            document.getElementById('viewport-width').textContent = width;
            
            let breakpoint = 'xl';
            if (width <= 360) breakpoint = 'xs';
            else if (width <= 640) breakpoint = 'sm';
            else if (width <= 768) breakpoint = 'md';
            else if (width <= 1024) breakpoint = 'lg';
            else if (width <= 1280) breakpoint = 'xl';
            else breakpoint = '2xl';
            
            document.getElementById('breakpoint-info').textContent = breakpoint;
          }
          
          updateViewportInfo();
          window.addEventListener('resize', updateViewportInfo);
        `
      }} />
    </div>
  );
};

export default DebugTypography;