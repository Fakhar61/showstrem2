import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  active: boolean;
  tier: string;
  email?: string;
  purchasedAt?: string;
}

const STORAGE_KEY = 'ss_subscription';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(() => {
    // Initialize state from localStorage immediately
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing subscription data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const setSubscriptionData = (data: Subscription) => {
    console.log('Setting subscription data:', data);
    setSubscription(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const activateSubscription = (tier: string, email: string) => {
    const subscriptionData: Subscription = {
      active: true,
      tier,
      email,
      purchasedAt: new Date().toISOString()
    };
    
    console.log('Activating subscription:', subscriptionData);
    setSubscriptionData(subscriptionData);
    
    // Show welcome toast
    toast({
      title: "Welcome to Inner Circle! 🎵",
      description: "You now have access to all premium content.",
      duration: 5000,
    });
  };

  const clearSubscription = () => {
    console.log('Clearing subscription');
    setSubscription(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isActive = subscription?.active === true;
  const tier = subscription?.tier || null;

  console.log('useSubscription - Current state:', { subscription, isActive, tier });

  return {
    subscription,
    isActive,
    tier,
    loading,
    activateSubscription,
    clearSubscription,
    setSubscriptionData
  };
};

// Utility functions for managing last viewed content
export const setLastViewedContent = (seriesId: string, episodeId: string) => {
  localStorage.setItem('ss_lastViewed', JSON.stringify({ seriesId, episodeId }));
};

export const getLastViewedContent = (): { seriesId: string; episodeId: string } | null => {
  const stored = localStorage.getItem('ss_lastViewed');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing last viewed data:', error);
      localStorage.removeItem('ss_lastViewed');
    }
  }
  return null;
};