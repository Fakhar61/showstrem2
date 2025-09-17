import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';
import { useBrandConfig } from '@/hooks/useBrandConfig';

export const BrandToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { switchBrand, currentBrand } = useBrandConfig();

  const brands = [
    { id: 'default', name: 'YourStreamingSite', config: 'brand-config.json' },
    { id: 'alt', name: 'VaultStreams', config: 'brand-config-alt.json' }
  ];

  const handleBrandSwitch = (configFile: string) => {
    switchBrand(configFile);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-lg left-lg z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="bg-surface/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground"
        aria-label="Switch brand theme"
      >
        <Palette className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-surface border border-border rounded-lg shadow-xl overflow-hidden animate-scale-in">
          <div className="p-sm border-b border-border">
            <p className="text-caption font-medium text-foreground">Brand Theme</p>
          </div>
          <div className="p-1">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleBrandSwitch(brand.config)}
                className="w-full flex items-center justify-between px-sm py-xs text-left text-caption text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded transition-smooth"
                aria-pressed={currentBrand?.brand.name === brand.name}
              >
                <span>{brand.name}</span>
                {currentBrand?.brand.name === brand.name && (
                  <Check className="w-3 h-3 text-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};