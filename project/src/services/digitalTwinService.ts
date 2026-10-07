import { supabase } from './supabaseClient';

export async function getDigitalTwin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.company_id) throw new Error('No company linked');

  const { data, error } = await supabase
    .from('digital_twin')
    .select('*')
    .eq('company_id', profile.company_id)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}
