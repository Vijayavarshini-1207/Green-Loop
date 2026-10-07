import { motion } from 'framer-motion';
import {
  Brain, Leaf, Droplets, Zap, AlertCircle, Globe, Recycle, Lightbulb,
  TrendingDown, Sparkles, type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiSummary, aiRecommendations } from '@/data/mockData';
import { cn } from '@/lib/utils';

const categoryConfig: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  carbon: { icon: Leaf, color: 'text-primary bg-primary/10', label: 'Carbon' },
  water: { icon: Droplets, color: 'text-info bg-info/10', label: 'Water' },
  energy: { icon: Zap, color: 'text-warning bg-warning/10', label: 'Energy' },
  circular: { icon: Recycle, color: 'text-primary bg-primary/10', label: 'Circular Economy' },
};

const impactConfig = {
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-warning/10 text-warning',
  low: 'bg-primary/10 text-primary',
};

export function AIAnalysis() {
  const analysisCards = [
    { icon: Leaf, title: 'Carbon Analysis', text: aiSummary.carbon, color: 'text-primary bg-primary/10', delay: 0 },
    { icon: Droplets, title: 'Water Analysis', text: aiSummary.water, color: 'text-info bg-info/10', delay: 0.05 },
    { icon: Zap, title: 'Energy Analysis', text: aiSummary.energy, color: 'text-warning bg-warning/10', delay: 0.1 },
    { icon: AlertCircle, title: 'Root Cause Detection', text: aiSummary.rootCause, color: 'text-destructive bg-destructive/10', delay: 0.15 },
    { icon: Globe, title: 'Environmental Impact', text: aiSummary.impact, color: 'text-primary bg-primary/10', delay: 0.2 },
    { icon: Recycle, title: 'Circular Economy Suggestions', text: aiSummary.circular, color: 'text-primary bg-primary/10', delay: 0.25 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="AI Analysis" subtitle="AI-driven insights and recommendations for sustainability optimization">
        <Badge className="gap-1.5 bg-primary/10 text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI Confidence: 94%
        </Badge>
      </PageHeader>

      {/* AI Summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
          <CardContent className="relative p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold">
                  AI Summary
                  <Badge variant="outline" className="text-xs font-normal text-muted-foreground">Generated 2 min ago</Badge>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{aiSummary.overall}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis cards */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {analysisCards.map((c) => {
          const Icon = c.icon;
          return (
            <motion.div key={c.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: c.delay }}>
              <Card className="card-hover h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', c.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold">{c.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-primary" />
              AI Recommendations
              <Badge variant="outline" className="ml-2 text-xs">{aiRecommendations.length} actions</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiRecommendations.map((r, i) => {
              const cfg = categoryConfig[r.category];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.03 }}
                  className="flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
                >
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', cfg.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold">{r.title}</h4>
                      <Badge variant="outline" className={cn('text-xs', impactConfig[r.impact])}>
                        {r.impact} impact
                      </Badge>
                      <Badge variant="outline" className="text-xs text-muted-foreground">{cfg.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                      <TrendingDown className="h-3.5 w-3.5" />
                      {r.saving}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
