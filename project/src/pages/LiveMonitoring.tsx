import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Thermometer, Droplets, Leaf, Zap, Wrench, Radio, Activity } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { MiniSparkline } from '@/components/MiniSparkline';
import { sensorReadings } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusConfig = {
  normal: { label: 'Normal', className: 'bg-primary/10 text-primary border-primary/20' },
  warning: { label: 'Warning', className: 'bg-warning/10 text-warning border-warning/20' },
  critical: { label: 'Critical', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const iconMap: Record<string, typeof Thermometer> = {
  'Crusher Temperature': Thermometer,
  Humidity: Droplets,
  'CO₂ Emission': Leaf,
  'Water Flow': Droplets,
  'Power Load': Zap,
  'Boiler Pressure': Activity,
  Vibration: Wrench,
  'Stack Emission': Radio,
};

export function LiveMonitoring() {
  const [readings, setReadings] = useState(sensorReadings);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setReadings((prev) =>
        prev.map((r) => {
          const delta = (Math.random() - 0.5) * (r.value * 0.05);
          const newVal = +(r.value + delta).toFixed(r.unit === '°C' || r.unit === 'bar' || r.unit === 'mm/s' ? 1 : 0);
          const newHistory = [...r.history.slice(1), newVal];
          return { ...r, value: newVal, history: newHistory };
        }),
      );
      setRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Live Monitoring" subtitle="Real-time sensor data from plant floor · auto-refresh every 5s">
        <Button variant="outline" size="sm" className="gap-2" onClick={refresh} disabled={refreshing}>
          <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
          Refresh
        </Button>
      </PageHeader>

      {/* Sensor status summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(['normal', 'warning', 'critical'] as const).map((status, i) => {
          const count = readings.filter((r) => r.status === status).length;
          const cfg = statusConfig[status];
          return (
            <motion.div key={status} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="card-hover">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-muted-foreground">{cfg.label} Sensors</p>
                    <p className="mt-1 text-3xl font-bold">{count}</p>
                  </div>
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl border', cfg.className)}>
                    <Activity className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Sensor cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {readings.map((r, i) => {
          const Icon = iconMap[r.label] ?? Activity;
          const cfg = statusConfig[r.status];
          return (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Card className="card-hover relative overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', cfg.className)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className={cn('text-xs', cfg.className)}>
                      {cfg.label}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm font-medium text-muted-foreground">{r.label}</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <AnimatedNumber
                      value={r.value}
                      decimals={r.unit === '°C' || r.unit === 'bar' || r.unit === 'mm/s' ? 1 : 0}
                      className="text-3xl font-bold tracking-tight"
                    />
                    <span className="text-sm font-normal text-muted-foreground">{r.unit}</span>
                  </div>
                  <div className="mt-3">
                    <MiniSparkline
                      data={r.history}
                      color={r.status === 'critical' ? 'hsl(var(--destructive))' : r.status === 'warning' ? 'hsl(var(--warning))' : 'hsl(var(--primary))'}
                      height={36}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Last 7 readings</span>
                    <span className={cn('font-medium', r.change > 0 ? 'text-destructive' : r.change < 0 ? 'text-primary' : 'text-muted-foreground')}>
                      {r.change > 0 ? '+' : ''}{r.change}%
                    </span>
                  </div>
                </CardContent>
                {refreshing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm">
                    <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Machine health overview */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4 text-primary" />
              Machine Health Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Primary Crusher', health: 88, status: 'operational' },
                { name: 'Conveyor Belt A', health: 91, status: 'operational' },
                { name: 'Boiler Unit 2', health: 76, status: 'maintenance' },
                { name: 'Emission Stack', health: 79, status: 'attention' },
              ].map((m) => (
                <div key={m.name} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{m.name}</p>
                    <span className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      m.status === 'operational' ? 'bg-primary' : m.status === 'maintenance' ? 'bg-warning' : 'bg-destructive',
                    )} />
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-2xl font-bold">{m.health}%</span>
                    <span className="text-xs capitalize text-muted-foreground">{m.status}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.health}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={cn(
                        'h-full rounded-full',
                        m.status === 'operational' ? 'bg-primary' : m.status === 'maintenance' ? 'bg-warning' : 'bg-destructive',
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
