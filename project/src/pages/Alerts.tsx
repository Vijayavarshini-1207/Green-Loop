import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertTriangle, Info, AlertOctagon, CheckCircle2, Clock, Filter } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { alerts as initialAlerts } from '@/data/mockData';
import type { Alert } from '@/types';
import { cn } from '@/lib/utils';

const severityConfig = {
  critical: { icon: AlertOctagon, className: 'text-destructive bg-destructive/10 border-destructive/20', label: 'Critical' },
  warning: { icon: AlertTriangle, className: 'text-warning bg-warning/10 border-warning/20', label: 'Warning' },
  information: { icon: Info, className: 'text-info bg-info/10 border-info/20', label: 'Information' },
};

const statusConfig = {
  active: 'bg-destructive/10 text-destructive',
  acknowledged: 'bg-warning/10 text-warning',
  resolved: 'bg-primary/10 text-primary',
};

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = alerts.filter((a) => {
    const matchFilter = filter === 'all' || a.severity === filter || a.status === filter;
    const matchQuery = a.title.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  const resolve = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a)));
  };

  const counts = {
    all: alerts.length,
    critical: alerts.filter((a) => a.severity === 'critical').length,
    warning: alerts.filter((a) => a.severity === 'warning').length,
    information: alerts.filter((a) => a.severity === 'information').length,
    active: alerts.filter((a) => a.status === 'active').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Alerts" subtitle="Notification center for all plant alerts and events">
        <Badge variant="outline" className="gap-1.5 border-destructive/30 bg-destructive/5 text-destructive">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
          {counts.active} active
        </Badge>
      </PageHeader>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(['critical', 'warning', 'information'] as const).map((sev, i) => {
          const cfg = severityConfig[sev];
          const Icon = cfg.icon;
          return (
            <motion.div key={sev} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="card-hover">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-muted-foreground">{cfg.label}</p>
                    <p className="mt-1 text-3xl font-bold">{counts[sev]}</p>
                  </div>
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl border', cfg.className)}>
                    <Icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filters + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all" className="text-xs">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="critical" className="text-xs">Critical ({counts.critical})</TabsTrigger>
            <TabsTrigger value="warning" className="text-xs">Warning ({counts.warning})</TabsTrigger>
            <TabsTrigger value="information" className="text-xs">Info ({counts.information})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search alerts…"
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((a, i) => {
            const cfg = severityConfig[a.severity];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className={cn('card-hover', a.status === 'resolved' && 'opacity-60')}>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', cfg.className)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{a.title}</p>
                        <Badge variant="outline" className={cn('text-xs', cfg.className)}>{cfg.label}</Badge>
                        <Badge variant="outline" className={cn('text-xs capitalize', statusConfig[a.status])}>{a.status}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Filter className="h-3 w-3" />{a.source}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.time}</span>
                        <span>#{a.id}</span>
                      </div>
                    </div>
                    {a.status !== 'resolved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 shrink-0"
                        onClick={() => resolve(a.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Resolve
                      </Button>
                    )}
                    {a.status === 'resolved' && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
              <p className="mt-3 text-sm font-medium">No alerts match your filters</p>
              <p className="text-xs text-muted-foreground">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
