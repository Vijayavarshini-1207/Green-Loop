import { supabase } from './supabaseClient';
import { updatePassword as updateAuthPassword } from './authService';

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, companies(*)')
    .eq('id', user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: profile?.full_name ?? '',
    role: profile?.role ?? '',
    phone: profile?.phone ?? '',
    avatarUrl: profile?.avatar_url ?? '',
    company: profile?.companies ?? null,
  };
}

export async function updateProfile(updates: { full_name?: string; phone?: string }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function changePassword(newPassword: string) {
  return updateAuthPassword(newPassword);
}
