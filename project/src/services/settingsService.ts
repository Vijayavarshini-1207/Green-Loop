import { supabase } from './supabaseClient';

export async function getSettings() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.company_id) throw new Error('No company linked');

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('company_id', profile.company_id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateSettings(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateCompany(companyId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('companies')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', companyId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}
