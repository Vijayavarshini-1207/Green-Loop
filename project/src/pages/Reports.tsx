import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Printer, Plus, Calendar, FileBarChart, Clock, CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { reports } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const statusConfig = {
  Ready: 'bg-primary/10 text-primary',
  Generating: 'bg-warning/10 text-warning',
  Scheduled: 'bg-muted text-muted-foreground',
};

const typeIcon: Record<string, typeof FileText> = {
  Daily: Calendar,
  Weekly: FileText,
  Monthly: FileBarChart,
  Quarterly: FileBarChart,
  Annual: FileBarChart,
};

export function Reports() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('Monthly');
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast({
        title: 'Report generated',
        description: `${reportType} report has been generated and is ready to download.`,
      });
    }, 1500);
  };

  const download = (name: string) => {
    toast({ title: 'Downloading report', description: `${name} is being downloaded as PDF.` });
  };

  const print = (name: string) => {
    toast({ title: 'Sending to printer', description: `${name} sent to default printer.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" subtitle="Generate, download, and manage sustainability reports">
        <Button className="gap-2" onClick={generate} disabled={generating}>
          {generating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
            />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {generating ? 'Generating…' : 'Generate Report'}
        </Button>
      </PageHeader>

      {/* Generate card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily Emissions Log</SelectItem>
                  <SelectItem value="Weekly">Weekly Sustainability Summary</SelectItem>
                  <SelectItem value="Monthly">Monthly LCA Report</SelectItem>
                  <SelectItem value="Quarterly">Quarterly Carbon Footprint</SelectItem>
                  <SelectItem value="Annual">Annual Sustainability Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2" onClick={generate} disabled={generating}>
              <FileText className="h-4 w-4" />
              Generate Now
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => toast({ title: 'Scheduled', description: `${reportType} report scheduled.` })}>
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Reports', value: reports.length, icon: FileText, color: 'text-primary bg-primary/10' },
          { label: 'Ready', value: reports.filter((r) => r.status === 'Ready').length, icon: CheckCircle2, color: 'text-primary bg-primary/10' },
          { label: 'Generating', value: reports.filter((r) => r.status === 'Generating').length, icon: Clock, color: 'text-warning bg-warning/10' },
          { label: 'Scheduled', value: reports.filter((r) => r.status === 'Scheduled').length, icon: Calendar, color: 'text-muted-foreground bg-muted' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="card-hover">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="mt-1 text-2xl font-bold">{s.value}</p>
                  </div>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', s.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* History table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileBarChart className="h-4 w-4 text-primary" />
              Report History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((r) => {
                    const Icon = typeIcon[r.type] ?? FileText;
                    return (
                      <TableRow key={r.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{r.name}</p>
                              <p className="text-xs text-muted-foreground">{r.author} · {r.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{r.type}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{r.date}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{r.size}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-xs', statusConfig[r.status])}>{r.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => download(r.name)}
                              disabled={r.status !== 'Ready'}
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => print(r.name)}
                              disabled={r.status !== 'Ready'}
                              title="Print"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
