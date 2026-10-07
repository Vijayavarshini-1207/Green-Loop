import { supabase } from './supabaseClient';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/what-if-simulator`;

export async function runSimulation(inputs: {
  energy: number;
  carbon: number;
  water: number;
  recycling: number;
  renewable: number;
}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(inputs),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorBody.error || `Simulation failed (${response.status})`);
  }

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data as {
    score: number;
    carbonFootprint: number;
    waterFootprint: number;
    energyFootprint: number;
    recommendation: string;
    inputs: typeof inputs;
  };
}
