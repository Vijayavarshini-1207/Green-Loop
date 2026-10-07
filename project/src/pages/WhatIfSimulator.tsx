import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Leaf, Droplets, Recycle, Sun, Sparkles, Gauge,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { cn } from '@/lib/utils';

type SliderConfig = {
  key: string;
  label: string;
  icon: typeof Zap;
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
  color: string;
};

const sliders: SliderConfig[] = [
  { key: 'energy', label: 'Energy Reduction', icon: Zap, unit: '%', min: 0, max: 50, step: 1, default: 10, color: 'text-warning' },
  { key: 'carbon', label: 'Carbon Offset', icon: Leaf, unit: '%', min: 0, max: 60, step: 1, default: 15, color: 'text-primary' },
  { key: 'water', label: 'Water Recycling', icon: Droplets, unit: '%', min: 0, max: 80, step: 1, default: 28, color: 'text-info' },
  { key: 'recycling', label: 'Tailings Reuse', icon: Recycle, unit: '%', min: 0, max: 50, step: 1, default: 15, color: 'text-primary' },
  { key: 'renewable', label: 'Renewable Energy', icon: Sun, unit: '%', min: 0, max: 80, step: 1, default: 23, color: 'text-warning' },
];

export function WhatIfSimulator() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(sliders.map((s) => [s.key, s.default])),
  );

  const results = useMemo(() => {
    const baseScore = 78;
    const score = Math.min(
      100,
      baseScore +
        values.energy * 0.2 +
        values.carbon * 0.25 +
        values.water * 0.15 +
        values.recycling * 0.1 +
        values.renewable * 0.15,
    );
    const carbonFootprint = Math.max(0, 1340 * (1 - values.carbon / 100 - values.renewable * 0.005));
    const waterFootprint = Math.max(0, 8600 * (1 - values.water / 100));
    const energyFootprint = Math.max(0, 760 * (1 - values.energy / 100 - values.renewable * 0.003));

    let rec = 'Current settings show moderate improvement. Increase renewable energy and water recycling for maximum impact.';
    if (score > 92) rec = 'Excellent configuration! You are approaching net-zero operations. Focus on maintaining these levels.';
    else if (score > 85) rec = 'Strong sustainability profile. Expanding tailings reuse could push you into the top tier.';
    else if (values.renewable < 30) rec = 'Renewable energy is your biggest opportunity. Increasing solar capacity to 40%+ yields the highest score gain.';
    else if (values.water < 40) rec = 'Water recycling is below target. Expanding the treatment loop to 40%+ is the highest-leverage action.';
    else rec = 'Balanced improvements across all metrics. Consider carbon offset projects for the final push.';

    return { score: Math.round(score), carbonFootprint: Math.round(carbonFootprint), waterFootprint: Math.round(waterFootprint), energyFootprint: Math.round(energyFootprint), recommendation: rec };
  }, [values]);

  const updateValue = (key: string, val: number) => setValues((p) => ({ ...p, [key]: val }));

  return (
    <div className="space-y-6">
      <PageHeader title="What-If Simulator" subtitle="Adjust parameters to simulate sustainability scenarios in real-time">
        <Badge className="gap-1.5 bg-primary/10 text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered
        </Badge>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Sliders */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gauge className="h-4 w-4 text-primary" />
                Scenario Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sliders.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={cn('h-4 w-4', s.color)} />
                        <span className="text-sm font-medium">{s.label}</span>
                      </div>
                      <span className="font-mono text-sm font-semibold">
                        <AnimatedNumber value={values[s.key]} suffix={s.unit} duration={0.4} />
                      </span>
                    </div>
                    <Slider
                      value={[values[s.key]]}
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      onValueChange={(v) => updateValue(s.key, v[0])}
                    />
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>{s.min}{s.unit}</span>
                      <span>{s.max}{s.unit}</span>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Gauges */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          {/* Sustainability score gauge */}
          <Card>
            <CardContent className="flex flex-col items-center p-6">
              <p className="text-sm font-medium text-muted-foreground">Sustainability Score</p>
              <div className="relative my-4 flex h-40 w-40 items-center justify-center">
                <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - results.score / 100) }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute text-center">
                  <AnimatedNumber value={results.score} className="text-4xl font-bold text-primary" />
                  <p className="text-xs text-muted-foreground">/ 100</p>
                </div>
              </div>
              <Badge className={cn(
                'text-xs',
                results.score > 90 ? 'bg-primary/10 text-primary' : results.score > 80 ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning',
              )}>
                {results.score > 90 ? 'Excellent' : results.score > 80 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </CardContent>
          </Card>

          {/* Footprints */}
          <Card>
            <CardContent className="space-y-4 p-5">
              <Footprint label="Carbon Footprint" value={results.carbonFootprint} unit="tCO₂e" icon={Leaf} color="text-primary" />
              <Footprint label="Water Footprint" value={results.waterFootprint} unit="L/day" icon={Droplets} color="text-info" />
              <Footprint label="Energy Footprint" value={results.energyFootprint} unit="kWh" icon={Zap} color="text-warning" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Recommendation */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold">
                AI Recommendation
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">Live update</Badge>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{results.recommendation}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function Footprint({ label, value, unit, icon: Icon, color }: {
  label: string; value: number; unit: string; icon: typeof Leaf; color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <Icon className={cn('h-4 w-4', color)} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="font-mono text-sm font-bold">
        <AnimatedNumber value={value} duration={0.5} />
        <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
      </span>
    </div>
  );
}
