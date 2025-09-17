import { useState, useEffect } from 'react';

interface Plan {
  id: string;
  name: string;
  price: number;
  popular: boolean;
  description: string;
  ctaText: string;
  features: string[];
}

interface FeatureComparison {
  feature: string;
  access: boolean;
  innerCircle: boolean;
}

interface PricingConfig {
  currency: string;
  billingPeriod: string;
  plans: Plan[];
  featureComparison: FeatureComparison[];
  legal: {
    disclaimer: string;
    merchClaimCode: string;
  };
}

export const usePricingConfig = () => {
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const response = await fetch('/data/pricing-config.json');
        if (!response.ok) {
          throw new Error('Failed to load pricing config');
        }
        const data = await response.json();
        setPricingConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading pricing config:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, []);

  return { pricingConfig, loading, error };
};