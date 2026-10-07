import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  value: string;
  unit?: string;
  suffix?: string;
  change?: number;
  icon: LucideIcon;
  accent?: 'primary' | 'info' | 'warning' | 'destructive';
  delay?: number;
};

const accentMap = {
  primary: 'text-primary bg-primary/10',
  info: 'text-info bg-info/10',
  warning: 'text-warning bg-warning/10',
  destructive: 'text-destructive bg-destructive/10',
};

export function StatCard({
  title,
  value,
  unit,
  suffix,
  change,
  icon: Icon,
  accent = 'primary',
  delay = 0,
}: Props) {
  const positive = (change ?? 0) >= 0;
  // For sustainability metrics, a decrease is good (green), increase is bad (red)
  const isGood = !positive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <Card className="card-hover relative overflow-hidden p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">
              {value}
              {unit && <span className="ml-1 text-base font-normal text-muted-foreground">{unit}</span>}
              {suffix && <span className="ml-1 text-base font-normal text-muted-foreground">{suffix}</span>}
            </p>
          </div>
          <div className={cn('rounded-xl p-2.5', accentMap[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {change !== undefined && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold',
                isGood ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive',
              )}
            >
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(change)}%
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
