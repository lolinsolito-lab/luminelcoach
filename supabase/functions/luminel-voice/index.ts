// supabase/functions/luminel-voice/index.ts
// DEPLOY: supabase functions deploy luminel-voice
// SECRETS: ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID
//
// Questo è il "guardiano" della voce HD:
// 1. Verifica JWT → utente autenticato
// 2. Verifica piano → deve essere VIP
// 3. Verifica saldo → voice_balance_minutes > 0
// 4. Chiama ElevenLabs TTS con la voce di Michael Jara
// 5. Scala i minuti usati dal saldo nel DB
// 6. Restituisce l'audio al client

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // ── PREFLIGHT ──────────────────────────────────────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    // ── 1. AUTENTICAZIONE JWT ──────────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Non autenticato" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verifica il JWT dell'utente
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Token non valido" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // ── 2. RECUPERA PROFILO + VERIFICA PIANO ──────────────────────────────────
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

    // Solo VIP può usare la voce HD
    if (profile.plan !== "vip") {
      return new Response(
        JSON.stringify({
          error: "accesso_negato",
          message: "Il Voice Coach HD è esclusivo del piano VIP Sovereign.",
          cta: "upgrade"
        }),
        { status: 403, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Verifica saldo minuti
    const balanceMinutes = profile.voice_balance_minutes ?? 0;
    if (balanceMinutes <= 0) {
      return new Response(
        JSON.stringify({
          error: "saldo_esaurito",
          message: "Hai esaurito i tuoi minuti voce HD. Ricarica dalla Dashboard.",
          cta: "boost"
        }),
        { status: 402, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // ── 3. LEGGI IL TESTO DA SINTETIZZARE ─────────────────────────────────────
    const body = await req.json();
    const { text, session_id } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Testo mancante o non valido" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Limite sicurezza: max 2000 caratteri per chiamata (≈ 2-3 minuti audio)
    const safeText = text.trim().slice(0, 2000);

    // ── 4. CHIAMA ELEVENLABS TTS ───────────────────────────────────────────────
    const elevenLabsApiKey = Deno.env.get("ELEVENLABS_API_KEY");
    const voiceId = Deno.env.get("ELEVENLABS_VOICE_ID"); // Voice ID di Michael Jara

    if (!elevenLabsApiKey || !voiceId) {
      console.error("❌ ELEVENLABS_API_KEY o ELEVENLABS_VOICE_ID non configurati");
      return new Response(
        JSON.stringify({ error: "Servizio voce non configurato" }),
        { status: 503, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": elevenLabsApiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text: safeText,
          model_id: "eleven_multilingual_v2", // ottimale per italiano
          voice_settings: {
            stability: 0.55,        // voce stabile ma naturale
            similarity_boost: 0.85, // fedele alla voce originale
            style: 0.35,            // un tocco di espressività
            use_speaker_boost: true
          }
        })
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

    // ── 5. SCALA I MINUTI USATI ────────────────────────────────────────────────
    // Stima: ~150 parole/minuto, ~5 caratteri/parola
    const estimatedWords = safeText.length / 5;
    const estimatedMinutes = Math.ceil(estimatedWords / 150);
    const minutesToDeduct = Math.max(1, estimatedMinutes); // minimo 1 minuto

    const newBalance = Math.max(0, balanceMinutes - minutesToDeduct);

    await supabase
      .from("profiles")
      .update({
        voice_balance_minutes: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    console.log(`✅ Voice HD: utente ${user.id} | -${minutesToDeduct} min | saldo: ${newBalance} min`);

    // ── 6. RESTITUISCE L'AUDIO ─────────────────────────────────────────────────
    const audioBuffer = await elevenRes.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        ...CORS,
        "Content-Type": "audio/mpeg",
        "X-Voice-Minutes-Used": minutesToDeduct.toString(),
        "X-Voice-Balance-Remaining": newBalance.toString(),
      }
    });

  } catch (err) {
    console.error("❌ luminel-voice error:", err);
    return new Response(
      JSON.stringify({ error: "Errore interno del server" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
