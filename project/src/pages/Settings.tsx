import { motion } from 'framer-motion';
import {
  Building2, Bell, Radio, Palette, Languages, Brain, Save,
  Moon, Sun, type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

type Section = { icon: LucideIcon; title: string; description: string };

const sections: Section[] = [
  { icon: Building2, title: 'Company Information', description: 'Organization details and branding' },
  { icon: Bell, title: 'Notification Settings', description: 'Alert preferences and channels' },
  { icon: Radio, title: 'Sensor Configuration', description: 'Data acquisition and thresholds' },
  { icon: Palette, title: 'Theme', description: 'Appearance and display preferences' },
  { icon: Languages, title: 'Language', description: 'Interface language and region' },
  { icon: Brain, title: 'AI Preferences', description: 'Model behavior and automation' },
];

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    critical: true,
    warning: true,
    information: false,
    email: true,
    sms: false,
    push: true,
  });
  const [aiPrefs, setAiPrefs] = useState({
    autoRecommend: true,
    predictiveMaintenance: true,
    anomalyDetection: true,
    autoReport: false,
  });
  const [language, setLanguage] = useState('en');
  const [thresholds, setThresholds] = useState({ temp: 85, carbon: 450, vibration: 4.0 });

  const save = () => toast({ title: 'Settings saved', description: 'Your preferences have been updated successfully.' });

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Configure your GreenLoop platform preferences">
        <Button className="gap-2" onClick={save}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </PageHeader>

      {/* Company Info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-primary" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Company Name</Label>
                <Input defaultValue="TerraForge Minerals Ltd." />
              </div>
              <div className="space-y-1.5">
                <Label>Industry</Label>
                <Select defaultValue="mining">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mining">Mining & Metallurgy</SelectItem>
                    <SelectItem value="cement">Cement & Construction</SelectItem>
                    <SelectItem value="steel">Steel & Iron</SelectItem>
                    <SelectItem value="power">Power & Energy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Site Location</Label>
                <Input defaultValue="Kolar, Karnataka, India" />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Email</Label>
                <Input defaultValue="ops@terraforminerals.in" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-3 text-sm font-medium">Alert Types</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(['critical', 'warning', 'information'] as const).map((k) => (
                  <div key={k} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm capitalize">{k}</span>
                    <Switch checked={notifications[k]} onCheckedChange={(v) => setNotifications((p) => ({ ...p, [k]: v }))} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium">Delivery Channels</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {([['email', 'Email'], ['sms', 'SMS'], ['push', 'Push Notification']] as const).map(([k, label]) => (
                  <div key={k} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm">{label}</span>
                    <Switch checked={notifications[k]} onCheckedChange={(v) => setNotifications((p) => ({ ...p, [k]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sensor Config */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Radio className="h-4 w-4 text-primary" />
              Sensor Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Temperature Threshold (°C)</Label>
                <Input type="number" value={thresholds.temp} onChange={(e) => setThresholds((p) => ({ ...p, temp: +e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>CO₂ Threshold (ppm)</Label>
                <Input type="number" value={thresholds.carbon} onChange={(e) => setThresholds((p) => ({ ...p, carbon: +e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Vibration Threshold (mm/s)</Label>
                <Input type="number" step="0.1" value={thresholds.vibration} onChange={(e) => setThresholds((p) => ({ ...p, vibration: +e.target.value }))} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Theme + Language */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4 text-primary" />
                Theme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${theme === 'light' ? 'border-primary ring-1 ring-primary' : 'hover:bg-accent'}`}
                >
                  <Sun className="h-5 w-5 text-warning" />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${theme === 'dark' ? 'border-primary ring-1 ring-primary' : 'hover:bg-accent'}`}
                >
                  <Moon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Dark</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Languages className="h-4 w-4 text-primary" />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                  <SelectItem value="kn">Kannada (ಕನ್ನಡ)</SelectItem>
                  <SelectItem value="es">Spanish (Español)</SelectItem>
                  <SelectItem value="de">German (Deutsch)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Preferences */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4 text-primary" />
              AI Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ['autoRecommend', 'Auto-generate recommendations'],
                ['predictiveMaintenance', 'Predictive maintenance alerts'],
                ['anomalyDetection', 'Anomaly detection'],
                ['autoReport', 'Auto-generate weekly reports'],
              ] as const).map(([k, label]) => (
                <div key={k} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm">{label}</span>
                  <Switch checked={aiPrefs[k]} onCheckedChange={(v) => setAiPrefs((p) => ({ ...p, [k]: v }))} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
