// src/services/councilService.ts
// Il Consiglio degli Archetipi — esclusivo VIP Sovereign
// 4 chiamate Claude parallele con personalità distinte

import { supabase } from "./supabase";

export interface ArchetypeResponse {
  archetype: "alchimista" | "stratega" | "guerriero" | "sovrano";
  name:      string;
  color:     string;
  icon:      string;
  response:  string;
}

export interface CouncilResult {
  problem:    string;
  responses:  ArchetypeResponse[];
  synthesis:  string;
  realityQuest: string;
}

// ─── PERSONALITÀ DEGLI ARCHETIPI ──────────────────────────────────────────────
const ARCHETYPES = {
  alchimista: {
    name:  "L'Alchimista",
    color: "#9B74E0",
    icon:  "🜔",
    system: \`Sei L'Alchimista del Consiglio di Luminel.
Il tuo dominio: trasformazione, emozioni, ombra, creatività, paradosso.
Tono: misterioso, poetico, provocatorio con gentilezza. Mai cinico.
Approccio: trova la risorsa nascosta nell'ostacolo. Trasforma il problema.
Vedi il significato profondo dove gli altri vedono solo il problema superficiale.
Parli per metafore e domande filosofiche.
NON fare: piani pratici, liste, step-by-step, consigli diretti.
Risposta: max 4 frasi. Inizia con un'osservazione inaspettata.\`,
  },
  stratega: {
    name:  "Lo Stratega",
    color: "#4A9ED4",
    icon:  "♟",
    system: \`Sei Lo Stratega del Consiglio di Luminel.
Il tuo dominio: logica, analisi, scacchiera, risorse, piano, ROI.
Tono: freddo, preciso, implacabile ma non cinico. Dati prima delle emozioni.
Approccio: analisi obiettiva → 3 mosse concrete. Elimina il superfluo.
Vedi la realtà come una scacchiera e calcoli le mosse a 10 passi.
Puoi contraddire gli altri archetipi se la logica lo richiede.
NON fare: conforto emotivo, spiritualità, vaghezze.
Risposta: max 4 frasi. Inizia con "Analizziamo:" o un dato concreto.\`,
  },
  guerriero: {
    name:  "Il Guerriero",
    color: "#D4603A",
    icon:  "⚔",
    system: \`Sei Il Guerriero del Consiglio di Luminel.
Il tuo dominio: coraggio, disciplina, azione immediata, eliminazione delle scuse.
Tono: diretto, senza filtri, energico, a volte provocatorio.
Approccio: taglia le elaborazioni infinite. Chiede l'azione ADESSO.
Non hai pazienza per l'analisi paralisi. La paura si supera agendo, non pensando.
Puoi essere duro ma mai cattivo — vuoi il meglio per l'utente.
NON fare: empatia profonda, pianificazione a lungo termine, filosofia.
Risposta: max 4 frasi. Inizia con un'azione o una sfida diretta.\`,
  },
  sovrano: {
    name:  "Il Sovrano",
    color: "#C9A84C",
    icon:  "♛",
    system: \`Sei Il Sovrano del Consiglio di Luminel.
Il tuo dominio: visione a lungo termine, leadership, eredità, confini, equilibrio.
Tono: calmo, autorevole, perspicace. Parla come chi ha già vissuto mille battaglie.
Approccio: vedi i prossimi 10 anni. Ogni decisione oggi è un mattone dell'eredità.
Non ti agiti per le urgenze — sai distinguere l'urgente dall'importante.
Puoi sintetizzare e trascendere i punti degli altri archetipi.
NON fare: dettagli tattici, urgenza immediata, emozioni superficiali.
Risposta: max 4 frasi. Inizia con una prospettiva temporale lunga.\`,
  },
} as const;

// ─── CHIAMA UN SINGOLO ARCHETIPO ───────────────────────────────────────────────
async function callArchetype(
  archetype: keyof typeof ARCHETYPES,
  problem: string,
  previousResponses: string,
  anthropicKey: string
): Promise<string> {
  const cfg = ARCHETYPES[archetype];

  const contextPrompt = previousResponses
    ? \`Gli altri archetipi hanno già risposto:\\n\${previousResponses}\\n\\nOra rispondi tu, puoi concordare o dissentire.\`
    : "Sei il primo a rispondere.";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-6", // Opus per il Consiglio — massima qualità
      max_tokens: 300,
      system: cfg.system,
      messages: [{
        role: "user",
        content: \`Problema sottoposto al Consiglio:\\n"\${problem}"\\n\\n\${contextPrompt}\\n\\nRispondi come \${cfg.name} in max 4 frasi.\`
      }]
    })
  });

  if (!response.ok) throw new Error(\`\${archetype} API error\`);
  const data = await response.json();
  return data.content?.[0]?.text ?? "";
}

// ─── SINTESI DI LUMINEL ────────────────────────────────────────────────────────
async function synthesizeCouncil(
  problem: string,
  responses: ArchetypeResponse[],
  anthropicKey: string
): Promise<{ synthesis: string; realityQuest: string }> {
  const councilText = responses
    .map(r => \`\${r.name}: "\${r.response}"\`)
    .join("\\n\\n");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-6",
      max_tokens: 400,
      system: \`Sei Luminel — il moderatore del Consiglio degli Archetipi.
Dopo che i 4 archetipi hanno parlato, sintetizzi la saggezza collettiva.
Tono: Dark Luxury. Profondo, calmo, autorevole.
La tua sintesi deve:
1. Trovare il punto di accordo profondo (non superficiale)
2. Nominare la tensione creativa più utile tra gli archetipi
3. Assegnare UNA Reality Quest concreta e misurabile
Stile: 3-4 frasi di sintesi + 1 Reality Quest con scadenza.\`,
      messages: [{
        role: "user",
        content: \`Problema: "\${problem}"

Il Consiglio ha parlato:
\${councilText}

Sintetizza e assegna la Reality Quest finale.
Formato risposta:
SINTESI: [3-4 frasi]
REALITY QUEST: [azione concreta con scadenza]\`
      }]
    })
  });

  if (!response.ok) throw new Error("Synthesis API error");
  const data = await response.json();
  const text = data.content?.[0]?.text ?? "";

  const synthMatch = text.match(/SINTESI:\\s*([\\s\\S]*?)(?=REALITY QUEST:|$)/);
  const questMatch = text.match(/REALITY QUEST:\\s*([\\s\\S]*?)$/);

  return {
    synthesis:    synthMatch?.[1]?.trim() ?? text,
    realityQuest: questMatch?.[1]?.trim() ?? "",
  };
}

// ─── FUNZIONE PRINCIPALE: ESEGUI IL CONSIGLIO ─────────────────────────────────
export async function runCouncilDebate(
  problem: string,
  userId: string,
  anthropicKey: string
): Promise<CouncilResult> {

  const responses: ArchetypeResponse[] = [];
  let previousText = "";

  // Chiama i 4 archetipi in sequenza (non parallelo — ognuno legge il precedente)
  for (const key of ["alchimista", "stratega", "guerriero", "sovrano"] as const) {
    const cfg = ARCHETYPES[key];
    const text = await callArchetype(key, problem, previousText, anthropicKey);

    responses.push({
      archetype: key,
      name:      cfg.name,
      color:     cfg.color,
      icon:      cfg.icon,
      response:  text,
    });

    previousText += \`\${cfg.name}: "\${text}"\\n\\n\`;
  }

  // Luminel sintetizza
  const { synthesis, realityQuest } = await synthesizeCouncil(problem, responses, anthropicKey);

  // Salva su Supabase
  await supabase.from("council_sessions").insert({
    user_id:              userId,
    problem_text:         problem,
    alchimista_response:  responses[0].response,
    stratega_response:    responses[1].response,
    guerriero_response:   responses[2].response,
    sovrano_response:     responses[3].response,
    master_plan:          synthesis,
    reality_quest:        realityQuest,
  });

  // Aggiorna user_context con la quest del Consiglio
  await supabase.from("user_context").upsert({
    user_id:           userId,
    active_quest_text: realityQuest,
    quest_deadline:    new Date(Date.now() + 48 * 3600000).toISOString(),
    quest_completed:   false,
    updated_at:        new Date().toISOString(),
  });

  return { problem, responses, synthesis, realityQuest };
}
