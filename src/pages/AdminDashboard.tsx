import React, { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRevenueCalculations } from '@/hooks/useRevenueCalculations';
import { CostBreakdownModal } from '@/components/CostBreakdownModal';
import { CreativeProducerForm } from '@/components/CreativeProducerForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  LogOut, 
  Users, 
  PoundSterling, 
  TrendingUp, 
  Download,
  Info
} from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  ResponsiveContainer 
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { logout, adminUser } = useAdminAuth();
  const { 
    metrics, 
    whatIfInputs, 
    setWhatIfInputs, 
    loading, 
    formatCurrency, 
    formatNumber,
    formatPercentage
  } = useRevenueCalculations();
  const { toast } = useToast();
  const [showCreativeForm, setShowCreativeForm] = useState(false);

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  // Chart data
  const subscriberGrowthData = [
    { year: 'Year 1', subscribers: metrics.year1.subscribers },
    { year: 'Year 2', subscribers: metrics.year2.subscribers }
  ];

  const revenueComparisonData = [
    {
      year: 'Year 1',
      gross: metrics.year1.grossRevenue,
      artistTakeHome: metrics.year1.artistTakeHome
    },
    {
      year: 'Year 2', 
      gross: metrics.year2.grossRevenue,
      artistTakeHome: metrics.year2.artistTakeHome
    }
  ];

  const tierMixData = [
    { name: 'Access', value: metrics.year1.accessSubscribers, fill: 'hsl(var(--accent))' },
    { name: 'Inner Circle', value: metrics.year1.innerCircleSubscribers, fill: 'hsl(var(--accent-hover))' }
  ];

  const handleExportCSV = () => {
    // Generate CSV data
    const csvData = [
      ['Metric', 'Year 1', 'Year 2', 'Change'],
      ['Subscribers', formatNumber(metrics.year1.subscribers), formatNumber(metrics.year2.subscribers), '+5%'],
      ['Gross Revenue', formatCurrency(metrics.year1.grossRevenue), formatCurrency(metrics.year2.grossRevenue), `+${formatCurrency(metrics.year2.grossRevenue - metrics.year1.grossRevenue)}`],
      ['Artist Share (70%)', formatCurrency(metrics.year1.artistShare), formatCurrency(metrics.year2.artistShare), `+${formatCurrency(metrics.year2.artistShare - metrics.year1.artistShare)}`],
      ['Artist Costs', formatCurrency(metrics.year1.artistCosts), formatCurrency(metrics.year2.artistCosts), formatCurrency(metrics.year2.artistCosts - metrics.year1.artistCosts)],
      ['Artist Take-Home', formatCurrency(metrics.year1.artistTakeHome), formatCurrency(metrics.year2.artistTakeHome), `+${formatCurrency(metrics.year2.artistTakeHome - metrics.year1.artistTakeHome)}`],
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artist-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({ title: "CSV Export", description: "Revenue data downloaded successfully" });
  };

  const handleExportPDF = () => {
    // Create a simplified PDF-ready view
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Artist Dashboard - ${new Date().toLocaleDateString()}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
              .header { text-align: center; margin-bottom: 40px; }
              .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
              .metric-card { border: 1px solid #e5e5e5; padding: 20px; border-radius: 8px; }
              .metric-value { font-size: 24px; font-weight: bold; color: #007AFF; margin-bottom: 8px; }
              .metric-label { font-size: 14px; color: #666; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
              th { background-color: #f8f9fa; font-weight: bold; }
              .highlight { color: #007AFF; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Artist Dashboard</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="metric-grid">
              <div class="metric-card">
                <div class="metric-value">${formatCurrency(metrics.runningTotal)}</div>
                <div class="metric-label">Total Take-Home (Years 1-2)</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${formatCurrency(metrics.year1.artistTakeHome)}</div>
                <div class="metric-label">Year 1 Take-Home</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${formatCurrency(metrics.year2.artistTakeHome)}</div>
                <div class="metric-label">Year 2 Take-Home</div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Year 1</th>
                  <th>Year 2</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Subscribers</td>
                  <td>${formatNumber(metrics.year1.subscribers)}</td>
                  <td>${formatNumber(metrics.year2.subscribers)}</td>
                  <td class="highlight">+5%</td>
                </tr>
                <tr>
                  <td>Gross Revenue</td>
                  <td>${formatCurrency(metrics.year1.grossRevenue)}</td>
                  <td>${formatCurrency(metrics.year2.grossRevenue)}</td>
                  <td class="highlight">+${formatCurrency(metrics.year2.grossRevenue - metrics.year1.grossRevenue)}</td>
                </tr>
                <tr>
                  <td>Artist Take-Home</td>
                  <td class="highlight">${formatCurrency(metrics.year1.artistTakeHome)}</td>
                  <td class="highlight">${formatCurrency(metrics.year2.artistTakeHome)}</td>
                  <td class="highlight">+${formatCurrency(metrics.year2.artistTakeHome - metrics.year1.artistTakeHome)}</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast({ title: "PDF Export", description: "Dashboard snapshot ready for printing" });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <div className="border-b border-border bg-surface/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light tracking-wide">Artist Dashboard</h1>
              <p className="text-muted-foreground text-sm font-light mt-1">
                Welcome back, {adminUser?.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Export Actions */}
              <div className="flex items-center gap-2 mr-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="gap-2 font-light"
                  aria-label="Export data as CSV"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  className="gap-2 font-light"
                  aria-label="Download dashboard as PDF"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <div className="group relative">
                  <span className="text-sm text-accent cursor-help font-light">
                    Export your data anytime
                  </span>
                  <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Download your subscriber and performance data whenever you need it.
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={logout} className="gap-2 font-light">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-12 space-y-12">
        {/* Hero Row - 3 Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Running Total - Largest/Highlighted */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 shadow-lg hover:shadow-xl transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-light tracking-wide text-accent">
                Artist Take-Home (Years 1–2)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-accent mb-2">
                {formatCurrency(metrics.runningTotal)}
              </div>
              <p className="text-sm text-muted-foreground font-light">
                Total projected take-home over two years
              </p>
            </CardContent>
          </Card>

          {/* Year 1 Take-Home */}
          <Card className="bg-surface border-border shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-light">Year 1</CardTitle>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light mb-2">{formatCurrency(metrics.year1.artistTakeHome)}</div>
              <p className="text-xs text-muted-foreground font-light">
                Based on {formatNumber(metrics.year1.subscribers)} subscribers
              </p>
            </CardContent>
          </Card>

          {/* Year 2 Take-Home */}
          <Card className="bg-surface border-border shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-light">Year 2</CardTitle>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light mb-2">{formatCurrency(metrics.year2.artistTakeHome)}</div>
              <p className="text-xs text-muted-foreground font-light">
                Based on {formatNumber(metrics.year2.subscribers)} subscribers (+5%)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Row - Drill-down Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gross Revenue */}
          <Card className="bg-surface border-border hover:bg-surface-hover transition-colors duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-light flex items-center gap-1">
                Gross Revenue (Y1)
                <div className="group relative">
                  <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    All subscription income generated in Year 1
                  </div>
                </div>
              </CardTitle>
              <PoundSterling className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-light">{formatCurrency(metrics.year1.grossRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1 font-light">100% of subscription income</p>
            </CardContent>
          </Card>

          {/* Artist Share */}
          <Card className="bg-surface border-border hover:bg-surface-hover transition-colors duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-light flex items-center gap-1">
                Artist Share (70%)
                <div className="group relative">
                  <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    The portion reserved for the artist before costs
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-light">{formatCurrency(metrics.year1.artistShare)}</div>
              <p className="text-xs text-muted-foreground mt-1 font-light">
                70% of gross revenue before costs
              </p>
            </CardContent>
          </Card>

          {/* Artist Costs */}
          <Card className="bg-surface border-border hover:bg-surface-hover transition-colors duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-light">Artist Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-light mb-3">{formatCurrency(metrics.year1.artistCosts)}</div>
              <CostBreakdownModal 
                year1Breakdown={metrics.year1.costBreakdown}
                artistShare={metrics.year1.artistShare}
                whatIfInputs={whatIfInputs}
                setWhatIfInputs={setWhatIfInputs}
                formatCurrency={formatCurrency}
                formatPercentage={formatPercentage}
              />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-surface">
            <TabsTrigger value="overview" className="font-light">Overview</TabsTrigger>
            <TabsTrigger value="charts" className="font-light">Analytics</TabsTrigger>
            <TabsTrigger value="whatif" className="font-light">What-If Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Comparison Table */}
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-lg font-light">Year-over-Year Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 text-sm font-light text-muted-foreground">Metric</th>
                        <th className="pb-3 text-sm font-light text-muted-foreground">Year 1</th>
                        <th className="pb-3 text-sm font-light text-muted-foreground">Year 2</th>
                        <th className="pb-3 text-sm font-light text-muted-foreground">Change</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      <tr className="border-b border-border/50">
                        <td className="py-3 font-light">Subscribers</td>
                        <td className="py-3 font-light">{formatNumber(metrics.year1.subscribers)}</td>
                        <td className="py-3 font-light">{formatNumber(metrics.year2.subscribers)}</td>
                        <td className="py-3 font-light text-green-400">+5%</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 font-light">Gross Revenue</td>
                        <td className="py-3 font-light">{formatCurrency(metrics.year1.grossRevenue)}</td>
                        <td className="py-3 font-light">{formatCurrency(metrics.year2.grossRevenue)}</td>
                        <td className="py-3 font-light text-green-400">+{formatCurrency(metrics.year2.grossRevenue - metrics.year1.grossRevenue)}</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 font-light">Artist Share (70%)</td>
                        <td className="py-3 font-light">{formatCurrency(metrics.year1.artistShare)}</td>
                        <td className="py-3 font-light">{formatCurrency(metrics.year2.artistShare)}</td>
                        <td className="py-3 font-light text-green-400">+{formatCurrency(metrics.year2.artistShare - metrics.year1.artistShare)}</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 font-light">Artist Costs</td>
                        <td className="py-3 font-light">{formatCurrency(metrics.year1.artistCosts)}</td>
                        <td className="py-3 font-light">{formatCurrency(metrics.year2.artistCosts)}</td>
                        <td className="py-3 font-light">{formatCurrency(metrics.year2.artistCosts - metrics.year1.artistCosts)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">Artist Take-Home</td>
                        <td className="py-3 font-medium text-accent">{formatCurrency(metrics.year1.artistTakeHome)}</td>
                        <td className="py-3 font-medium text-accent">{formatCurrency(metrics.year2.artistTakeHome)}</td>
                        <td className="py-3 font-medium text-green-400">+{formatCurrency(metrics.year2.artistTakeHome - metrics.year1.artistTakeHome)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-8">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Subscriber Growth */}
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-base font-light">Subscriber Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer 
                    config={{
                      subscribers: { label: "Subscribers", color: "hsl(var(--accent))" }
                    }} 
                    className="h-[250px]"
                  >
                    <LineChart data={subscriberGrowthData}>
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="subscribers" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--accent))", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Revenue Comparison */}
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-base font-light">Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer 
                    config={{
                      gross: { label: "Gross Revenue", color: "hsl(var(--muted))" },
                      artistTakeHome: { label: "Artist Take-Home", color: "hsl(var(--accent))" }
                    }}
                    className="h-[250px]"
                  >
                    <BarChart data={revenueComparisonData}>
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="gross" fill="hsl(var(--muted))" />
                      <Bar dataKey="artistTakeHome" fill="hsl(var(--accent))" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Tier Mix */}
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-base font-light">Subscriber Tiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer 
                    config={{
                      access: { label: "Access", color: "hsl(var(--accent))" },
                      innerCircle: { label: "Inner Circle", color: "hsl(var(--accent-hover))" }
                    }}
                    className="h-[250px]"
                  >
                    <PieChart>
                      <Pie
                        data={tierMixData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {tierMixData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="whatif" className="space-y-8">
            {/* What-If Scenarios */}
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-lg font-light">What-If Scenarios</CardTitle>
                <p className="text-sm text-muted-foreground font-light">
                  Adjust pricing to see the impact on your projections
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Access Price */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-light">Access Tier Price (Annual)</label>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(whatIfInputs.accessPrice)}
                      </span>
                    </div>
                    <Slider
                      value={[whatIfInputs.accessPrice]}
                      onValueChange={(value) => 
                        setWhatIfInputs({ ...whatIfInputs, accessPrice: value[0] })
                      }
                      max={20}
                      min={10}
                      step={0.99}
                      className="w-full"
                    />
                  </div>

                  {/* Inner Circle Price */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-light">Inner Circle Price (Annual)</label>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(whatIfInputs.innerCirclePrice)}
                      </span>
                    </div>
                    <Slider
                      value={[whatIfInputs.innerCirclePrice]}
                      onValueChange={(value) => 
                        setWhatIfInputs({ ...whatIfInputs, innerCirclePrice: value[0] })
                      }
                      max={40}
                      min={20}
                      step={0.99}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Updated Projections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border">
                  <Card className="bg-card border-border/50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-light text-accent mb-1">
                          {formatCurrency(metrics.runningTotal)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated Running Total
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card border-border/50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-xl font-light mb-1">
                          {formatCurrency(metrics.year1.artistTakeHome)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Year 1 Take-Home
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card border-border/50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-xl font-light mb-1">
                          {formatCurrency(metrics.year2.artistTakeHome)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Year 2 Take-Home
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-lg font-light">Export Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleExportCSV} className="gap-2 font-light">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" onClick={handleExportPDF} className="gap-2 font-light">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Talk to a Creative Producer Section */}
        <div className="bg-muted/30 rounded-lg p-8 border border-border/50">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-light tracking-wide text-foreground">
              Talk to a Creative Producer
            </h2>
            
            <div className="space-y-3">
              <h3 className="text-lg font-light text-muted-foreground">
                Speak directly with a Creative Executive Producer regarding your next content production.
              </h3>
              <p className="text-sm font-light text-muted-foreground leading-relaxed">
                We'll discuss timelines, creative scope, and costs. Zero-pressure creative and logistical conversations to help shape your next project.
              </p>
            </div>

            <Button
              onClick={() => setShowCreativeForm(true)}
              className="font-light px-8 py-3 text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#3A6BFF' }}
            >
              Start the Conversation
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-muted-foreground border-t border-border pt-8">
          Estimates only. Not actual financials.
        </div>
      </div>

      {/* Creative Producer Form Modal */}
      <CreativeProducerForm
        isOpen={showCreativeForm}
        onClose={() => setShowCreativeForm(false)}
      />
    </div>
  );
}