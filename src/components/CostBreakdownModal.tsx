import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Settings, 
  CreditCard, 
  Server, 
  FileCheck, 
  Headphones, 
  Package,
  Info 
} from 'lucide-react';

interface CostBreakdownModalProps {
  year1Breakdown: {
    streaming: number;
    hosting: number;
    paymentProcessing: number;
    maintenance: number;
    licensing: number;
    total: number;
  };
  artistShare: number;
  whatIfInputs: {
    streaming: number;
    hosting: number;
    paymentProcessing: number;
    maintenance: number;
    licensing: number;
  };
  setWhatIfInputs: (inputs: any) => void;
  formatCurrency: (amount: number) => string;
  formatPercentage: (num: number) => string;
}

export function CostBreakdownModal({ 
  year1Breakdown, 
  artistShare, 
  whatIfInputs, 
  setWhatIfInputs, 
  formatCurrency, 
  formatPercentage 
}: CostBreakdownModalProps) {
  const [adjustmentsOpen, setAdjustmentsOpen] = useState(false);

  const costItems = [
    {
      icon: Server,
      label: 'Streaming delivery',
      amount: year1Breakdown.streaming,
      tooltip: 'CDN, player, bandwidth costs'
    },
    {
      icon: Package,
      label: 'Platform hosting',
      amount: year1Breakdown.hosting,
      tooltip: 'Server infrastructure and hosting'
    },
    {
      icon: CreditCard,
      label: 'Payment processing',
      amount: year1Breakdown.paymentProcessing,
      tooltip: 'Card processing and transaction fees'
    },
    {
      icon: Settings,
      label: 'Maintenance',
      amount: year1Breakdown.maintenance,
      tooltip: 'DevOps and platform maintenance'
    },
    {
      icon: FileCheck,
      label: 'Licensing',
      amount: year1Breakdown.licensing,
      tooltip: 'Rights clearances and royalties'
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-3 font-light">
          View breakdown
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-light">Artist Costs Breakdown</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cost Items */}
          <div className="grid gap-4">
            {costItems.map((item, index) => {
              const Icon = item.icon;
              const percentage = (item.amount / artistShare) * 100;
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-md">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-light">{item.label}</span>
                        <div className="group relative">
                          <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                          <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {item.tooltip}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatPercentage(percentage)} of Artist Share
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-light">{formatCurrency(item.amount)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-accent/20">
            <div>
              <span className="font-medium">Total Artist Costs</span>
              <div className="text-xs text-muted-foreground">
                {formatPercentage((year1Breakdown.total / artistShare) * 100)} of Artist Share
              </div>
            </div>
            <div className="text-xl font-light text-accent">
              {formatCurrency(year1Breakdown.total)}
            </div>
          </div>

          {/* Adjust Assumptions Button */}
          <Sheet open={adjustmentsOpen} onOpenChange={setAdjustmentsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full gap-2 font-light">
                <Settings className="w-4 h-4" />
                Adjust assumptions
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-surface border-border w-[400px]">
              <SheetHeader>
                <SheetTitle className="font-light">Cost Assumptions</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-8 py-6">
                {/* Streaming */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-light">Streaming delivery</label>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(whatIfInputs.streaming)}
                    </span>
                  </div>
                  <Slider
                    value={[whatIfInputs.streaming]}
                    onValueChange={(value) => 
                      setWhatIfInputs({ ...whatIfInputs, streaming: value[0] })
                    }
                    max={20000}
                    min={1000}
                    step={500}
                    className="w-full"
                  />
                </div>

                {/* Hosting */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-light">Platform hosting</label>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(whatIfInputs.hosting)}
                    </span>
                  </div>
                  <Slider
                    value={[whatIfInputs.hosting]}
                    onValueChange={(value) => 
                      setWhatIfInputs({ ...whatIfInputs, hosting: value[0] })
                    }
                    max={25000}
                    min={2000}
                    step={500}
                    className="w-full"
                  />
                </div>

                {/* Payment Processing */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-light">Payment processing</label>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(whatIfInputs.paymentProcessing)}
                    </span>
                  </div>
                  <Slider
                    value={[whatIfInputs.paymentProcessing]}
                    onValueChange={(value) => 
                      setWhatIfInputs({ ...whatIfInputs, paymentProcessing: value[0] })
                    }
                    max={150000}
                    min={30000}
                    step={2500}
                    className="w-full"
                  />
                </div>

                {/* Maintenance */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-light">Maintenance</label>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(whatIfInputs.maintenance)}
                    </span>
                  </div>
                  <Slider
                    value={[whatIfInputs.maintenance]}
                    onValueChange={(value) => 
                      setWhatIfInputs({ ...whatIfInputs, maintenance: value[0] })
                    }
                    max={25000}
                    min={3000}
                    step={500}
                    className="w-full"
                  />
                </div>

                {/* Licensing */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-light">Licensing</label>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(whatIfInputs.licensing)}
                    </span>
                  </div>
                  <Slider
                    value={[whatIfInputs.licensing]}
                    onValueChange={(value) => 
                      setWhatIfInputs({ ...whatIfInputs, licensing: value[0] })
                    }
                    max={50000}
                    min={5000}
                    step={1000}
                    className="w-full"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </DialogContent>
    </Dialog>
  );
}