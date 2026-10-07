import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user's company_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.company_id) {
      return new Response(JSON.stringify({ error: "No company linked" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { energy = 10, carbon = 15, water = 28, recycling = 15, renewable = 23 } = body;

    // --- Business logic: calculate sustainability score ---
    // Base score from latest analytics
    const { data: latest } = await supabase
      .from("analytics")
      .select("sustainability")
      .eq("company_id", profile.company_id)
      .eq("period", "monthly")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const baseScore = latest?.sustainability ?? 78;
    const score = Math.min(
      100,
      Math.round(
        baseScore +
          energy * 0.2 +
          carbon * 0.25 +
          water * 0.15 +
          recycling * 0.1 +
          renewable * 0.15,
      ),
    );

    // --- Calculate footprints ---
    // Latest month's carbon/water/energy from analytics
    const { data: latestMetrics } = await supabase
      .from("analytics")
      .select("carbon, water, energy")
      .eq("company_id", profile.company_id)
      .eq("period", "monthly")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const baseCarbon = latestMetrics?.carbon ?? 1340;
    const baseWater = latestMetrics?.water ?? 8600;
    const baseEnergy = latestMetrics?.energy ?? 760;

    const carbonFootprint = Math.max(0, Math.round(baseCarbon * (1 - carbon / 100 - renewable * 0.005)));
    const waterFootprint = Math.max(0, Math.round(baseWater * (1 - water / 100)));
    const energyFootprint = Math.max(0, Math.round(baseEnergy * (1 - energy / 100 - renewable * 0.003)));

    // --- AI recommendation ---
    let recommendation: string;
    if (score > 92) {
      recommendation = "Excellent configuration! You are approaching net-zero operations. Focus on maintaining these levels.";
    } else if (score > 85) {
      recommendation = "Strong sustainability profile. Expanding tailings reuse could push you into the top tier.";
    } else if (renewable < 30) {
      recommendation = "Renewable energy is your biggest opportunity. Increasing solar capacity to 40%+ yields the highest score gain.";
    } else if (water < 40) {
      recommendation = "Water recycling is below target. Expanding the treatment loop to 40%+ is the highest-leverage action.";
    } else {
      recommendation = "Balanced improvements across all metrics. Consider carbon offset projects for the final push.";
    }

    return new Response(
      JSON.stringify({
        score,
        carbonFootprint,
        waterFootprint,
        energyFootprint,
        recommendation,
        inputs: { energy, carbon, water, recycling, renewable },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
