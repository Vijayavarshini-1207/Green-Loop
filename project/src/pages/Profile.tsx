import { motion } from 'framer-motion';
import {
  Building2, Mail, Phone, MapPin, Calendar, Users, Lock, Save,
  Upload, Factory,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { company } from '@/data/mockData';

export function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();

  const save = () => toast({ title: 'Profile updated', description: 'Your profile changes have been saved.' });

  const infoItems = [
    { icon: Building2, label: 'Company', value: company.name },
    { icon: Factory, label: 'Industry', value: company.industry },
    { icon: Mail, label: 'Email', value: user?.email ?? company.email },
    { icon: Phone, label: 'Phone', value: company.phone },
    { icon: MapPin, label: 'Location', value: company.location },
    { icon: Calendar, label: 'Established', value: company.established },
    { icon: Users, label: 'Employees', value: company.employees },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Manage your company and account information">
        <Button className="gap-2" onClick={save}>
          <Save className="h-4 w-4" />
          Save Profile
        </Button>
      </PageHeader>

      {/* Profile header card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <CardContent className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/30">
              {company.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{company.name}</h2>
                <Badge className="bg-primary/10 text-primary">Enterprise</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{company.industry} · {company.location}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{company.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{company.phone}</span>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Change Logo
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Company info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
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
                <Input defaultValue={company.name} />
              </div>
              <div className="space-y-1.5">
                <Label>Industry Name</Label>
                <Input defaultValue={company.industry} />
              </div>
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input defaultValue={company.email} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input defaultValue={company.phone} />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input defaultValue={company.location} />
              </div>
              <div className="space-y-1.5">
                <Label>Established</Label>
                <Input defaultValue={company.established} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account / password */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4 text-primary" />
              Password & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button variant="outline" className="mt-4 gap-2" onClick={() => toast({ title: 'Password updated', description: 'Your password has been changed.' })}>
              <Lock className="h-4 w-4" />
              Update Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick info grid */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {infoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="truncate text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
