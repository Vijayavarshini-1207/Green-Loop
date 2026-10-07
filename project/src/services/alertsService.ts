import { supabase } from './supabaseClient';

export async function getAlerts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.company_id) throw new Error('No company linked');

  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('company_id', profile.company_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function resolveAlert(id: string) {
  const { data, error } = await supabase
    .from('alerts')
    .update({ status: 'resolved', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}
