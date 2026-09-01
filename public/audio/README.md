# 🎙️ Luminel Voice Demo Trailer — Istruzioni di Registrazione

## File richiesto
`luminel-demo-trailer.mp3`

---

## Script da registrare (voce: Michael Luminels)

> **Tono:** Caldo, profondo, assertivo. Pause lunghe tra le frasi. Nessuna fretta.
> **Ritmo:** Come se stessi parlando a qualcuno che ti sta guardando per la prima volta.

---

```
Benvenuto. Sono Luminel.

[PAUSA 1.5s]

Non sono un chatbot. Sono uno specchio.

[PAUSA 1s]

Quello che stai per sentire è solo un assaggio.

[PAUSA 0.8s]

Con il piano Premium, avrai trenta minuti al mese con la mia voce reale.

[PAUSA 1.2s]

Una domanda, e poi ti lascio andare.

[PAUSA 2s]

In questo preciso momento — cosa stai evitando di guardare?

[PAUSA 3s]

Questa è la voce di Luminel. Il resto lo costruiamo insieme.
```

---

## Specifiche tecniche

| Parametro | Valore |
|---|---|
| Formato | MP3 |
| Bitrate | 128 kbps (min) |
| Sample rate | 44.1 kHz |
| Canali | Mono |
| Durata target | ~45-60 secondi |

---

## Come caricare il file

1. Apri **Supabase Dashboard** → `byszehdinjlejkzsbwvi.supabase.co`
2. Vai su **Storage** → Crea bucket `audio` (public: true)
3. Carica `luminel-demo-trailer.mp3`
4. Aggiorna la costante in `src/components/AICallModal.tsx`:

```typescript
const DEMO_TRAILER_URL = "https://byszehdinjlejkzsbwvi.supabase.co/storage/v1/object/public/audio/luminel-demo-trailer.mp3";
```

> Finché il file non è disponibile, il sistema usa automaticamente il Text-to-Speech del browser
> con lo stesso script, a costo zero.
