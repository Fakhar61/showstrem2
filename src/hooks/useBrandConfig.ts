import { useState, useEffect } from 'react';

export interface BrandConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
  };
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
  };
  hero: {
    title: string;
    highlightText: string;
    subtitle: string;
    backgroundImage: string;
    videoUrl: string;
    ctaText: string;
    secondaryCtaText: string;
  };
  navigation: {
    showLogo: boolean;
    items: Array<{
      label: string;
      path: string;
    }>;
  };
}

export const useBrandConfig = () => {
  const [config, setConfig] = useState<BrandConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentConfigFile, setCurrentConfigFile] = useState('brand-config.json');

  const loadBrandConfig = async (configFile: string = 'brand-config.json') => {
    try {
      setLoading(true);
      const response = await fetch(`/data/${configFile}`);
      if (!response.ok) {
        throw new Error('Failed to load brand configuration');
      }
      const data = await response.json();
      setConfig(data);
      setCurrentConfigFile(configFile);
      
      // Apply dynamic colors to CSS variables
      if (data.colors) {
        const root = document.documentElement;
        root.style.setProperty('--accent', data.colors.primary);
        root.style.setProperty('--accent-hover', data.colors.primaryHover);
        root.style.setProperty('--brand-secondary', data.colors.secondary);
        root.style.setProperty('--brand-accent', data.colors.accent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error loading brand config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrandConfig(currentConfigFile);
  }, []);

  const switchBrand = (configFile: string) => {
    loadBrandConfig(configFile);
  };

  return { 
    config, 
    loading, 
    error, 
    switchBrand,
    currentBrand: config 
  };
};