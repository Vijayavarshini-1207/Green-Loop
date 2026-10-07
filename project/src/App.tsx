import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppLayout } from '@/layouts/AppLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { LiveMonitoring } from '@/pages/LiveMonitoring';
import { DigitalTwin } from '@/pages/DigitalTwin';
import { AIAnalysis } from '@/pages/AIAnalysis';
import { WhatIfSimulator } from '@/pages/WhatIfSimulator';
import { Analytics } from '@/pages/Analytics';
import { Alerts } from '@/pages/Alerts';
import { Reports } from '@/pages/Reports';
import { Settings } from '@/pages/Settings';
import { Profile } from '@/pages/Profile';
import { GreenAIChatbot } from '@/components/GreenAIChatbot';
import { Toaster } from '@/components/ui/toaster';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoring" element={<LiveMonitoring />} />
        <Route path="/digital-twin" element={<DigitalTwin />} />
        <Route path="/ai-analysis" element={<AIAnalysis />} />
        <Route path="/simulator" element={<WhatIfSimulator />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <GreenAIChatbot />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
