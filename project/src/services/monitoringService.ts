import { supabase } from './supabaseClient';

export async function getSensorData() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.company_id) throw new Error('No company linked');

  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .eq('company_id', profile.company_id)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateSensorValue(id: string, value: number, history: number[]) {
  const { data, error } = await supabase
    .from('sensor_data')
    .update({ value, history, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getEquipment() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.company_id) throw new Error('No company linked');

  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('company_id', profile.company_id)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}
