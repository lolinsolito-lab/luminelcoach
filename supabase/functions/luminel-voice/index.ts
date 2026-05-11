// supabase/functions/luminel-voice/index.ts
// DEPLOY: supabase functions deploy luminel-voice
// SECRETS RICHIESTI: ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID
//
// Guardiano della voce HD Luminel.
// MATRICE ACCESSO:
//   Free / Starter → mai voce live (trailer statico nel client)
//   Premium        → voce live se voice_balance_minutes > 0 (30 min/mese inclusi + Boost)
//   VIP / Elite    → voce live sempre, saldo non decrementato (piano include 120 min/mese)
// ═══════════════════════════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_TEXT_LENGTH = 2000; // ~2-3 minuti di audio

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // ── 1. AUTENTICAZIONE JWT ────────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Non autenticato" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Token non valido" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // ── 2. RECUPERA PROFILO ──────────────────────────────────────────────────
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan, voice_balance_minutes")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Profilo non trovato" }),
        { status: 404, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const isVip     = profile.plan === "vip" || profile.plan === "elite";
    const isPremium = profile.plan === "premium";
    const balanceMinutes = profile.voice_balance_minutes ?? 0;

    // ── 3. MATRICE ACCESSO VOCE ──────────────────────────────────────────────
    // Free / Starter → mai voce live (neanche con boost acquistato per errore)
    // Premium        → voce live se balance > 0 (30 min/mese refreshati + Boost)
    // VIP / Elite    → voce live sempre (saldo non decrementato)
    if (!isVip && !isPremium) {
      return new Response(
        JSON.stringify({
          error: "accesso_negato",
          message: "Il Voice Coach live e' disponibile dal piano Premium. Scopri i piani su /plans.",
          cta: "upgrade",
        }),
        { status: 403, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    if (isPremium && balanceMinutes <= 0) {
      return new Response(
        JSON.stringify({
          error: "saldo_esaurito",
          message: "Hai esaurito i tuoi 30 minuti voce del mese. Ricarica con un Voice Boost o passa a VIP per 120 min/mese con la voce di Michael Jara.",
          cta: "boost",
        }),
        { status: 402, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // ── 4. LEGGI IL TESTO ────────────────────────────────────────────────────
    const body = await req.json();
    const { text, session_id } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Testo mancante o non valido" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const safeText = text.trim().slice(0, MAX_TEXT_LENGTH);

    // ── 5. CHIAMA ELEVENLABS TTS ─────────────────────────────────────────────
    const elevenLabsApiKey = Deno.env.get("ELEVENLABS_API_KEY");
    // VIP ottiene la voce clonata di Michael Jara, Premium una voce standard italiana
    const voiceId = isVip
      ? Deno.env.get("ELEVENLABS_VOICE_ID")        // voce Michael Jara (clonata)
      : Deno.env.get("ELEVENLABS_VOICE_ID_STANDARD"); // voce standard italiana

    if (!elevenLabsApiKey || !voiceId) {
      console.error("❌ ELEVENLABS_API_KEY o VOICE_ID non configurati");
      return new Response(
        JSON.stringify({ error: "Servizio voce non configurato" }),
        { status: 503, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const elevenRes = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/" + voiceId,
      {
        method: "POST",
        headers: {
          "xi-api-key": elevenLabsApiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: safeText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: isVip ? 0.55 : 0.65,
            similarity_boost: isVip ? 0.85 : 0.75,
            style: isVip ? 0.35 : 0.20,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error("❌ ElevenLabs error:", elevenRes.status, errText);
      return new Response(
        JSON.stringify({ error: "Errore sintesi vocale", detail: errText }),
        { status: 502, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const audioBuffer = await elevenRes.arrayBuffer();

    // ── 6. CALCOLA MINUTI USATI ──────────────────────────────────────────────
    const audioBytes = audioBuffer.byteLength;
    const estimatedSeconds = audioBytes > 0
      ? Math.ceil(audioBytes / 16000)
      : Math.ceil(safeText.length / 5 / 150 * 60);

    const minutesUsed = Math.max(1, Math.ceil(estimatedSeconds / 60));

    // ── 7. SCALA I MINUTI ────────────────────────────────────────────────────
    // VIP/Elite: piano include minuti → non decrementa saldo
    // Premium: decrementa da voice_balance_minutes (30/mese + eventuali Boost)
    let newBalance = balanceMinutes;

    if (!isVip) {
      newBalance = Math.max(0, balanceMinutes - minutesUsed);
      await supabase
        .from("profiles")
        .update({
          voice_balance_minutes: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    // ── 8. LOG UTILIZZO (non bloccante) ─────────────────────────────────────
    await supabase.from("voice_usage_logs").insert({
      user_id:         user.id,
      session_id:      session_id ?? null,
      plan:            profile.plan,
      minutes_used:    minutesUsed,
      characters_sent: safeText.length,
      audio_bytes:     audioBytes,
      balance_after:   isVip ? null : newBalance,
      source:          isVip ? "plan_included" : "premium_or_boost",
      created_at:      new Date().toISOString(),
    }).then(({ error }) => {
      if (error) console.warn("⚠️ voice_usage_logs insert failed:", error.message);
    });

    console.log(
      "✅ Voice: utente " + user.id +
      " | piano " + profile.plan +
      " | -" + minutesUsed + " min" +
      " | saldo: " + (isVip ? "illimitato" : newBalance + " min") +
      " | audio: " + Math.round(audioBytes / 1024) + " KB"
    );

    // ── 9. RESTITUISCE L'AUDIO ───────────────────────────────────────────────
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        ...CORS,
        "Content-Type": "audio/mpeg",
        "X-Voice-Minutes-Used": minutesUsed.toString(),
        "X-Voice-Balance-Remaining": isVip ? "unlimited" : newBalance.toString(),
        "X-Voice-Plan": profile.plan,
      },
    });
  } catch (err) {
    console.error("❌ luminel-voice error:", err);
    return new Response(
      JSON.stringify({ error: "Errore interno del server" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
