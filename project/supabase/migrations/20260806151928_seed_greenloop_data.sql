/*
# GreenLoop — Seed Demo Data

## Overview
Inserts a demo company (TerraForge Minerals) and all associated data: sensor readings, equipment, digital twin components, alerts, reports, analytics, recommendations, and settings. Also creates a trigger to auto-link new sign-ups to this demo company and auto-create a profile row.

## Data Inserted
1. **companies** — TerraForge Minerals Ltd. (Kolar, Karnataka, India)
2. **sensor_data** — 8 sensor readings (temperature, humidity, CO2, water flow, power, boiler pressure, vibration, stack emission)
3. **equipment** — 4 machines (crusher, conveyor, boiler, stack)
4. **digital_twin** — 7 plant components with positions and AI predictions
5. **alerts** — 8 alerts across critical/warning/information severities
6. **reports** — 7 reports (daily/weekly/monthly/quarterly/annual)
7. **analytics** — 12 monthly + 8 weekly + 4 quarterly data points
8. **recommendations** — 8 AI recommendations
9. **settings** — default settings row for the company

## Security
- Uses a SECURITY DEFINER function to insert seed data (bypasses RLS for setup only)
- Auto-profile trigger links new auth.users to the demo company on signup
*/

-- Insert demo company (idempotent)
INSERT INTO companies (id, name, industry, location, email, phone, established, employees)
SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TerraForge Minerals Ltd.', 'Mining & Metallurgy', 'Kolar, Karnataka, India', 'ops@terraforminerals.in', '+91 80 4567 8900', '1998', '2,400'
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE email = 'ops@terraforminerals.in');

-- Insert default settings for the company
INSERT INTO settings (company_id)
SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE company_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Seed sensor data using a SECURITY DEFINER function (bypasses RLS)
CREATE OR REPLACE FUNCTION seed_greenloop_data()
RETURNS void AS $$
DECLARE
  cid uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid;
BEGIN
  -- Sensor data
  INSERT INTO sensor_data (company_id, label, value, unit, status, change, history)
  VALUES
    (cid, 'Crusher Temperature', 72, '°C', 'normal', -2, '[68,70,71,69,72,70,72]'),
    (cid, 'Humidity', 54, '%', 'normal', 3, '[48,50,52,51,53,54,54]'),
    (cid, 'CO₂ Emission', 412, 'ppm', 'warning', 8, '[398,402,405,408,410,411,412]'),
    (cid, 'Water Flow', 320, 'L/min', 'normal', -5, '[330,328,325,322,320,321,320]'),
    (cid, 'Power Load', 845, 'kW', 'warning', 12, '[810,820,830,835,840,842,845]'),
    (cid, 'Boiler Pressure', 14.2, 'bar', 'normal', 0, '[14,14.1,14.2,14.1,14.2,14.2,14.2]'),
    (cid, 'Vibration', 4.8, 'mm/s', 'critical', 15, '[3.2,3.5,3.8,4.1,4.4,4.6,4.8]'),
    (cid, 'Stack Emission', 78, 'mg/Nm³', 'normal', -3, '[82,80,79,78,77,78,78]')
  ON CONFLICT DO NOTHING;

  -- Equipment
  INSERT INTO equipment (company_id, name, type, health_score, status, temperature, carbon, water, energy)
  VALUES
    (cid, 'Primary Crusher', 'crusher', 88, 'operational', 72, 182, 12, 245),
    (cid, 'Conveyor Belt A', 'conveyor', 91, 'operational', 54, 64, 0, 88),
    (cid, 'Boiler Unit 2', 'boiler', 76, 'maintenance', 89, 245, 60, 310),
    (cid, 'Emission Stack', 'stack', 79, 'critical', 112, 198, 0, 12)
  ON CONFLICT DO NOTHING;

  -- Digital twin components
  INSERT INTO digital_twin (company_id, name, type, pos_x, pos_y, health, temperature, carbon, water, energy, risk, prediction, status)
  VALUES
    (cid, 'Primary Crusher', 'crusher', 12, 62, 88, 72, 182, 12, 245, 'low', 'Optimal throughput expected for 14h', 'operational'),
    (cid, 'Conveyor Belt A', 'conveyor', 38, 58, 91, 54, 64, 0, 88, 'low', 'Belt wear within tolerance', 'operational'),
    (cid, 'Processing Plant', 'processing', 58, 45, 84, 68, 312, 180, 420, 'medium', 'Reagent efficiency dropping 2%/day', 'operational'),
    (cid, 'Boiler Unit 2', 'boiler', 80, 38, 76, 89, 245, 60, 310, 'medium', 'Scale buildup detected — service in 6 days', 'maintenance'),
    (cid, 'Water Treatment Tank', 'watertank', 32, 30, 93, 28, 8, 320, 22, 'low', 'Recycling rate at 28%', 'operational'),
    (cid, 'Energy Unit', 'energy', 12, 28, 82, 45, 410, 4, 845, 'medium', 'Solar contributing 23% — increase recommended', 'operational'),
    (cid, 'Emission Stack', 'stack', 88, 62, 79, 112, 198, 0, 12, 'high', 'Particulate rising — filter replacement due', 'critical')
  ON CONFLICT DO NOTHING;

  -- Alerts
  INSERT INTO alerts (company_id, title, description, severity, source, status)
  VALUES
    (cid, 'Vibration threshold exceeded', 'Primary crusher vibration at 4.8 mm/s, above 4.0 mm/s safe limit. Bearing wear suspected.', 'critical', 'Crusher Sensor #C-12', 'active'),
    (cid, 'CO₂ emission trending up', 'Stack CO₂ concentration rose 8 ppm in 30 minutes. Investigate fuel mix.', 'warning', 'Emission Stack', 'active'),
    (cid, 'Power load above baseline', 'Power draw at 845 kW vs 800 kW baseline. Possible motor inefficiency.', 'warning', 'Energy Unit', 'acknowledged'),
    (cid, 'Boiler service scheduled', 'Boiler Unit 2 scale buildup at 1.8 mm. Maintenance window booked for Aug 12.', 'information', 'Boiler Unit 2', 'active'),
    (cid, 'Water recycling rate improved', 'Recycled water share rose to 28%, up from 24% last week.', 'information', 'Water Treatment Tank', 'resolved'),
    (cid, 'Conveyor belt misalignment', 'Conveyor Belt A tracking 3mm off-center. Auto-correction engaged.', 'warning', 'Conveyor Belt A', 'resolved'),
    (cid, 'Stack particulate rising', 'Particulate at 78 mg/Nm³, filter efficiency degrading. Replacement recommended.', 'critical', 'Emission Stack', 'active'),
    (cid, 'Solar generation peak', 'Solar contribution hit 23% between 11:00–13:00, best this quarter.', 'information', 'Energy Unit', 'resolved')
  ON CONFLICT DO NOTHING;

  -- Reports
  INSERT INTO reports (company_id, name, type, report_date, file_size, status, author)
  VALUES
    (cid, 'August Monthly LCA Report', 'Monthly', 'Aug 01, 2026', '4.2 MB', 'Ready', 'System'),
    (cid, 'Week 31 Sustainability Summary', 'Weekly', 'Jul 28, 2026', '1.8 MB', 'Ready', 'A. Sharma'),
    (cid, 'Q2 Carbon Footprint Report', 'Quarterly', 'Jul 15, 2026', '6.7 MB', 'Ready', 'System'),
    (cid, 'Daily Emissions Log — Jul 14', 'Daily', 'Jul 14, 2026', '0.9 MB', 'Ready', 'System'),
    (cid, 'Annual Sustainability Report 2025', 'Annual', 'Jan 10, 2026', '12.4 MB', 'Ready', 'M. Iyer'),
    (cid, 'Water Audit Report', 'Monthly', 'Aug 06, 2026', '—', 'Generating', 'System'),
    (cid, 'Q3 Energy Efficiency Report', 'Quarterly', 'Sep 30, 2026', '—', 'Scheduled', 'System')
  ON CONFLICT DO NOTHING;

  -- Analytics: monthly (12 months)
  INSERT INTO analytics (company_id, period, label, carbon, water, energy, sustainability)
  VALUES
    (cid, 'monthly', 'Jan', 1820, 12400, 980, 71),
    (cid, 'monthly', 'Feb', 1750, 11800, 945, 73),
    (cid, 'monthly', 'Mar', 1690, 11200, 910, 74),
    (cid, 'monthly', 'Apr', 1720, 11500, 930, 73),
    (cid, 'monthly', 'May', 1640, 10800, 890, 75),
    (cid, 'monthly', 'Jun', 1580, 10200, 860, 76),
    (cid, 'monthly', 'Jul', 1510, 9800, 830, 77),
    (cid, 'monthly', 'Aug', 1450, 9400, 805, 78),
    (cid, 'monthly', 'Sep', 1490, 9600, 820, 77),
    (cid, 'monthly', 'Oct', 1420, 9100, 790, 79),
    (cid, 'monthly', 'Nov', 1380, 8900, 775, 80),
    (cid, 'monthly', 'Dec', 1340, 8600, 760, 81)
  ON CONFLICT DO NOTHING;

  -- Analytics: weekly (8 weeks)
  INSERT INTO analytics (company_id, period, label, carbon, water, energy, sustainability)
  VALUES
    (cid, 'weekly', 'W1', 1820, 12400, 980, 71),
    (cid, 'weekly', 'W2', 1750, 11800, 945, 73),
    (cid, 'weekly', 'W3', 1690, 11200, 910, 74),
    (cid, 'weekly', 'W4', 1720, 11500, 930, 73),
    (cid, 'weekly', 'W5', 1640, 10800, 890, 75),
    (cid, 'weekly', 'W6', 1580, 10200, 860, 76),
    (cid, 'weekly', 'W7', 1510, 9800, 830, 77),
    (cid, 'weekly', 'W8', 1450, 9400, 805, 78)
  ON CONFLICT DO NOTHING;

  -- Analytics: quarterly (4 quarters)
  INSERT INTO analytics (company_id, period, label, carbon, water, energy, sustainability)
  VALUES
    (cid, 'quarterly', 'Q1', 5260, 35400, 2835, 73),
    (cid, 'quarterly', 'Q2', 4940, 32500, 2680, 75),
    (cid, 'quarterly', 'Q3', 4350, 28400, 2415, 78),
    (cid, 'quarterly', 'Q4', 4140, 26600, 2335, 80)
  ON CONFLICT DO NOTHING;

  -- Recommendations
  INSERT INTO recommendations (company_id, title, description, impact, category, saving)
  VALUES
    (cid, 'Shift boiler load to off-peak', 'Moving Boiler Unit 2 operation to 23:00–05:00 reduces grid carbon intensity by 18% and cuts energy cost.', 'high', 'energy', '₹3.2L / month'),
    (cid, 'Install variable frequency drives', 'Retrofitting crusher motors with VFDs can cut energy draw by 12–15% under partial load.', 'high', 'energy', '₹2.1L / month'),
    (cid, 'Expand water recycling loop', 'Routing processing plant discharge through the treatment tank raises recycling from 28% to 41%.', 'high', 'water', '1,400 L/day'),
    (cid, 'Replace stack filter cartridges', 'Current particulate efficiency at 79%. New cartridges restore it to 96% and avoid regulatory risk.', 'high', 'carbon', '22% PM reduction'),
    (cid, 'Recover tailings as aggregate', 'Crushed tailings can replace 15% of purchased aggregate in concrete backfill — circular economy win.', 'medium', 'circular', '₹1.8L / month'),
    (cid, 'Solar capacity expansion', 'Adding 200 kWp solar cuts grid dependence by ~9% and offsets 310 tCO₂/year.', 'medium', 'carbon', '310 tCO₂/yr'),
    (cid, 'Condensate recovery in boiler', 'Recovering condensate saves 8% of feedwater and 4% of boiler fuel.', 'low', 'water', '180 L/day'),
    (cid, 'Predictive maintenance schedule', 'AI model predicts crusher bearing failure in 11 days. Schedule proactive replacement.', 'high', 'energy', '14h downtime avoided')
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT seed_greenloop_data();

-- Auto-create profile + link to demo company on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, company_id, full_name, role)
  VALUES (
    NEW.id,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'Plant Operations Manager'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
