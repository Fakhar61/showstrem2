import { useState, useEffect, useMemo } from 'react';

interface Assumptions {
  subscribers: {
    year1: number;
    year2GrowthRate: number;
    accessTierPercentage: number;
    innerCircleTierPercentage: number;
  };
  pricing: {
    accessPriceGBP: number;
    innerCirclePriceGBP: number;
  };
  costs: {
    year1: {
      streaming: number;
      hosting: number;
      paymentProcessing: number;
      maintenance: number;
      licensing: number;
    };
    year2: {
      streaming: number;
      hosting: number;
      paymentProcessing: number;
      maintenance: number;
      licensing: number;
    };
  };
}

interface CostBreakdown {
  streaming: number;
  hosting: number;
  paymentProcessing: number;
  maintenance: number;
  licensing: number;
  total: number;
}

interface RevenueMetrics {
  year1: {
    subscribers: number;
    accessSubscribers: number;
    innerCircleSubscribers: number;
    grossRevenue: number;
    artistShare: number;
    artistCosts: number;
    artistTakeHome: number;
    costBreakdown: CostBreakdown;
  };
  year2: {
    subscribers: number;
    accessSubscribers: number;
    innerCircleSubscribers: number;
    grossRevenue: number;
    artistShare: number;
    artistCosts: number;
    artistTakeHome: number;
    costBreakdown: CostBreakdown;
  };
  runningTotal: number;
}

interface WhatIfInputs {
  accessPrice: number;
  innerCirclePrice: number;
  streaming: number;
  hosting: number;
  paymentProcessing: number;
  maintenance: number;
  licensing: number;
}

export const useRevenueCalculations = () => {
  const [assumptions, setAssumptions] = useState<Assumptions | null>(null);
  const [whatIfInputs, setWhatIfInputs] = useState<WhatIfInputs>({
    accessPrice: 14.99,
    innerCirclePrice: 24.99,
    streaming: 5000,
    hosting: 6000,
    paymentProcessing: 75000,
    maintenance: 9450,
    licensing: 15000,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssumptions = async () => {
      try {
        const response = await fetch('/data/assumptions.json');
        const data = await response.json();
        setAssumptions(data);
        setWhatIfInputs({
          accessPrice: data.pricing.accessPriceGBP,
          innerCirclePrice: data.pricing.innerCirclePriceGBP,
          streaming: data.costs.year1.streaming,
          hosting: data.costs.year1.hosting,
          paymentProcessing: data.costs.year1.paymentProcessing,
          maintenance: data.costs.year1.maintenance,
          licensing: data.costs.year1.licensing,
        });
      } catch (error) {
        console.error('Error loading assumptions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssumptions();
  }, []);

  const calculateCostBreakdown = (year: 'year1' | 'year2'): CostBreakdown => {
    const streaming = year === 'year1' ? whatIfInputs.streaming : whatIfInputs.streaming * 1.05;
    const hosting = year === 'year1' ? whatIfInputs.hosting : whatIfInputs.hosting * 1.05;
    const paymentProcessing = year === 'year1' ? whatIfInputs.paymentProcessing : whatIfInputs.paymentProcessing * 1.05;
    const maintenance = year === 'year1' ? whatIfInputs.maintenance : whatIfInputs.maintenance * 1.05;
    const licensing = whatIfInputs.licensing; // Same for both years
    
    const total = streaming + hosting + paymentProcessing + maintenance + licensing;
    
    return {
      streaming,
      hosting,
      paymentProcessing,
      maintenance,
      licensing,
      total
    };
  };

  const metrics: RevenueMetrics | null = useMemo(() => {
    if (!assumptions) return null;

    // Year 1 Calculations
    const year1Subs = assumptions.subscribers.year1;
    const year1AccessSubs = Math.floor(year1Subs * assumptions.subscribers.accessTierPercentage);
    const year1InnerCircleSubs = Math.floor(year1Subs * assumptions.subscribers.innerCircleTierPercentage);
    
    const year1AccessRevenue = year1AccessSubs * whatIfInputs.accessPrice;
    const year1InnerCircleRevenue = year1InnerCircleSubs * whatIfInputs.innerCirclePrice;
    const year1GrossRevenue = year1AccessRevenue + year1InnerCircleRevenue;
    
    // Artist gets 70% of gross revenue
    const year1ArtistShare = year1GrossRevenue * 0.7;
    const year1CostBreakdown = calculateCostBreakdown('year1');
    const year1ArtistTakeHome = year1ArtistShare - year1CostBreakdown.total;

    // Year 2 Calculations (with growth)
    const year2Subs = Math.floor(year1Subs * (1 + assumptions.subscribers.year2GrowthRate));
    const year2AccessSubs = Math.floor(year2Subs * assumptions.subscribers.accessTierPercentage);
    const year2InnerCircleSubs = Math.floor(year2Subs * assumptions.subscribers.innerCircleTierPercentage);
    
    const year2AccessRevenue = year2AccessSubs * whatIfInputs.accessPrice;
    const year2InnerCircleRevenue = year2InnerCircleSubs * whatIfInputs.innerCirclePrice;
    const year2GrossRevenue = year2AccessRevenue + year2InnerCircleRevenue;
    
    const year2ArtistShare = year2GrossRevenue * 0.7;
    const year2CostBreakdown = calculateCostBreakdown('year2');
    const year2ArtistTakeHome = year2ArtistShare - year2CostBreakdown.total;

    // Running Total (Years 1-2)
    const runningTotal = year1ArtistTakeHome + year2ArtistTakeHome;

    return {
      year1: {
        subscribers: year1Subs,
        accessSubscribers: year1AccessSubs,
        innerCircleSubscribers: year1InnerCircleSubs,
        grossRevenue: year1GrossRevenue,
        artistShare: year1ArtistShare,
        artistCosts: year1CostBreakdown.total,
        artistTakeHome: year1ArtistTakeHome,
        costBreakdown: year1CostBreakdown,
      },
      year2: {
        subscribers: year2Subs,
        accessSubscribers: year2AccessSubs,
        innerCircleSubscribers: year2InnerCircleSubs,
        grossRevenue: year2GrossRevenue,
        artistShare: year2ArtistShare,
        artistCosts: year2CostBreakdown.total,
        artistTakeHome: year2ArtistTakeHome,
        costBreakdown: year2CostBreakdown,
      },
      runningTotal,
    };
  }, [assumptions, whatIfInputs]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-GB').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  return {
    assumptions,
    metrics,
    whatIfInputs,
    setWhatIfInputs,
    loading,
    formatCurrency,
    formatNumber,
    formatPercentage,
  };
};