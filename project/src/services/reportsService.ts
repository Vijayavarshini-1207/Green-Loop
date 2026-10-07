import { supabase } from './supabaseClient';

export async function getReports() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.company_id) throw new Error('No company linked');

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('company_id', profile.company_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function generateReport(type: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.company_id) throw new Error('No company linked');

  const reportName = `${type} Report — ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;

  const { data, error } = await supabase
    .from('reports')
    .insert({
      company_id: profile.company_id,
      name: reportName,
      type,
      report_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      file_size: '—',
      status: 'Generating',
      author: profile.full_name ?? 'System',
    })
    .select()
    .maybeSingle();

  if (error) throw error;

  // Simulate generation completion
  setTimeout(async () => {
    await supabase
      .from('reports')
      .update({ file_size: '2.1 MB', status: 'Ready', updated_at: new Date().toISOString() })
      .eq('id', data?.id);
  }, 2000);

  return data;
}
