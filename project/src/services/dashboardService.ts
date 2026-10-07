import { supabase } from './supabaseClient';

export async function getDashboardStats() {
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, full_name, role')
    .eq('id', (await supabase.auth.getUser()).data.user?.id)
    .maybeSingle();

  if (!profile?.company_id) throw new Error('No company linked');

  const companyId = profile.company_id;

  const [company, analytics, alerts, reports, recommendations, sensors] = await Promise.all([
    supabase.from('companies').select('*').eq('id', companyId).maybeSingle(),
    supabase.from('analytics').select('*').eq('company_id', companyId).eq('period', 'monthly').order('created_at', { ascending: true }),
    supabase.from('alerts').select('*').eq('company_id', companyId).order('created_at', { ascending: false }).limit(4),
    supabase.from('reports').select('*').eq('company_id', companyId).order('created_at', { ascending: false }).limit(4),
    supabase.from('recommendations').select('*').eq('company_id', companyId).order('created_at', { ascending: false }).limit(4),
    supabase.from('sensor_data').select('*').eq('company_id', companyId).order('created_at', { ascending: false }),
  ]);

  if (company.error) throw company.error;

  const monthlyAnalytics = analytics.data ?? [];
  const latest = monthlyAnalytics[monthlyAnalytics.length - 1];
  const previous = monthlyAnalytics[monthlyAnalytics.length - 2];

  const sustainabilityScore = latest?.sustainability ?? 78;
  const carbonChange = previous ? ((latest.carbon - previous.carbon) / previous.carbon) * 100 : 0;
  const waterChange = previous ? ((latest.water - previous.water) / previous.water) * 100 : 0;
  const energyChange = previous ? ((latest.energy - previous.energy) / previous.energy) * 100 : 0;

  // Plant health: average of equipment health scores
  const { data: equipment } = await supabase
    .from('equipment')
    .select('health_score')
    .eq('company_id', companyId);
  const plantHealth = equipment && equipment.length > 0
    ? Math.round(equipment.reduce((sum, e) => sum + e.health_score, 0) / equipment.length)
    : 86;

  return {
    company: company.data,
    profile,
    sustainabilityScore,
    plantHealth,
    monthlyTrend: monthlyAnalytics.map((a: { label: string; carbon: number; water: number; energy: number; sustainability: number }) => ({
      name: a.label,
      carbon: a.carbon,
      water: a.water,
      energy: a.energy,
      sustainability: a.sustainability,
    })),
    latestMetrics: {
      carbon: latest?.carbon ?? 1340,
      water: latest?.water ?? 8600,
      energy: latest?.energy ?? 760,
      carbonChange: Math.round(carbonChange),
      waterChange: Math.round(waterChange),
      energyChange: Math.round(energyChange),
    },
    alerts: alerts.data ?? [],
    reports: reports.data ?? [],
    recommendations: recommendations.data ?? [],
    sensors: sensors.data ?? [],
  };
}
