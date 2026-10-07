import { useState } from 'react';
import { Menu, Search, Bell, Moon, Sun, Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useClock, formatTime, formatDate } from '@/hooks/useClock';
import { useAuth } from '@/contexts/AuthContext';
import { alerts } from '@/data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type Props = {
  onMenuClick: () => void;
};

export function TopNav({ onMenuClick }: Props) {
  const { theme, toggleTheme } = useTheme();
  const now = useClock();
  const { user, logout } = useAuth();
  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const [query, setQuery] = useState('');

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur-xl lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 hover:bg-accent lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search metrics, sensors, reports…"
          className="h-9 w-full rounded-lg border bg-background pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex-1 sm:hidden" />

      {/* Clock */}
      <div className="hidden items-center gap-2 rounded-lg border bg-background px-3 py-1.5 md:flex">
        <Clock className="h-4 w-4 text-primary" />
        <div className="text-right">
          <p className="font-mono text-xs font-semibold leading-none">{formatTime(now)}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{formatDate(now)}</p>
        </div>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        title="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Bell className="h-5 w-5" />
            {activeAlerts.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
              {activeAlerts.length} active
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {activeAlerts.slice(0, 5).map((a) => (
            <DropdownMenuItem key={a.id} className="flex flex-col items-start gap-1 py-2">
              <div className="flex w-full items-center gap-2">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    a.severity === 'critical' ? 'bg-destructive' : a.severity === 'warning' ? 'bg-warning' : 'bg-info',
                  )}
                />
                <span className="text-sm font-medium">{a.title}</span>
              </div>
              <span className="pl-4 text-xs text-muted-foreground">{a.time}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary transition-transform hover:scale-105">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
