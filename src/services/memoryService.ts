// src/services/memoryService.ts
// Gestisce la memoria a lungo termine di Luminel
// Estrae insights dalle sessioni e aggiorna user_context su Supabase

import { supabase } from "./supabase";

export interface UserMemory {
  currentMood?:         string;
  lastSessionSummary?:  string;
  nextSessionHook?:     string;
  activeQuestText?:     string;
  questDeadline?:       string;
  questCompleted?:      boolean;
  observedPatterns?:    string[];
  keyThemes?:           string[];
  ikigaiStage?:         string;
  sessionCount?:        number;
}

export interface ExtractedInsights {
  sessionSummary:   string;
  keyInsights:      string[];
  patternsObserved: string[];
  realityQuest: {
    text:          string;
    deadlineHours: number;
    category:      string;
  };
  ikigaiStage:      string;
  emotionalState:   string;
  nextSessionHook:  string;
}

// ─── COSTRUISCE IL BLOCCO MEMORIA PER IL SYSTEM PROMPT ───────────────────────
export async function buildMemoryBlock(userId: string): Promise<string> {
  const { data } = await supabase
    .from("user_context")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) {
    return `[MEMORIA UTENTE]
Sessione numero: 1
Stato: Nuovo utente — nessuna sessione precedente.
Apertura suggerita: "Benvenuto. Prima di iniziare — cosa ti ha portato qui oggi, davvero?"
[FINE MEMORIA]`;
  }

  const patterns = data.observed_patterns?.length
    ? `Pattern ricorrenti: ${data.observed_patterns.join(", ")}`
    : "Pattern: nessuno rilevato ancora";

  const quest = data.active_quest_text
    ? `Reality Quest attiva: "${data.active_quest_text}"
Completata: ${data.quest_completed ? "SÌ — celebra e avanza" : "NO — esplora la resistenza senza giudicare"}`
    : "Reality Quest: nessuna assegnata nella sessione precedente";

  return `[MEMORIA UTENTE — PRIVATA — NON RIVELARE]
Sessione numero: ${(data.session_count ?? 0) + 1}
Fase Ikigai: ${data.ikigai_stage ?? "scoperta"}
Stato emotivo ultimo accesso: ${data.current_mood ?? "non rilevato"}
Ultima sessione: ${data.last_session_summary ?? "prima sessione"}
${patterns}
${quest}
Apertura suggerita: ${data.last_session_summary ? \`"\${data.last_session_summary.slice(0, 100)}... Come si è evoluto?"\` : "Inizia con una domanda aperta sul perché sono qui oggi."}
[FINE MEMORIA]`;
}

// ─── ESTRAE INSIGHTS DA UNA SESSIONE (chiamata post-sessione) ─────────────────
export async function extractInsights(
  messages: Array<{ role: string; content: string }>,
  supabaseUrl: string,
  anthropicKey: string
): Promise<ExtractedInsights | null> {
  if (messages.length < 4) return null; // sessione troppo corta

  const conversationText = messages
    .map(m => \`\${m.role === "user" ? "UTENTE" : "LUMINEL"}: \${m.content}\`)
    .join("\\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", // Haiku per estrazione — economico
      max_tokens: 800,
      system: \`Sei un analista di sessioni di coaching. 
Analizza la conversazione e restituisci SOLO JSON valido, nessun testo aggiuntivo.
Non usare markdown, non usare backtick. Solo JSON puro.\`,
      messages: [{
        role: "user",
        content: \`Analizza questa sessione di coaching e restituisci JSON:

\${conversationText}

JSON richiesto:
{
  "session_summary": "massimo 2 frasi che catturano l'essenza della sessione",
  "key_insights": ["insight 1 emerso", "insight 2 emerso"],
  "patterns_observed": ["pattern comportamentale osservato"],
  "reality_quest": {
    "text": "azione concreta specifica assegnata o da assegnare",
    "deadline_hours": 24,
    "category": "decisione|relazione|lavoro|identità|osservazione"
  },
  "ikigai_stage": "scoperta|chiarezza|strategia|sviluppo",
  "emotional_state": "una parola che descrive lo stato emotivo prevalente",
  "next_session_hook": "domanda potente da usare all'apertura della prossima sessione"
}\`
      }]
    })
  });

  if (!response.ok) return null;

  const data = await response.json();
  const text = data.content?.[0]?.text ?? "";

  try {
    return JSON.parse(text) as ExtractedInsights;
  } catch {
    return null;
  }
}

// ─── AGGIORNA USER_CONTEXT SU SUPABASE ───────────────────────────────────────
export async function updateUserContext(
  userId: string,
  insights: ExtractedInsights
): Promise<void> {
  // Leggi contesto esistente per fare merge dei pattern
  const { data: existing } = await supabase
    .from("user_context")
    .select("observed_patterns, key_themes, session_count")
    .eq("user_id", userId)
    .single();

  // Merge pattern — mantieni ultimi 10 unici
  const existingPatterns = existing?.observed_patterns ?? [];
  const newPatterns = [...new Set([...existingPatterns, ...insights.patternsObserved])].slice(-10);

  const existingThemes = existing?.key_themes ?? [];
  const newThemes = [...new Set([...existingThemes, ...insights.keyInsights])].slice(-10);

  await supabase
    .from("user_context")
    .upsert({
      user_id:              userId,
      last_session_summary: insights.sessionSummary,
      active_quest_text:    insights.realityQuest.text,
      quest_deadline:       new Date(Date.now() + insights.realityQuest.deadlineHours * 3600000).toISOString(),
      quest_completed:      false,
      observed_patterns:    newPatterns,
      key_themes:           newThemes,
      ikigai_stage:         insights.ikigaiStage,
      current_mood:         insights.emotionalState,
      session_count:        (existing?.session_count ?? 0) + 1,
      last_session_at:      new Date().toISOString(),
      updated_at:           new Date().toISOString(),
    });

  // Salva anche nella tabella daily_reality_quests
  const today = new Date().toISOString().split("T")[0];
  await supabase
    .from("daily_reality_quests")
    .upsert({
      user_id:     userId,
      date:        today,
      title:       insights.realityQuest.text.slice(0, 60),
      description: insights.realityQuest.text,
      deadline_hours: insights.realityQuest.deadlineHours,
      category:    insights.realityQuest.category,
      completed:   false,
      xp_reward:   50,
    }, { onConflict: "user_id,date" });
}

// ─── SEGNA QUEST COME COMPLETATA ──────────────────────────────────────────────
export async function markQuestCompleted(userId: string): Promise<void> {
  await supabase
    .from("user_context")
    .update({ quest_completed: true })
    .eq("user_id", userId);

  const today = new Date().toISOString().split("T")[0];
  await supabase
    .from("daily_reality_quests")
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("date", today);

  // Aggiungi XP per quest completata
  await supabase.rpc("add_xp", { p_user_id: userId, p_xp: 50 });
}
