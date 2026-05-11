// supabase/functions/luminel-voice/index.ts
// DEPLOY: supabase functions deploy luminel-voice
// SECRETS RICHIESTI: ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID
//
// Guardiano della voce HD Luminel.
// Flusso:
// 1. Verifica JWT → utente autenticato
// 2. Verifica accesso → VIP (illimitato base) OPPURE voice_balance_minutes > 0 (Boost)
// 3. Chiama ElevenLabs TTS con la voce clonata di Michael Jara
// 4. Scala i minuti usati dal saldo
// 5. Logga l'utilizzo su voice_usage_logs per analytics Admin
// 6. Restituisce l'audio MP3 al client
//
// ═══════════════════════════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VIP_MONTHLY_MINUTES = 9999;
const MAX_TEXT_LENGTH = 2000;

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

    const isVip = profile.plan === "vip" || profile.plan === "elite";
    const balanceMinutes = profile.voice_balance_minutes ?? 0;

    // ── 3. VERIFICA ACCESSO ──────────────────────────────────────────────────
    // Accesso consentito se:
    //   a) Piano VIP/Elite (minuti inclusi nel piano, non scalati)
    //   b) Qualsiasi piano con voice_balance_minutes > 0 (Voice Boost acquistato)
    if (!isVip && balanceMinutes <= 0) {
      return new Response(
        JSON.stringify({
          error: "accesso_negato",
          message: "Il Voice Coach HD e' disponibile per VIP Sovereign o con Voice Boosts.",
          cta: "upgrade",
        }),
        { status: 403, headers: { ...CORS, "Content-Type": "application/json" } }
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
    const voiceId = Deno.env.get("ELEVENLABS_VOICE_ID");

    if (!elevenLabsApiKey || !voiceId) {
      console.error("❌ ELEVENLABS_API_KEY o ELEVENLABS_VOICE_ID non configurati");
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
            stability: 0.55,
            similarity_boost: 0.85,
            style: 0.35,
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
    // Metodo primario: durata reale da bitrate MP3 (128kbps = 16000 bytes/s)
    // Metodo fallback: stima da testo
    const audioBytes = audioBuffer.byteLength;
    const estimatedSeconds = audioBytes > 0
      ? Math.ceil(audioBytes / 16000)
      : Math.ceil(safeText.length / 5 / 150 * 60);

    const minutesUsed = Math.max(1, Math.ceil(estimatedSeconds / 60));

    // ── 7. SCALA I MINUTI ────────────────────────────────────────────────────
    // VIP/Elite: minuti inclusi nel piano → non scala dal saldo DB
    // Non-VIP con Boost: scala dal saldo acquistato
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
      source:          isVip ? "plan_included" : "boost",
      created_at:      new Date().toISOString(),
    }).then(({ error }) => {
      if (error) console.warn("⚠️ voice_usage_logs insert failed:", error.message);
    });

    console.log(
      "✅ Voice HD: utente " + user.id +
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
