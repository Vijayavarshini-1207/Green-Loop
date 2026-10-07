export type TrendPoint = {
  name: string;
  carbon: number;
  water: number;
  energy: number;
  sustainability: number;
};

export type MetricTrend = {
  name: string;
  value: number;
  target: number;
  unit: string;
};

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'information';
  source: string;
  time: string;
  status: 'active' | 'resolved' | 'acknowledged';
};

export type Report = {
  id: string;
  name: string;
  type: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  date: string;
  size: string;
  status: 'Ready' | 'Generating' | 'Scheduled';
  author: string;
};

export type SensorReading = {
  label: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  change: number;
  history: number[];
};

export type TwinComponent = {
  id: string;
  name: string;
  type: 'crusher' | 'conveyor' | 'processing' | 'boiler' | 'watertank' | 'energy' | 'stack';
  x: number;
  y: number;
  health: number;
  temperature: number;
  carbon: number;
  water: number;
  energy: number;
  risk: 'low' | 'medium' | 'high';
  prediction: string;
  status: 'operational' | 'maintenance' | 'critical';
};

export type AIRecommendation = {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'carbon' | 'water' | 'energy' | 'circular';
  saving: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
};

export type NavItem = {
  label: string;
  path: string;
  icon: string;
};
