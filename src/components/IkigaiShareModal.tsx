import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ArrowDownTrayIcon, ShareIcon } from "@heroicons/react/24/outline";

const DL = {
  void: "#06060F", deep: "#09091A",
  gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
  goldB: "rgba(201,168,76,0.25)", alch: "#9B74E0", stra: "#4A9ED4",
  white: "#F0EBE0", muted: "#6A6560", glass: "rgba(255,255,255,0.035)",
  glassB: "rgba(255,255,255,0.07)",
};

interface IkigaiShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  levelName: string;
}

const IkigaiShareModal: React.FC<IkigaiShareModalProps> = ({ isOpen, onClose, user, levelName }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const getArchetypeColor = () => {
    if (user?.plan === "vip") return DL.alch;
    if (user?.plan === "premium") return DL.gold;
    return DL.stra;
  };

  const aColor = getArchetypeColor();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // In a real scenario, use html2canvas or dom-to-image here to generate the image
      // For the demo, we will simulate the delay and use the Web Share API if available
      await new Promise(r => setTimeout(r, 1000));
      
      if (navigator.share) {
        await navigator.share({
          title: 'Il mio Ikigai su Luminel',
          text: `Ho appena scoperto il mio archetipo: ${levelName}. Inizia il tuo viaggio su LuminelCoach!`,
          url: window.location.origin,
        });
      } else {
        alert("Funzionalità di download immagine in arrivo! Condividi il link: " + window.location.origin);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(`Ho appena scoperto il mio archetipo (${levelName}) su LuminelCoach. Un'esperienza trasformativa guidata dall'AI.\n\nScoprilo anche tu: ${window.location.origin}`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0" style={{ background: "rgba(6,6,15,0.8)", backdropFilter: "blur(12px)" }}
          onClick={onClose} />
        
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md rounded-3xl overflow-hidden flex flex-col"
          style={{ background: DL.deep, border: `0.5px solid ${DL.glassB}` }}>
          
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b" style={{ borderColor: DL.glassB }}>
            <h3 className="font-serif text-[20px]" style={{ color: DL.white }}>Condividi il tuo <em style={{ color: DL.gold, fontStyle: "italic" }}>Ikigai</em></h3>
            <button onClick={onClose} className="p-2 rounded-full transition-colors" style={{ color: DL.muted }}
              onMouseEnter={e => e.currentTarget.style.color = DL.white} onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Card Preview (The part to be shared) */}
          <div className="p-8 flex justify-center bg-[#06060F]">
            <div ref={cardRef} className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden p-8 flex flex-col justify-between items-center text-center shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${DL.deep}, #000)`, border: `1px solid ${aColor}40` }}>
              
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${aColor}, transparent)` }} />
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full" style={{ background: `${aColor}15`, filter: "blur(60px)" }} />
              
              <div className="relative z-10 w-full">
                <div className="font-serif text-[12px] tracking-[0.2em] uppercase mb-8" style={{ color: aColor }}>Luminel Trasformational</div>
                
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center font-serif text-[32px] mb-6 shadow-lg"
                  style={{ background: `${aColor}15`, border: `1px solid ${aColor}40`, color: aColor }}>
                  {user?.fullName?.charAt(0)?.toUpperCase() ?? "M"}
                </div>
                
                <h4 className="font-serif text-[28px] mb-2 leading-tight" style={{ color: DL.white }}>{user?.fullName}</h4>
                <div className="inline-block px-4 py-1.5 rounded-full text-[11px] font-medium tracking-widest uppercase mb-6"
                  style={{ background: `${aColor}20`, color: aColor, border: `0.5px solid ${aColor}40` }}>
                  Archetipo: {levelName}
                </div>
                
                <p className="text-[13px] italic leading-relaxed px-4" style={{ color: "rgba(240,235,224,0.7)" }}>
                  "Il coraggio di guardare quello che già sai."
                </p>
              </div>
              
              <div className="relative z-10 w-full pt-6 border-t" style={{ borderColor: `${aColor}20` }}>
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-widest" style={{ color: DL.muted }}>Metodo</div>
                    <div className="font-serif text-[14px]" style={{ color: aColor }}>Michael Luminels</div>
                  </div>
                  <div className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: `${aColor}30`, color: aColor }}>
                    <span className="font-serif text-[14px]">L</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-col gap-3" style={{ background: DL.void }}>
            <button onClick={handleDownload} disabled={downloading}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-[14px] font-medium transition-all"
              style={{ background: aColor, color: "#000" }}>
              {downloading ? (
                <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
              ) : (
                <>
                  <ShareIcon className="w-5 h-5" />
                  Condividi nelle Storie (IG/FB)
                </>
              )}
            </button>
            
            <button onClick={handleLinkedInShare}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-[14px] font-medium transition-all"
              style={{ background: "rgba(255,255,255,0.05)", color: DL.white, border: `0.5px solid ${DL.glassB}` }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              Condividi su LinkedIn
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IkigaiShareModal;
