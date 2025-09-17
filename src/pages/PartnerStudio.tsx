import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Download, FileText, Calendar } from 'lucide-react';

interface RecommendationScore {
  concept: string;
  contentType: string;
  duration: string;
  score: number;
  confidence: 'High' | 'Medium' | 'Low';
  rationale: string;
  estimatedImpact: string;
}

const PartnerStudio = () => {
  const [recommendationRules, setRecommendationRules] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [catalogData, setCatalogData] = useState<any>(null);
  const [objective, setObjective] = useState('growPremiumConversions');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [plan, setPlan] = useState<any[]>([]);

  useEffect(() => {
    // Load all data files
    Promise.all([
      fetch('/data/recommendation_rules.json').then(res => res.json()),
      fetch('/data/analytics.json').then(res => res.json()),
      fetch('/data/catalog.json').then(res => res.json())
    ]).then(([rules, analytics, catalog]) => {
      setRecommendationRules(rules);
      setAnalyticsData(analytics);
      setCatalogData(catalog);
    });
  }, []);

  useEffect(() => {
    if (recommendationRules && analyticsData && catalogData) {
      generateRecommendations();
    }
  }, [objective, contentTypeFilter, durationFilter, recommendationRules, analyticsData, catalogData]);

  const generateRecommendations = () => {
    if (!recommendationRules || !analyticsData || !catalogData) return;

    const objectiveWeights = recommendationRules.objectives[objective].weights;
    const contentTypes = Object.keys(analyticsData.contentTypeMetrics);
    const newRecommendations: RecommendationScore[] = [];

    contentTypes.forEach(contentType => {
      if (contentTypeFilter !== 'all' && contentType !== contentTypeFilter) return;

      const metrics = analyticsData.contentTypeMetrics[contentType];
      const typeMultiplier = recommendationRules.contentTypeMultipliers[contentType] || 1.0;

      // Generate recommendations for different duration bands
      Object.entries(recommendationRules.durationBandMultipliers).forEach(([bandKey, band]: [string, any]) => {
        if (durationFilter !== 'all' && bandKey !== durationFilter) return;

        // Calculate score based on objective weights
        const recentViewsScore = (metrics.views / 50000) * objectiveWeights.recentViews;
        const completionScore = (metrics.avgCompletionRate / 100) * objectiveWeights.completionRate;
        const recencyScore = 0.8 * objectiveWeights.recencyBoost; // Simulate recency
        const premiumScore = (contentType === 'Exclusives' ? 0.9 : 0.6) * objectiveWeights.premiumConversionLift;

        const baseScore = (recentViewsScore + completionScore + recencyScore + premiumScore) * typeMultiplier * band.multiplier;
        const finalScore = Math.min(1.0, baseScore);

        // Determine confidence
        let confidence: 'High' | 'Medium' | 'Low' = 'Low';
        if (finalScore >= recommendationRules.confidenceThresholds.high) confidence = 'High';
        else if (finalScore >= recommendationRules.confidenceThresholds.medium) confidence = 'Medium';

        // Generate concept and rationale
        const durationLabel = band.min === 0 ? '≤10 min' : 
                             band.max === 1800 ? '10–30 min' : '30–60 min';
        
        const concept = `${contentType} — ${durationLabel}`;
        
        let rationale = `Completion ${metrics.avgCompletionRate > 60 ? '+' : ''}${(metrics.avgCompletionRate - 60).toFixed(0)}% vs average`;
        if (contentType === 'Live & Unfiltered') {
          rationale += '; highest mobile starts at 20:00–22:00 Wed/Thu';
        }

        const impact = finalScore > 0.8 ? '+8–12% watch time next 30 days' :
                      finalScore > 0.6 ? '+4–7% watch time next 30 days' :
                      '+2–4% watch time next 30 days';

        newRecommendations.push({
          concept,
          contentType,
          duration: durationLabel,
          score: finalScore,
          confidence,
          rationale,
          estimatedImpact: impact
        });
      });
    });

    // Sort by score and take top 8
    newRecommendations.sort((a, b) => b.score - a.score);
    setRecommendations(newRecommendations.slice(0, 8));
  };

  const addToPlan = (recommendation: RecommendationScore) => {
    const newItem = {
      ...recommendation,
      id: Date.now(),
      targetDate: new Date(Date.now() + plan.length * 7 * 24 * 60 * 60 * 1000) // Space items a week apart
    };
    setPlan([...plan, newItem]);
  };

  if (!recommendationRules || !analyticsData || !catalogData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading studio...</div>
      </div>
    );
  }

  return (
    <>
      <head>
        <meta name="robots" content="noindex" />
      </head>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-foreground mb-2">
              What to publish next
            </h1>
            <p className="text-muted-foreground">
              Pick an objective. We'll surface the best next releases.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Controls */}
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Objective</label>
                    <Select value={objective} onValueChange={setObjective}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(recommendationRules.objectives).map(([key, obj]: [string, any]) => (
                          <SelectItem key={key} value={key}>{obj.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Content Type</label>
                    <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {Object.keys(analyticsData.contentTypeMetrics).map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Duration</label>
                    <Select value={durationFilter} onValueChange={setDurationFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Durations</SelectItem>
                        <SelectItem value="short">≤10 min</SelectItem>
                        <SelectItem value="medium">10–30 min</SelectItem>
                        <SelectItem value="long">30–60 min</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Recommendations */}
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-foreground">{rec.concept}</h3>
                          <Badge variant={rec.confidence === 'High' ? 'default' : rec.confidence === 'Medium' ? 'secondary' : 'outline'}>
                            {rec.confidence}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <span className="text-sm font-medium text-foreground">Why this: </span>
                          <span className="text-sm text-muted-foreground">{rec.rationale}</span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Estimated impact:</span> {rec.estimatedImpact}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => addToPlan(rec)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to plan
                        </Button>
                        <Button variant="ghost" size="sm">
                          Create placeholder
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Export Options */}
              <div className="flex gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Plan Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-foreground" />
                  <h3 className="font-medium text-foreground">Content Plan</h3>
                </div>
                
                {plan.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Add recommendations to build your content plan
                  </p>
                ) : (
                  <div className="space-y-3">
                    {plan.map((item, index) => (
                      <div key={item.id} className="text-sm">
                        <div className="font-medium text-foreground">{item.concept}</div>
                        <div className="text-muted-foreground">
                          {item.targetDate.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                        </div>
                        {index < plan.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                    
                    <div className="pt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        Export plan
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerStudio;