import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserGroupIcon, HeartIcon, ChatBubbleLeftRightIcon,
  ShareIcon, TrophyIcon, FireIcon, SparklesIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

type Tab = "feed" | "groups" | "leaderboard";

const DL = {
  gold: "#C9A84C", goldBr: "#EDD980", goldDim: "rgba(201,168,76,0.12)",
  goldB: "rgba(201,168,76,0.25)", alch: "#9B74E0", stra: "#4A9ED4", guer: "#D4603A",
  white: "#F0EBE0", muted: "#6A6560", glass: "rgba(255,255,255,0.035)",
  glassB: "rgba(255,255,255,0.07)", dim: "#252330",
};

const POSTS = [
  { id: 1, user: { name: "Sarah Chen", av: "S", level: 5, color: "#4A9ED4" }, content: "Just completed my 30-day meditation streak! Feeling amazing and more centered than ever. 🧘‍♀️", likes: 24, comments: 8, ts: "2h fa", type: "milestone" },
  { id: 2, user: { name: "Michael Torres", av: "M", level: 8, color: "#9B74E0" }, content: "Finished \"The Art of Mindful Living\" quest today. The breathwork techniques have been life-changing! Passato da 4h di sonno a 7 di qualità. 🙏", likes: 42, comments: 15, ts: "5h fa", type: "quest" },
  { id: 3, user: { name: "Anna K.", av: "A", level: 4, color: "#C9A84C" }, content: "Reality Quest di ieri: inviare quella email difficile entro 3 ore. L'ho fatto. Non so più cosa aspettassi. Grazie Luminel ⚡", likes: 31, comments: 7, ts: "1g fa", type: "quest" },
  { id: 4, user: { name: "Roberto M.", av: "R", level: 6, color: "#D4603A" }, content: "Il Consiglio degli Archetipi mi ha dato una prospettiva che non avevo mai considerato sul mio progetto. L'Alchimista ha toccato qualcosa di profondo.", likes: 18, comments: 4, ts: "2g fa", type: "insight" },
];

const GROUPS = [
  { id: 1, name: "Ikigai Explorers", members: 234, desc: "Scopri e vivi il tuo scopo di vita con il metodo Jara", color: "#C9A84C", icon: "⭕" },
  { id: 2, name: "Mindful Leaders", members: 189, desc: "Leadership consapevole per manager e imprenditori", color: "#4A9ED4", icon: "♟" },
  { id: 3, name: "Deep Transformers", members: 142, desc: "Percorsi avanzati — solo VIP. Shadow work e identità sovrana", color: "#9B74E0", icon: "🔥" },
  { id: 4, name: "Morning Ritualists", members: 312, desc: "Condividi e migliora il tuo rituale mattutino quotidiano", color: "#F59E0B", icon: "☀️" },
  { id: 5, name: "Relationships & Growth", members: 97, desc: "Comunicazione autentica, CNV e relazioni profonde", color: "#EC4899", icon: "❤️" },
  { id: 6, name: "Italian Chapter", members: 278, desc: "Community italiana di Luminel — connettiti con i transformer locali", color: "#10B981", icon: "🇮🇹" },
];

const LEADERBOARD = [
  { rank: 1, name: "Michael Torres", av: "M", color: "#9B74E0", xp: 4200, streak: 32, plan: "vip", badge: "♛" },
  { rank: 2, name: "Sarah Chen", av: "S", color: "#4A9ED4", xp: 3850, streak: 30, plan: "premium", badge: "⭐" },
  { rank: 3, name: "Roberto M.", av: "R", color: "#D4603A", xp: 3600, streak: 28, plan: "vip", badge: "♛" },
  { rank: 4, name: "Anna K.", av: "A", color: "#C9A84C", xp: 2900, streak: 21, plan: "premium", badge: "⭐" },
  { rank: 5, name: "Luca F.", av: "L", color: "#10B981", xp: 2450, streak: 18, plan: "premium", badge: "⭐" },
  { rank: 6, name: "Giulia B.", av: "G", color: "#EC4899", xp: 2100, streak: 14, plan: "free", badge: "✦" },
  { rank: 7, name: "jaramichael", av: "j", color: "#C9A84C", xp: 2340, streak: 12, plan: "vip", badge: "♛", isMe: true },
];

const PostCard: React.FC<{ post: typeof POSTS[0]; delay: number }> = ({ post, delay }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const typeColor: Record<string, string> = { milestone: "#C9A84C", quest: "#9B74E0", insight: "#4A9ED4" };
  const typeLabel: Record<string, string> = { milestone: "Milestone", quest: "Quest", insight: "Insight" };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-xl overflow-hidden transition-all"
      style={{ background: "rgba(255,255,255,0.022)", border: `0.5px solid rgba(255,255,255,0.07)` }}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-medium flex-shrink-0"
            style={{ background: `${post.user.color}20`, color: post.user.color, border: `0.5px solid ${post.user.color}35` }}>
            {post.user.av}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-medium" style={{ color: DL.white }}>{post.user.name}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${post.user.color}18`, color: post.user.color }}>
                Lv.{post.user.level}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${typeColor[post.type]}10`, color: typeColor[post.type] }}>
                {typeLabel[post.type]}
              </span>
            </div>
            <div className="text-[10px]" style={{ color: DL.muted }}>{post.ts}</div>
          </div>
        </div>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: "rgba(240,235,224,0.75)" }}>{post.content}</p>
        {/* Actions */}
        <div className="flex items-center gap-5 pt-3" style={{ borderTop: `0.5px solid ${DL.dim}` }}>
          <button onClick={() => { setLiked(p => !p); setLikes(l => liked ? l - 1 : l + 1); }}
            className="flex items-center gap-1.5 text-[12px] transition-all"
            style={{ color: liked ? "#EC4899" : DL.muted }}>
            {liked ? <HeartSolid className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
            {likes}
          </button>
          <button className="flex items-center gap-1.5 text-[12px] transition-all" style={{ color: DL.muted }}
            onMouseEnter={e => e.currentTarget.style.color = DL.gold}
            onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
            <ChatBubbleLeftRightIcon className="w-4 h-4" />{post.comments}
          </button>
          <button className="flex items-center gap-1.5 text-[12px] transition-all" style={{ color: DL.muted }}
            onMouseEnter={e => e.currentTarget.style.color = "#10B981"}
            onMouseLeave={e => e.currentTarget.style.color = DL.muted}>
            <ShareIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [postText, setPostText] = useState("");

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="text-[9px] tracking-[0.24em] uppercase mb-2 opacity-70" style={{ color: DL.gold }}>Luminel · Trasformatori</div>
        <h1 className="font-serif font-normal leading-tight mb-2" style={{ fontSize: "clamp(26px,5vw,38px)", color: DL.white }}>
          <em className="italic" style={{ color: DL.gold }}>Community</em>
        </h1>
        <p className="text-[13px]" style={{ color: DL.muted }}>Connettiti con i fellow transformers nel percorso Ikigai</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b mb-8 overflow-x-auto" style={{ borderColor: DL.dim }}>
        {(["feed", "groups", "leaderboard"] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-5 py-2.5 text-[13px] capitalize border-b-2 -mb-px transition-all"
            style={{ color: activeTab === tab ? DL.gold : DL.muted, borderBottomColor: activeTab === tab ? DL.gold : "transparent" }}>
            {tab === "leaderboard" ? "Classifica" : tab === "groups" ? "Gruppi" : "Feed"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* FEED */}
        {activeTab === "feed" && (
          <motion.div key="feed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Composer */}
            <div className="rounded-xl p-5" style={{ background: DL.glass, border: `0.5px solid ${DL.glassB}` }}>
              <textarea value={postText} onChange={e => setPostText(e.target.value)}
                placeholder="Condividi il tuo percorso…" rows={3}
                className="w-full bg-transparent outline-none resize-none text-[13px] leading-relaxed"
                style={{ color: DL.white, border: "none" }} />
              <div className="flex justify-between items-center pt-3" style={{ borderTop: `0.5px solid ${DL.dim}` }}>
                <span className="text-[11px]" style={{ color: DL.muted }}>Il tuo insight potrebbe ispirare qualcuno oggi</span>
                <button className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                  style={{ background: postText.trim() ? DL.gold : "rgba(255,255,255,0.04)", color: postText.trim() ? "#06060F" : DL.muted, border: `0.5px solid ${postText.trim() ? DL.gold : DL.glassB}` }}>
                  Post
                </button>
              </div>
            </div>
            {POSTS.map((post, i) => <PostCard key={post.id} post={post} delay={i * 0.07} />)}
          </motion.div>
        )}

        {/* GROUPS */}
        {activeTab === "groups" && (
          <motion.div key="groups" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GROUPS.map((g, i) => (
                <motion.div key={g.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="rounded-xl p-5 cursor-pointer transition-all"
                  style={{ background: `${g.color}07`, border: `0.5px solid ${g.color}25` }}
                  whileHover={{ y: -2, borderColor: `${g.color}50` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0"
                      style={{ background: `${g.color}18` }}>{g.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[14px] font-medium" style={{ color: DL.white }}>{g.name}</span>
                        <span className="text-[10px]" style={{ color: g.color }}>{g.members} membri</span>
                      </div>
                      <p className="text-[12px] leading-snug mb-3" style={{ color: DL.muted }}>{g.desc}</p>
                      <button className="text-[11px] px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: `${g.color}14`, color: g.color, border: `0.5px solid ${g.color}30` }}>
                        Unisciti →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <motion.div key="lb" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex flex-col gap-2">
              {LEADERBOARD.map((u, i) => {
                const rankIcon = u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : null;
                return (
                  <motion.div key={u.rank} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 px-5 py-4 rounded-xl transition-all"
                    style={{ background: u.isMe ? DL.goldDim : "rgba(255,255,255,0.022)", border: `0.5px solid ${u.isMe ? DL.goldB : "rgba(255,255,255,0.07)"}` }}>
                    <div className="w-9 text-center flex-shrink-0">
                      {rankIcon ? <span className="text-[18px]">{rankIcon}</span>
                        : <span className="text-[14px] font-medium" style={{ color: DL.muted }}>{u.rank}</span>}
                    </div>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-medium flex-shrink-0"
                      style={{ background: `${u.color}20`, color: u.color, border: `0.5px solid ${u.color}35` }}>
                      {u.av}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium" style={{ color: u.isMe ? DL.gold : DL.white }}>{u.name}</span>
                        {u.isMe && <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: DL.goldDim, color: DL.gold }}>Tu</span>}
                        <span className="text-[10px]" style={{ color: u.color }}>{u.badge}</span>
                      </div>
                      <div className="text-[10px]" style={{ color: DL.muted }}>{u.streak} streak</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[14px] font-medium" style={{ color: u.rank <= 3 ? DL.gold : DL.white }}>{u.xp.toLocaleString()}</div>
                      <div className="text-[9px]" style={{ color: DL.muted }}>xp</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;