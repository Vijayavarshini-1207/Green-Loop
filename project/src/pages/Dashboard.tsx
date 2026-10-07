import { motion } from 'framer-motion';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Bar, BarChart,
} from 'recharts';
import {
  Leaf, Factory, Droplets, Zap, Brain, TrendingUp, AlertTriangle, FileText, ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { LoadingState, ErrorState } from '@/components/LoadStates';
import { useApi } from '@/hooks/useApi';
import { getDashboardStats } from '@/services/dashboardService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
};

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApi(getDashboardStats);

  if (loading) return <div className="space-y-6"><PageHeader title="Dashboard" subtitle="Loading…" /><LoadingState /></div>;
  if (error || !data) return <div className="space-y-6"><PageHeader title="Dashboard" /><ErrorState message={error ?? 'Failed to load dashboard'} onRetry={refetch} /></div>;

  const { company, sustainabilityScore, plantHealth, monthlyTrend, latestMetrics, alerts, reports, recommendations } = data;

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle={`${company?.name ?? 'Company'} · ${company?.location ?? ''}`}>
        <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/5 text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Live
        </Badge>
      </PageHeader>

      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent" />
          <CardContent className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">{user?.fullName ?? 'Operator'}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Here's the sustainability overview for {company?.name} today.</p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - sustainabilityScore / 100) }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <AnimatedNumber value={sustainabilityScore} className="text-2xl font-bold text-primary" />
                    <p className="text-[10px] text-muted-foreground">score</p>
                  </div>
                </div>
                <p className="mt-1 text-xs font-medium text-muted-foreground">Sustainability</p>
              </div>
              <div className="text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <Factory className="h-10 w-10 text-primary" />
                </div>
                <p className="mt-2 text-2xl font-bold"><AnimatedNumber value={plantHealth} suffix="%" /></p>
                <p className="text-xs font-medium text-muted-foreground">Plant Health</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Carbon Emissions" value={latestMetrics.carbon.toLocaleString()} unit="tCO₂e" change={latestMetrics.carbonChange} icon={Leaf} accent="primary" delay={0} />
        <StatCard title="Water Consumption" value={latestMetrics.water.toLocaleString()} unit="L/day" change={latestMetrics.waterChange} icon={Droplets} accent="info" delay={0.05} />
        <StatCard title="Energy Consumption" value={latestMetrics.energy.toLocaleString()} unit="kWh" change={latestMetrics.energyChange} icon={Zap} accent="warning" delay={0.1} />
        <StatCard title="AI Health Score" value="92" suffix="/100" change={2} icon={Brain} accent="primary" delay={0.15} />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-primary" />Overall Sustainability Trend</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">12-month rolling score</p>
              </div>
              <Badge className="bg-primary/10 text-primary">+{sustainabilityScore - (monthlyTrend[0]?.sustainability ?? 71)} pts</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="sustGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="sustainability" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#sustGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base"><Leaf className="h-4 w-4 text-primary" />Carbon Emissions Trend</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">Monthly tCO₂e</p>
              </div>
              <Badge className="bg-primary/10 text-primary">-26%</Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="carbon" stroke="hsl(var(--chart-4))" strokeWidth={2} fill="url(#carbonGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Water + Energy trend */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Droplets className="h-4 w-4 text-info" />Water Consumption Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="water" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Zap className="h-4 w-4 text-warning" />Energy Consumption Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="energy" stroke="hsl(var(--warning))" strokeWidth={2} fill="url(#energyGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alerts + Reports + AI Recs */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-4 w-4 text-destructive" />Recent Alerts</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate('/alerts')}>View all <ArrowRight className="ml-1 h-3 w-3" /></Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((a: { id: string; title: string; severity: string; time: string }) => (
                <div key={a.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', a.severity === 'critical' ? 'bg-destructive' : a.severity === 'warning' ? 'bg-warning' : 'bg-info')} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.time ?? 'Recently'}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base"><Brain className="h-4 w-4 text-primary" />AI Recommendations</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate('/ai-analysis')}>View all <ArrowRight className="ml-1 h-3 w-3" /></Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((r: { id: string; title: string; description: string; saving: string }) => (
                <div key={r.id} className="rounded-lg border p-3 transition-colors hover:bg-accent">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{r.title}</p>
                    <Badge variant="outline" className="shrink-0 text-xs text-primary">{r.saving}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4 text-info" />Recent Reports</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate('/reports')}>View all <ArrowRight className="ml-1 h-3 w-3" /></Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {reports.map((r: { id: string; name: string; date: string; size: string; status: string }) => (
                <div key={r.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/10"><FileText className="h-4 w-4 text-info" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date} · {r.size}</p>
                  </div>
                  <Badge variant="outline" className={cn('text-xs', r.status === 'Ready' ? 'text-primary' : 'text-muted-foreground')}>{r.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
