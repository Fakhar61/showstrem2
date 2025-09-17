import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download, FileText } from 'lucide-react';

const PartnerInsights = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [insightsConfig, setInsightsConfig] = useState<any>(null);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    // Load analytics data
    fetch('/data/analytics.json')
      .then(res => res.json())
      .then(data => setAnalyticsData(data));
      
    fetch('/data/insights_config.json')
      .then(res => res.json())
      .then(data => setInsightsConfig(data));
  }, []);

  if (!analyticsData || !insightsConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading insights...</div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

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
              Your Data. See what your audience loves
            </h1>
            <p className="text-muted-foreground">
              Insights from the last 30 days
            </p>
          </div>

          {/* Headline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Monthly Active Viewers</div>
              <div className="text-3xl font-semibold text-foreground">
                {formatNumber(analyticsData.summary.monthlyActiveViewers)}
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Daily Active Viewers</div>
              <div className="text-3xl font-semibold text-foreground">
                {formatNumber(analyticsData.summary.dailyActiveViewers)}
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total Watch Time</div>
              <div className="text-3xl font-semibold text-foreground">
                {formatNumber(analyticsData.summary.totalWatchTimeMinutes)} min
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Avg Session Length</div>
              <div className="text-3xl font-semibold text-foreground">
                {formatDuration(analyticsData.summary.avgSessionLengthMinutes)}
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Completion Rate</div>
              <div className="text-3xl font-semibold text-foreground">
                {analyticsData.summary.avgCompletionRate}%
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Viewers Over Time */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Viewers Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="viewers" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Watch Time by Content Type */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Watch Time by Content Type</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={Object.entries(analyticsData.contentTypeMetrics).map(([type, metrics]: [string, any]) => ({
                    type,
                    watchTime: Math.round(metrics.watchTimeMinutes / 1000)
                  }))}
                  margin={{ bottom: 40, left: 20, right: 20, top: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="type" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: window.innerWidth < 1024 ? 12 : 14 }}
                    interval={0}
                    tickFormatter={(value: string) => {
                      // Split on spaces and join with newlines for multi-line labels
                      const words = value.split(' ');
                      if (words.length <= 2) return value.replace(' ', '\n');
                      // For longer labels like "Live & Unfiltered", break after &
                      if (value.includes('&')) {
                        return value.replace(' &', '\n&');
                      }
                      // Default: break after first word
                      return words[0] + '\n' + words.slice(1).join(' ');
                    }}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name, props) => [`${value}k min`, 'Watch Time']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Bar dataKey="watchTime" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Device Mix */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Device Mix</h3>
              <div className="space-y-3">
                {Object.entries(analyticsData.deviceMix).map(([device, percentage]: [string, any]) => (
                  <div key={device} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{device}</span>
                    <span className="text-sm font-medium text-foreground">{percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Countries */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Top Countries</h3>
              <div className="space-y-3">
                {Object.entries(analyticsData.countryMix).map(([country, percentage]: [string, any]) => (
                  <div key={country} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{country}</span>
                    <span className="text-sm font-medium text-foreground">{percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Top Content */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Top Content</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Completion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.topContent.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{formatNumber(item.views)}</TableCell>
                      <TableCell>{item.completionRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Cohort Retention */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Cohort Retention</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week</TableHead>
                    <TableHead>Week 1</TableHead>
                    <TableHead>Week 4</TableHead>
                    <TableHead>Week 12</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.cohortRetention.map((cohort: any) => (
                    <TableRow key={cohort.week}>
                      <TableCell className="font-medium">{cohort.week}</TableCell>
                      <TableCell>{cohort.week1}%</TableCell>
                      <TableCell>{cohort.week4}%</TableCell>
                      <TableCell>{cohort.week12}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Export Buttons */}
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
      </div>
    </>
  );
};

export default PartnerInsights;