import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<number | null>(0);

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Michael';

  const moods = [
    { emoji: '🔥', label: 'Focussato' },
    { emoji: '✨', label: 'Ispirato' },
    { emoji: '🌊', label: 'Calmo' },
    { emoji: '😤', label: 'Ansioso' },
    { emoji: '😔', label: 'Stanco' },
    { emoji: '🌑', label: 'Perso' }
  ];

  return (
    <div className="w-full h-full animate-slide-up">
      <div className="home-hdr">
        <div className="hdr-label">Luminel Daily Guidance</div>
        <div className="hdr-name">Bentornato, <em>{userName}</em></div>
      </div>
      
      <div className="section-label" style={{ marginBottom: '8px' }}>Come ti senti oggi?</div>
      <div className="mood-grid">
        {moods.map((m, idx) => (
          <div 
            key={idx} 
            className={cn("mood-chip", selectedMood === idx && "on")}
            onClick={() => setSelectedMood(idx)}
          >
            <span className="me">{m.emoji}</span>
            <span className="ml">{m.label}</span>
          </div>
        ))}
      </div>

      <div className="home-grid">
        {/* === LEFT COLUMN === */}
        <div className="home-l">
          {/* Quantum Core */}
          <div className="card qcore">
            <div className="qc-wrap">
              <div className="qcr qcr1"><div className="qc-dot"></div></div>
              <div className="qcr qcr2"></div>
              <div className="qcr qcr3"></div>
              <div className="qc-orb"></div>
            </div>
            <div className="qc-info">
              <div className="ql">⬡ Nucleo Identitario · Allineato</div>
              <div className="qc-quote">"La trasformazione non è un evento.<br/>È un campo di forza che diventa te."</div>
              <button className="btn btn-outline" onClick={() => navigate('/chat')}>
                Inizia sessione profonda →
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="sc">
              <div className="sc-l">Giorni di fila</div>
              <div className="sc-v">12</div>
              <div className="sc-d">↑ 2% settimana</div>
            </div>
            <div className="sc">
              <div className="sc-l">Livello</div>
              <div className="sc-v">Sovrano</div>
              <div className="sc-d">Lvl 5 · 340 xp</div>
            </div>
            <div className="sc">
              <div className="sc-l">Minuti totali</div>
              <div className="sc-v">340</div>
              <div className="sc-d">↑ 15% mese</div>
            </div>
            <div className="sc">
              <div className="sc-l">Community rank</div>
              <div className="sc-v">#8</div>
              <div className="sc-d">Top 3% globale</div>
            </div>
          </div>

          {/* Reality Quest Card */}
          <div className="card-gold rq-card">
            <div className="rq-badge"><div className="rq-dot"></div>Reality Quest · AI · Oggi</div>
            <div className="rq-title">La Decisione Rimasta nel Cassetto</div>
            <div className="rq-body">Ho rilevato un pattern di evitamento nelle tue ultime 4 sessioni. Identifica <em>una</em> decisione che rimandi da più di 2 settimane — e prendila entro le prossime 3 ore. Non analizzarla. Agisci.</div>
            <div className="rq-cta">⏱ 3 ore rimanenti · Missione critica</div>
          </div>
        </div>

        {/* === RIGHT COLUMN === */}
        <div className="home-r">
          {/* Active Journey */}
          <div className="card rh-card">
            <div className="rh-t">Il tuo percorso attivo</div>
            <div className="ji">
              <div className="jdot" style={{ background: '#9B74E0', boxShadow: '0 0 5px rgba(155,116,224,.4)' }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px' }}>Deep Transformation</div>
                <div className="jbar">
                  <div className="jfill" style={{ width: '38%', background: '#9B74E0' }}></div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Day 22/60</div>
              </div>
            </div>
            <div className="ji">
              <div className="jdot" style={{ background: '#4A9ED4', boxShadow: '0 0 5px rgba(74,158,212,.4)' }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px' }}>Emotional Intelligence</div>
                <div className="jbar">
                  <div className="jfill" style={{ width: '65%', background: '#4A9ED4' }}></div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>65% completato</div>
              </div>
            </div>
            <div className="ji">
              <div className="jdot" style={{ background: 'var(--gold)', boxShadow: '0 0 5px rgba(201,168,76,.4)' }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px' }}>The Art of Mindful Living</div>
                <div className="jbar">
                  <div className="jfill" style={{ width: '85%', background: 'var(--gold)' }}></div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Day 18/21 · Quasi fatto!</div>
              </div>
            </div>
          </div>

          {/* Community Highlight */}
          <div className="card rh-card">
            <div className="rh-t">Community · Highlight</div>
            <div className="ca-item">
              <div className="cav">S</div>
              <div>
                <div className="cn">Sarah Chen <span style={{ fontSize: '10px', color: 'var(--gold)' }}>Lv.5</span></div>
                <div className="cl">30-day meditation streak! 🕯</div>
              </div>
            </div>
            <div className="ca-item">
              <div className="cav">R</div>
              <div>
                <div className="cn">Roberto M. <span style={{ fontSize: '10px', color: 'var(--gold)' }}>Lv.8</span></div>
                <div className="cl">Quest "Deep Dive" completata</div>
              </div>
            </div>
            <div className="ca-item">
              <div className="cav">A</div>
              <div>
                <div className="cn">Anna K. <span style={{ fontSize: '10px', color: 'var(--gold)' }}>Lv.4</span></div>
                <div className="cl">+3 Reality Quest questa settimana</div>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="card rh-card">
            <div className="rh-t">Accesso rapido</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
              <button 
                onClick={() => navigate('/council')} 
                className="w-full text-left p-2 rounded-md transition-colors"
                style={{ background: 'rgba(155,116,224,.08)', border: '.5px solid rgba(155,116,224,.25)', color: '#9B74E0', fontSize: '12px', fontFamily: 'var(--fb)' }}
              >
                ⬡ Convoca Il Consiglio →
              </button>
              <button 
                onClick={() => navigate('/chat')} 
                className="w-full text-left p-2 rounded-md transition-colors"
                style={{ background: 'var(--gold-glow)', border: '.5px solid var(--gold-b)', color: 'var(--gold)', fontSize: '12px', fontFamily: 'var(--fb)' }}
              >
                ✦ Sessione con Luminel →
              </button>
              <button 
                onClick={() => navigate('/experiences')} 
                className="w-full text-left p-2 rounded-md transition-colors"
                style={{ background: 'rgba(74,158,212,.06)', border: '.5px solid rgba(74,158,212,.2)', color: '#4A9ED4', fontSize: '12px', fontFamily: 'var(--fb)' }}
              >
                🎧 Calm Space · Binaural →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
