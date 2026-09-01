import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon, ScaleIcon } from '@heroicons/react/24/outline';

const DL = {
  void: '#06060F', deep: '#09091A', surface: '#0D0D20',
  glass: 'rgba(255,255,255,0.035)', glassB: 'rgba(255,255,255,0.07)',
  gold: '#C9A84C', goldDim: 'rgba(201,168,76,0.12)', goldB: 'rgba(201,168,76,0.25)',
  white: '#F0EBE0', muted: '#6A6560',
};

type Tab = 'privacy' | 'terms';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 style={{ color: DL.gold, fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, marginBottom: 12 }}>
      {title}
    </h2>
    <div style={{ color: 'rgba(240,235,224,0.75)', fontSize: 14, lineHeight: 1.9 }}>
      {children}
    </div>
  </div>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ marginBottom: 10 }}>{children}</p>
);

const Ul: React.FC<{ items: string[] }> = ({ items }) => (
  <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
    {items.map((item, i) => (
      <li key={i} style={{ marginBottom: 6, listStyleType: 'disc' }}>{item}</li>
    ))}
  </ul>
);

// ─────────────────────────────────────────────────────────────────────────────
const PrivacyContent: React.FC = () => (
  <>
    <p style={{ color: DL.muted, fontSize: 12, marginBottom: 32 }}>
      Ultimo aggiornamento: 1 Settembre 2026 · Titolare: Insolito Experiences di Michael Luminels · P.IVA in corso di registrazione
    </p>

    <Section title="1. Chi siamo e come contattarci">
      <P>
        Insolito Experiences di Michael Luminels ("Titolare") è il titolare del trattamento dei dati
        personali raccolti tramite la piattaforma LuminelCoach, accessibile all'indirizzo luminelcoach.com
        e sue sottopagine.
      </P>
      <P>Contatto DPO / Privacy: <strong style={{ color: DL.gold }}>privacy@insolito.it</strong></P>
      <P>Sede legale: Italia — Server: EU-West Frankfurt (GDPR compliant)</P>
    </Section>

    <Section title="2. Dati raccolti e finalità">
      <P>Raccogliamo e trattiamo le seguenti categorie di dati personali:</P>
      <Ul items={[
        'Dati identificativi: nome, cognome, indirizzo email (registrazione e accesso)',
        'Dati di sessione di coaching: trascrizioni delle conversazioni con il sistema AI Luminel',
        'Dati sull\'umore e benessere (Art. 9 GDPR — dati sensibili): check-in emozionali, livelli di energia, qualità del sonno',
        'Dati di assessment Ikigai: obiettivi personali, valori, passioni — raccolti durante l\'onboarding',
        'Dati di pagamento: gestiti interamente da Stripe Inc. — non conserviamo dati di carta di credito',
        'Dati tecnici: indirizzo IP, browser, sistema operativo, log di accesso (finalità di sicurezza)',
      ]} />
      <P><strong>Base giuridica:</strong> contratto (Art. 6.1.b GDPR), consenso esplicito (Art. 6.1.a e Art. 9.2.a per dati sensibili), legittimo interesse per la sicurezza (Art. 6.1.f).</P>
    </Section>

    <Section title="3. Trattamento dei dati sensibili (Art. 9 GDPR)">
      <P>
        I dati relativi al benessere emotivo e psicologico sono considerati "dati particolari" ai sensi
        dell'Art. 9 GDPR. Il loro trattamento è subordinato al tuo consenso esplicito, espresso durante
        la fase di onboarding. Puoi revocare il consenso in qualsiasi momento dalle impostazioni del profilo.
      </P>
      <P>
        <strong style={{ color: '#D4603A' }}>Importante:</strong> LuminelCoach è un servizio di sviluppo
        personale ai sensi della Legge italiana 4/2013. Non è un servizio di psicoterapia, diagnosi o
        trattamento medico. Le conversazioni con il sistema AI Luminel non sostituiscono il supporto
        di un professionista della salute mentale.
      </P>
    </Section>

    <Section title="4. Sistema di Intelligenza Artificiale (EU AI Act 2024/1689)">
      <P>
        Ai sensi dell'Art. 52 del Regolamento UE sull'Intelligenza Artificiale (EU AI Act 2024/1689),
        ti informiamo esplicitamente che:
      </P>
      <Ul items={[
        'Luminel è un sistema di intelligenza artificiale generativa (AI generativa)',
        'Le risposte di Luminel sono generate automaticamente da un modello di linguaggio di grandi dimensioni (LLM)',
        'Luminel non è una persona fisica, non è un terapeuta e non possiede coscienza',
        'Il sistema opera in conformità con le disposizioni della Legge 4/2013 sulle professioni non organizzate',
        'I contenuti generati dall\'AI sono a scopo di sviluppo personale e non costituiscono pareri legali, medici o finanziari',
      ]} />
    </Section>

    <Section title="5. Conservazione dei dati">
      <Ul items={[
        'Dati di profilo e progressi: conservati per tutta la durata del contratto + 12 mesi dalla cancellazione',
        'Trascrizioni delle sessioni AI: conservate per 24 mesi, poi anonimizzate per analisi statistiche aggregate',
        'Dati di pagamento (Stripe): secondo le policy di Stripe Inc. e normative fiscali (7 anni)',
        'Log tecnici: 90 giorni',
      ]} />
    </Section>

    <Section title="6. I tuoi diritti GDPR">
      <P>Hai il diritto di:</P>
      <Ul items={[
        'Accesso: richiedere copia di tutti i tuoi dati personali (Art. 15)',
        'Rettifica: correggere dati inesatti (Art. 16)',
        'Cancellazione ("diritto all\'oblio"): richiedere la cancellazione di tutti i tuoi dati (Art. 17)',
        'Portabilità: ricevere i tuoi dati in formato strutturato (Art. 20)',
        'Opposizione: opporti al trattamento per finalità di marketing (Art. 21)',
        'Limitazione: limitare il trattamento in determinate circostanze (Art. 18)',
        'Reclamo: presentare reclamo al Garante Privacy italiano (www.garanteprivacy.it)',
      ]} />
      <P>Per esercitare i tuoi diritti: <strong style={{ color: DL.gold }}>privacy@insolito.it</strong> — risposta entro 30 giorni.</P>
    </Section>

    <Section title="7. Trasferimenti internazionali">
      <P>
        I dati sono conservati su server in Europa (Frankfurt). Alcuni servizi terzi (Stripe, Google AI)
        potrebbero trasferire dati in USA. Tali trasferimenti avvengono in base a Clausole Contrattuali
        Standard (SCC) approvate dalla Commissione Europea.
      </P>
    </Section>
  </>
);

const TermsContent: React.FC = () => (
  <>
    <p style={{ color: DL.muted, fontSize: 12, marginBottom: 32 }}>
      Ultimo aggiornamento: 1 Settembre 2026 · Questi Termini regolano l'uso di LuminelCoach
    </p>

    <Section title="1. Accettazione dei Termini">
      <P>
        Utilizzando LuminelCoach accetti integralmente i presenti Termini di Servizio. Se non accetti,
        non puoi accedere al servizio. L'uso continuato costituisce accettazione di eventuali modifiche.
      </P>
    </Section>

    <Section title="2. Natura del Servizio">
      <P>LuminelCoach è una piattaforma di sviluppo personale che utilizza sistemi di intelligenza artificiale per:</P>
      <Ul items={[
        'Sessioni di coaching basate sul Metodo Michael Luminels e sul framework Ikigai',
        'Supporto alla crescita personale, chiarezza sugli obiettivi e azione strategica',
        'Percorsi formativi in modalità digitale',
        'Sessioni vocali con AI Coach (piani Premium e VIP)',
      ]} />
      <P>
        <strong style={{ color: '#D4603A' }}>LuminelCoach NON è:</strong> un servizio di psicoterapia,
        una piattaforma di consulenza medica, legale o finanziaria. In caso di crisi emotiva,
        contatta il Telefono Amico: 02 2327 2327 o il Telefono Azzurro: 19696.
      </P>
    </Section>

    <Section title="3. Piani e Pagamenti">
      <Ul items={[
        'Free: accesso limitato, rinnovabile gratuitamente senza impegno',
        'Starter (€9.99/mese): accesso base, 30 messaggi/giorno, 3 corsi',
        'Premium (€49/mese): accesso completo, 100 messaggi/giorno, 30 min Voice Coach/mese',
        'VIP Sovereign (€149/mese): accesso illimitato, 120 min Voice Coach Luminels/mese',
        'I Boost vocali (1h/3h/5h) sono acquisti singoli senza rinnovo automatico',
        'I prezzi Fondatore sono bloccati per tutta la vita del contratto se acquistati durante il periodo di lancio',
      ]} />
      <P>I pagamenti sono gestiti da Stripe Inc. I rimborsi sono valutati caso per caso entro 14 giorni dall'acquisto.</P>
    </Section>

    <Section title="4. Proprietà intellettuale">
      <P>
        Il Metodo Michael Luminels, i contenuti dei corsi, il sistema di prompt AI di Luminel e il brand
        "Luminel" sono proprietà esclusiva di Insolito Experiences di Michael Luminels.
        È vietata la riproduzione, distribuzione o modifica senza autorizzazione scritta.
      </P>
      <P>
        I contenuti generati durante le tue sessioni (trascrizioni, Reality Quest, Ikigai Summary)
        sono di tua proprietà. Concedi a Insolito Experiences una licenza non esclusiva per
        migliorare il servizio (in forma anonimizzata e aggregata), revocabile in qualsiasi momento.
      </P>
    </Section>

    <Section title="5. Limitazione di responsabilità">
      <P>
        LuminelCoach è fornito "così com'è". Insolito Experiences non garantisce che il servizio
        sia sempre disponibile, privo di errori o adatto a ogni esigenza specifica.
        La responsabilità massima è limitata all'importo pagato nell'ultimo mese di servizio.
      </P>
    </Section>

    <Section title="6. Legge applicabile e foro competente">
      <P>
        I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia,
        è competente il Foro di Milano, salvo diversa disposizione normativa applicabile al
        consumatore.
      </P>
    </Section>
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
const LegalPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('privacy');

  return (
    <div style={{ minHeight: '100vh', background: DL.void, color: DL.white }}>

      {/* Header */}
      <div style={{ borderBottom: `0.5px solid ${DL.glassB}`, background: DL.deep, backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, height: 60 }}>
          <button onClick={() => navigate(-1)}
            style={{ color: DL.muted, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <ArrowLeftIcon style={{ width: 16, height: 16 }} />
            Indietro
          </button>
          <div style={{ height: 16, width: 0.5, background: DL.glassB }} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: DL.white }}>Luminel · Legale</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
          {([
            { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheckIcon },
            { id: 'terms', label: 'Termini di Servizio', icon: ScaleIcon },
          ] as { id: Tab; label: string; icon: any }[]).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                background: tab === id ? DL.goldDim : DL.glass,
                border: `0.5px solid ${tab === id ? DL.goldB : DL.glassB}`,
                color: tab === id ? DL.gold : DL.muted,
              }}>
              <Icon style={{ width: 14, height: 14 }} />
              {label}
            </button>
          ))}
        </div>

        {/* Page title */}
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 400, color: DL.white, marginBottom: 8 }}>
            {tab === 'privacy' ? 'Privacy Policy' : 'Termini di Servizio'}
          </h1>
          <div style={{ width: 40, height: 0.5, background: DL.gold, marginBottom: 40 }} />
          {tab === 'privacy' ? <PrivacyContent /> : <TermsContent />}
        </motion.div>

        {/* Footer note */}
        <div style={{ marginTop: 48, padding: '20px 24px', borderRadius: 12, background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
          <p style={{ fontSize: 12, color: DL.muted, lineHeight: 1.8 }}>
            Per domande legali: <strong style={{ color: DL.gold }}>privacy@insolito.it</strong>
            {' · '}
            Insolito Experiences di Michael Luminels · Professione non organizzata ai sensi della Legge 4/2013
            {' · '}
            Consulenza professionale ai sensi del d.lgs. 206/2005 (Codice del Consumo)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
