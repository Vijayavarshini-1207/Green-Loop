import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer, Droplets, Zap, Leaf, Activity, AlertTriangle,
  Gauge, Cpu, Factory, Waves, Flame, Wind, ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { twinComponents } from '@/data/mockData';
import type { TwinComponent } from '@/types';
import { cn } from '@/lib/utils';

const typeIcon: Record<string, typeof Cpu> = {
  crusher: Cpu,
  conveyor: Factory,
  processing: Factory,
  boiler: Flame,
  watertank: Waves,
  energy: Zap,
  stack: Wind,
};

const riskConfig = {
  low: { label: 'Low Risk', className: 'bg-primary/10 text-primary border-primary/20' },
  medium: { label: 'Medium Risk', className: 'bg-warning/10 text-warning border-warning/20' },
  high: { label: 'High Risk', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const statusConfig = {
  operational: { color: 'hsl(var(--primary))', label: 'Operational' },
  maintenance: { color: 'hsl(var(--warning))', label: 'Maintenance' },
  critical: { color: 'hsl(var(--destructive))', label: 'Critical' },
};

export function DigitalTwin() {
  const [selected, setSelected] = useState<TwinComponent | null>(twinComponents[0]);

  return (
    <div className="space-y-6">
      <PageHeader title="Digital Twin" subtitle="Interactive 3D model of the Kolar processing plant">
        <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/5 text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Real-time sync
        </Badge>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Twin visualization */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card className="relative overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-[480px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-background via-card to-primary/5">
                {/* Grid background */}
                <div className="absolute inset-0 grid-bg opacity-30" />

                {/* Plant floor */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Connection lines */}
                  {twinComponents.slice(0, -1).map((c, i) => {
                    const next = twinComponents[i + 1];
                    return (
                      <line
                        key={c.id}
                        x1={c.x} y1={c.y} x2={next.x} y2={next.y}
                        stroke={selected?.id === c.id ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                        strokeWidth="0.4"
                        className="animate-flow"
                        opacity={0.6}
                      />
                    );
                  })}
                  {/* Extra connections */}
                  <line x1="12" y1="62" x2="12" y2="28" stroke="hsl(var(--border))" strokeWidth="0.3" className="animate-flow" opacity="0.4" />
                  <line x1="58" y1="45" x2="88" y2="62" stroke="hsl(var(--border))" strokeWidth="0.3" className="animate-flow" opacity="0.4" />
                  <line x1="32" y1="30" x2="58" y2="45" stroke="hsl(var(--border))" strokeWidth="0.3" className="animate-flow" opacity="0.4" />
                </svg>

                {/* Components */}
                {twinComponents.map((c) => {
                  const Icon = typeIcon[c.type];
                  const cfg = statusConfig[c.status];
                  const isSelected = selected?.id === c.id;
                  return (
                    <motion.button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ scale: 1.1 }}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${c.x}%`, top: `${c.y}%` }}
                    >
                      <div className="relative">
                        {/* Glow ring */}
                        <span
                          className={cn('absolute inset-0 rounded-2xl animate-pulse-ring', isSelected && 'opacity-100')}
                          style={{ backgroundColor: cfg.color, opacity: isSelected ? 0.3 : 0.15 }}
                        />
                        {/* Node */}
                        <div
                          className={cn(
                            'relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 bg-card shadow-lg transition-all',
                            isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : '',
                          )}
                          style={{ borderColor: cfg.color }}
                        >
                          <Icon className="h-6 w-6" style={{ color: cfg.color }} />
                        </div>
                        {/* Label */}
                        <div className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap">
                          <span className="text-[10px] font-medium text-muted-foreground">{c.name}</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}

                {/* Legend */}
                <div className="absolute bottom-3 left-3 flex gap-3 rounded-lg border bg-card/80 p-2 backdrop-blur">
                  {Object.entries(statusConfig).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: v.color }} />
                      <span className="text-xs text-muted-foreground">{v.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detail panel */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-primary" />
                Component Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{selected.name}</h3>
                        <p className="text-xs capitalize text-muted-foreground">{selected.type} unit</p>
                      </div>
                      <Badge variant="outline" className={riskConfig[selected.risk].className}>
                        {riskConfig[selected.risk].label}
                      </Badge>
                    </div>

                    {/* Health gauge */}
                    <div className="flex items-center gap-4">
                      <div className="relative flex h-20 w-20 items-center justify-center">
                        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                          <motion.circle
                            cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 42}
                            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - selected.health / 100) }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </svg>
                        <div className="absolute text-center">
                          <AnimatedNumber value={selected.health} suffix="%" className="text-lg font-bold" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Health Score</p>
                        <p className="text-sm font-medium capitalize">{selected.status}</p>
                      </div>
                    </div>

                    {/* Sensor readings */}
                    <div className="grid grid-cols-2 gap-3">
                      <Metric icon={Thermometer} label="Temperature" value={selected.temperature} unit="°C" color="text-warning" />
                      <Metric icon={Leaf} label="Carbon" value={selected.carbon} unit="kg/h" color="text-destructive" />
                      <Metric icon={Droplets} label="Water" value={selected.water} unit="L/min" color="text-info" />
                      <Metric icon={Zap} label="Energy" value={selected.energy} unit="kW" color="text-primary" />
                    </div>

                    {/* AI prediction */}
                    <div className="rounded-lg border bg-primary/5 p-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" />
                        <p className="text-xs font-semibold text-primary">AI Prediction</p>
                      </div>
                      <p className="mt-1.5 text-sm">{selected.prediction}</p>
                    </div>

                    {/* Risk indicator */}
                    <div className={cn('flex items-center gap-2 rounded-lg border p-3', riskConfig[selected.risk].className)}>
                      <AlertTriangle className="h-4 w-4" />
                      <p className="text-sm font-medium">{riskConfig[selected.risk].label}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Component list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="h-4 w-4 text-primary" />
            All Components
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {twinComponents.map((c) => {
              const Icon = typeIcon[c.type];
              const cfg = statusConfig[c.status];
              return (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-all hover:shadow-md',
                    selected?.id === c.id ? 'border-primary ring-1 ring-primary' : '',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${cfg.color}20` }}>
                      <Icon className="h-4 w-4" style={{ color: cfg.color }} />
                    </div>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                  </div>
                  <p className="mt-2 truncate text-xs font-medium">{c.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.health}% health</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value, unit, color }: {
  icon: typeof Thermometer; label: string; value: number; unit: string; color: string;
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-1.5">
        <Icon className={cn('h-3.5 w-3.5', color)} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="mt-1 text-lg font-bold">
        <AnimatedNumber value={value} decimals={1} />
        <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}
