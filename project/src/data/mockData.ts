import type {
  TrendPoint,
  Alert,
  Report,
  SensorReading,
  TwinComponent,
  AIRecommendation,
} from '@/types';

export const company = {
  name: 'TerraForge Minerals Ltd.',
  site: 'Kolar Operations Complex',
  location: 'Karnataka, India',
  industry: 'Mining & Metallurgy',
  email: 'ops@terraforminerals.in',
  phone: '+91 80 4567 8900',
  established: '1998',
  employees: '2,400',
};

export const sustainabilityScore = 78;

export const plantHealth = 86;

export const monthlyTrend: TrendPoint[] = [
  { name: 'Jan', carbon: 1820, water: 12400, energy: 980, sustainability: 71 },
  { name: 'Feb', carbon: 1750, water: 11800, energy: 945, sustainability: 73 },
  { name: 'Mar', carbon: 1690, water: 11200, energy: 910, sustainability: 74 },
  { name: 'Apr', carbon: 1720, water: 11500, energy: 930, sustainability: 73 },
  { name: 'May', carbon: 1640, water: 10800, energy: 890, sustainability: 75 },
  { name: 'Jun', carbon: 1580, water: 10200, energy: 860, sustainability: 76 },
  { name: 'Jul', carbon: 1510, water: 9800, energy: 830, sustainability: 77 },
  { name: 'Aug', carbon: 1450, water: 9400, energy: 805, sustainability: 78 },
  { name: 'Sep', carbon: 1490, water: 9600, energy: 820, sustainability: 77 },
  { name: 'Oct', carbon: 1420, water: 9100, energy: 790, sustainability: 79 },
  { name: 'Nov', carbon: 1380, water: 8900, energy: 775, sustainability: 80 },
  { name: 'Dec', carbon: 1340, water: 8600, energy: 760, sustainability: 81 },
];

export const carbonTrend = monthlyTrend.map((m) => ({ name: m.name, value: m.carbon }));
export const waterTrend = monthlyTrend.map((m) => ({ name: m.name, value: m.water }));
export const energyTrend = monthlyTrend.map((m) => ({ name: m.name, value: m.energy }));

export const dailyCarbon = [
  { name: '00h', value: 42 }, { name: '04h', value: 38 }, { name: '08h', value: 55 },
  { name: '12h', value: 68 }, { name: '16h', value: 61 }, { name: '20h', value: 47 },
];

export const energyMix = [
  { name: 'Grid Power', value: 52, color: 'hsl(200 80% 50%)' },
  { name: 'Solar', value: 23, color: 'hsl(32 90% 55%)' },
  { name: 'Wind', value: 15, color: 'hsl(142 64% 40%)' },
  { name: 'Diesel Genset', value: 10, color: 'hsl(0 72% 55%)' },
];

export const waterSources = [
  { name: 'Freshwater', value: 64, color: 'hsl(200 80% 50%)' },
  { name: 'Recycled', value: 28, color: 'hsl(142 64% 40%)' },
  { name: 'Rainwater', value: 8, color: 'hsl(180 60% 45%)' },
];

export const scopeEmissions = [
  { scope: 'Scope 1', direct: 620, process: 480, fugitive: 90 },
  { scope: 'Scope 2', electricity: 410, heat: 120 },
  { scope: 'Scope 3', logistics: 280, supply: 190, downstream: 140 },
];

export const sensorReadings: SensorReading[] = [
  { label: 'Crusher Temperature', value: 72, unit: '°C', status: 'normal', change: -2, history: [68, 70, 71, 69, 72, 70, 72] },
  { label: 'Humidity', value: 54, unit: '%', status: 'normal', change: 3, history: [48, 50, 52, 51, 53, 54, 54] },
  { label: 'CO₂ Emission', value: 412, unit: 'ppm', status: 'warning', change: 8, history: [398, 402, 405, 408, 410, 411, 412] },
  { label: 'Water Flow', value: 320, unit: 'L/min', status: 'normal', change: -5, history: [330, 328, 325, 322, 320, 321, 320] },
  { label: 'Power Load', value: 845, unit: 'kW', status: 'warning', change: 12, history: [810, 820, 830, 835, 840, 842, 845] },
  { label: 'Boiler Pressure', value: 14.2, unit: 'bar', status: 'normal', change: 0, history: [14, 14.1, 14.2, 14.1, 14.2, 14.2, 14.2] },
  { label: 'Vibration', value: 4.8, unit: 'mm/s', status: 'critical', change: 15, history: [3.2, 3.5, 3.8, 4.1, 4.4, 4.6, 4.8] },
  { label: 'Stack Emission', value: 78, unit: 'mg/Nm³', status: 'normal', change: -3, history: [82, 80, 79, 78, 77, 78, 78] },
];

export const twinComponents: TwinComponent[] = [
  { id: 'crusher', name: 'Primary Crusher', type: 'crusher', x: 12, y: 62, health: 88, temperature: 72, carbon: 182, water: 12, energy: 245, risk: 'low', prediction: 'Optimal throughput expected for 14h', status: 'operational' },
  { id: 'conveyor', name: 'Conveyor Belt A', type: 'conveyor', x: 38, y: 58, health: 91, temperature: 54, carbon: 64, water: 0, energy: 88, risk: 'low', prediction: 'Belt wear within tolerance', status: 'operational' },
  { id: 'processing', name: 'Processing Plant', type: 'processing', x: 58, y: 45, health: 84, temperature: 68, carbon: 312, water: 180, energy: 420, risk: 'medium', prediction: 'Reagent efficiency dropping 2%/day', status: 'operational' },
  { id: 'boiler', name: 'Boiler Unit 2', type: 'boiler', x: 80, y: 38, health: 76, temperature: 89, carbon: 245, water: 60, energy: 310, risk: 'medium', prediction: 'Scale buildup detected — service in 6 days', status: 'maintenance' },
  { id: 'watertank', name: 'Water Treatment Tank', type: 'watertank', x: 32, y: 30, health: 93, temperature: 28, carbon: 8, water: 320, energy: 22, risk: 'low', prediction: 'Recycling rate at 28%', status: 'operational' },
  { id: 'energy', name: 'Energy Unit', type: 'energy', x: 12, y: 28, health: 82, temperature: 45, carbon: 410, water: 4, energy: 845, risk: 'medium', prediction: 'Solar contributing 23% — increase recommended', status: 'operational' },
  { id: 'stack', name: 'Emission Stack', type: 'stack', x: 88, y: 62, health: 79, temperature: 112, carbon: 198, water: 0, energy: 12, risk: 'high', prediction: 'Particulate rising — filter replacement due', status: 'critical' },
];

export const alerts: Alert[] = [
  { id: 'ALT-001', title: 'Vibration threshold exceeded', description: 'Primary crusher vibration at 4.8 mm/s, above 4.0 mm/s safe limit. Bearing wear suspected.', severity: 'critical', source: 'Crusher Sensor #C-12', time: '2 min ago', status: 'active' },
  { id: 'ALT-002', title: 'CO₂ emission trending up', description: 'Stack CO₂ concentration rose 8 ppm in 30 minutes. Investigate fuel mix.', severity: 'warning', source: 'Emission Stack', time: '14 min ago', status: 'active' },
  { id: 'ALT-003', title: 'Power load above baseline', description: 'Power draw at 845 kW vs 800 kW baseline. Possible motor inefficiency.', severity: 'warning', source: 'Energy Unit', time: '32 min ago', status: 'acknowledged' },
  { id: 'ALT-004', title: 'Boiler service scheduled', description: 'Boiler Unit 2 scale buildup at 1.8 mm. Maintenance window booked for Aug 12.', severity: 'information', source: 'Boiler Unit 2', time: '1 h ago', status: 'active' },
  { id: 'ALT-005', title: 'Water recycling rate improved', description: 'Recycled water share rose to 28%, up from 24% last week.', severity: 'information', source: 'Water Treatment Tank', time: '2 h ago', status: 'resolved' },
  { id: 'ALT-006', title: 'Conveyor belt misalignment', description: 'Conveyor Belt A tracking 3mm off-center. Auto-correction engaged.', severity: 'warning', source: 'Conveyor Belt A', time: '3 h ago', status: 'resolved' },
  { id: 'ALT-007', title: 'Stack particulate rising', description: 'Particulate at 78 mg/Nm³, filter efficiency degrading. Replacement recommended.', severity: 'critical', source: 'Emission Stack', time: '5 h ago', status: 'active' },
  { id: 'ALT-008', title: 'Solar generation peak', description: 'Solar contribution hit 23% between 11:00–13:00, best this quarter.', severity: 'information', source: 'Energy Unit', time: '6 h ago', status: 'resolved' },
];

export const reports: Report[] = [
  { id: 'RPT-2026-084', name: 'August Monthly LCA Report', type: 'Monthly', date: 'Aug 01, 2026', size: '4.2 MB', status: 'Ready', author: 'System' },
  { id: 'RPT-2026-083', name: 'Week 31 Sustainability Summary', type: 'Weekly', date: 'Jul 28, 2026', size: '1.8 MB', status: 'Ready', author: 'A. Sharma' },
  { id: 'RPT-2026-082', name: 'Q2 Carbon Footprint Report', type: 'Quarterly', date: 'Jul 15, 2026', size: '6.7 MB', status: 'Ready', author: 'System' },
  { id: 'RPT-2026-081', name: 'Daily Emissions Log — Jul 14', type: 'Daily', date: 'Jul 14, 2026', size: '0.9 MB', status: 'Ready', author: 'System' },
  { id: 'RPT-2026-080', name: 'Annual Sustainability Report 2025', type: 'Annual', date: 'Jan 10, 2026', size: '12.4 MB', status: 'Ready', author: 'M. Iyer' },
  { id: 'RPT-2026-085', name: 'Water Audit Report', type: 'Monthly', date: 'Aug 06, 2026', size: '—', status: 'Generating', author: 'System' },
  { id: 'RPT-2026-086', name: 'Q3 Energy Efficiency Report', type: 'Quarterly', date: 'Sep 30, 2026', size: '—', status: 'Scheduled', author: 'System' },
];

export const aiRecommendations: AIRecommendation[] = [
  { id: 'REC-01', title: 'Shift boiler load to off-peak', description: 'Moving Boiler Unit 2 operation to 23:00–05:00 reduces grid carbon intensity by 18% and cuts energy cost.', impact: 'high', category: 'energy', saving: '₹3.2L / month' },
  { id: 'REC-02', title: 'Install variable frequency drives', description: 'Retrofitting crusher motors with VFDs can cut energy draw by 12–15% under partial load.', impact: 'high', category: 'energy', saving: '₹2.1L / month' },
  { id: 'REC-03', title: 'Expand water recycling loop', description: 'Routing processing plant discharge through the treatment tank raises recycling from 28% to 41%.', impact: 'high', category: 'water', saving: '1,400 L/day' },
  { id: 'REC-04', title: 'Replace stack filter cartridges', description: 'Current particulate efficiency at 79%. New cartridges restore it to 96% and avoid regulatory risk.', impact: 'high', category: 'carbon', saving: '22% PM reduction' },
  { id: 'REC-05', title: 'Recover tailings as aggregate', description: 'Crushed tailings can replace 15% of purchased aggregate in concrete backfill — circular economy win.', impact: 'medium', category: 'circular', saving: '₹1.8L / month' },
  { id: 'REC-06', title: 'Solar capacity expansion', description: 'Adding 200 kWp solar cuts grid dependence by ~9% and offsets 310 tCO₂/year.', impact: 'medium', category: 'carbon', saving: '310 tCO₂/yr' },
  { id: 'REC-07', title: 'Condensate recovery in boiler', description: 'Recovering condensate saves 8% of feedwater and 4% of boiler fuel.', impact: 'low', category: 'water', saving: '180 L/day' },
  { id: 'REC-08', title: 'Predictive maintenance schedule', description: 'AI model predicts crusher bearing failure in 11 days. Schedule proactive replacement.', impact: 'high', category: 'energy', saving: '14h downtime avoided' },
];

export const aiSummary = {
  overall: 'Sustainability performance is trending upward with a 10-point gain over the last 12 months. Carbon emissions are down 26%, water use down 31%, and energy use down 22%. The main risk is emission stack particulate degradation and rising crusher vibration — both flagged for immediate action.',
  carbon: 'Carbon emissions fell from 1,820 tCO₂e in January to 1,340 tCO₂e in December, a 26% reduction driven by solar expansion and load shifting. Scope 1 remains the largest contributor at 58% of total emissions.',
  water: 'Water consumption dropped from 12,400 L/day to 8,600 L/day. Recycling now accounts for 28% of intake, up from 18%. Expanding the recycling loop is the highest-leverage next step.',
  energy: 'Energy use declined 22% year-over-year. Solar now provides 23% of demand. Peak load still exceeds 845 kW — VFD retrofits and off-peak boiler scheduling are recommended.',
  rootCause: 'Rising crusher vibration traces to bearing wear on the primary crusher (Sensor C-12). Stack particulate rise correlates with filter cartridge age (installed 142 days ago, rated 120).',
  impact: 'Environmental impact is moderate-positive. Land use intensity stable, water table drawdown reduced 12%, and biodiversity index in the lease area improved by 3 points.',
  circular: 'Tailings reuse at 15% substitution in backfill concrete, slag sales to cement plants, and 28% water recycling are active circular economy streams. Expanding tailings reuse to 30% is feasible.',
};

export const analyticsBar = [
  { name: 'Q1', carbon: 5260, water: 35400, energy: 2835 },
  { name: 'Q2', carbon: 4940, water: 32500, energy: 2680 },
  { name: 'Q3', carbon: 4350, water: 28400, energy: 2415 },
  { name: 'Q4', carbon: 4140, water: 26600, energy: 2335 },
];

export const analyticsArea = [
  { name: 'W1', carbon: 1820, water: 12400, energy: 980 },
  { name: 'W2', carbon: 1750, water: 11800, energy: 945 },
  { name: 'W3', carbon: 1690, water: 11200, energy: 910 },
  { name: 'W4', carbon: 1720, water: 11500, energy: 930 },
  { name: 'W5', carbon: 1640, water: 10800, energy: 890 },
  { name: 'W6', carbon: 1580, water: 10200, energy: 860 },
  { name: 'W7', carbon: 1510, water: 9800, energy: 830 },
  { name: 'W8', carbon: 1450, water: 9400, energy: 805 },
];

export const radarData = [
  { metric: 'Carbon', value: 74, full: 100 },
  { metric: 'Water', value: 82, full: 100 },
  { metric: 'Energy', value: 78, full: 100 },
  { metric: 'Waste', value: 69, full: 100 },
  { metric: 'Safety', value: 91, full: 100 },
  { metric: 'Compliance', value: 85, full: 100 },
];

export const recentReports = reports.slice(0, 4);
export const recentAlerts = alerts.slice(0, 4);
