import { useEffect, useState } from "react";
import { 
  Compass, 
  Briefcase, 
  Users, 
  UserCheck, 
  DollarSign, 
  MapPin, 
  Send, 
  Heart, 
  Bookmark, 
  Flame, 
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal,
  MessageSquare,
  Minus,
  ChevronUp,
  Bell
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const [activeFeedFilter, setActiveFeedFilter] = useState("discover");
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const navigate = useNavigate()

  useEffect(() => {
  const checkAccess = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(user);


    if (!user) {
      navigate("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "client") {
      navigate("/professional/dashboard");
      return;
    }
  };

  checkAccess();
}, []);
  
  const [visibleComments, setVisibleComments] = useState({ "PROD-902": true });
  const [activeComments, setActiveComments] = useState({
    "PROD-902": [
      { id: 1, user: "Alex Rivers", role: "DP / Operator", text: "Sent over my 2026 commercial reel. Shot entirely on Alexa Mini LF." },
      { id: 2, user: "Marcus Vane", role: "Gaffer", text: "Let me know if you need an LA-based lighting package team for this setup." }
    ],
    "PROD-884": [
      { id: 1, user: "Elena Rostova", role: "GLSL Shader Artist", text: "Incredible brief. Just finished a liquid simulation pipeline for a cyberpunk short." }
    ]
  });
  const [commentInputs, setCommentInputs] = useState({});

  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [activeChatUser] = useState({ name: "Devon Lane", role: "Director of Photography", avatar: "DL" });
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "them", text: "Hey! Just saw your Haute Couture editorial brief. Is the travel covered from Milan?" },
    { id: 2, sender: "me", text: "Absolutely. Full production flights, lodging, and kit transport allowances are integrated into the budget scope." },
    { id: 3, sender: "them", text: "Perfect. Submitting my formal treatment layout via the platform right now." }
  ]);
  const [chatInput, setChatInput] = useState("");

  const [feedPosts] = useState([
    {
      id: "PROD-902",
      studioName: "StarLume Studios",
      avatar: "SL",
      timestamp: "14m ago",
      title: "S/S 2026 Haute Couture Editorial Campaign",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
      description: "Expanding our visual footprint for the summer collection cycle. We require an elite cinematographer equipped with an ARRI Alexa Mini LF or RED V-Raptor. Must have documented history shooting high-contrast, stylized editorial runway configurations.",
      budget: "$6,500 - $8,000",
      location: "Paris / Milan",
      type: "Contract",
      likes: 342,
      tags: ["Cinematography", "ARRI", "High-Fashion"]
    },
    {
      id: "PROD-884",
      studioName: "KINETICA Media",
      avatar: "KM",
      timestamp: "2h ago",
      title: "Experimental Liquid Motion Title Sequence Design",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop",
      description: "Looking for a 3D artist to craft a 45-second fluid dynamics intro sequence for an indie sci-fi feature film. Deep knowledge of custom noise shaders, liquid distortion mechanics, and openGL/WebGL execution frames is non-negotiable.",
      budget: "$4,500 Flat",
      location: "Remote / Global",
      type: "Project-Based",
      likes: 198,
      tags: ["WebGL", "3D Motion", "LiquidShaders"]
    }
  ]);

  const [activeBriefs] = useState([
    { id: "JOB-01", position: "Lead Colorist (ACES)", studio: "Hibernate Studios", capital: "$3.5k", applicants: 14 },
    { id: "JOB-02", position: "Unreal Engine 5 Technical Artist", studio: "Vertex Dev", capital: "$9.2k", applicants: 29 }
  ]);

  const toggleLike = (id) => setLikedPosts(p => ({ ...p, [id]: !p[id] }));
  const toggleSave = (id) => setSavedPosts(p => ({ ...p, [id]: !p[id] }));
  const toggleCommentSection = (id) => setVisibleComments(p => ({ ...p, [id]: !p[id] }));

  const handlePostComment = (postId) => {
    if (!commentInputs[postId]?.trim()) return;
    setActiveComments(prev => ({
      ...prev,
      [postId]: [
        ...prev[postId],
        { id: Date.now(), user: "Hibernate Studios (You)", role: "Client / Producer", text: commentInputs[postId] }
      ]
    }));
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: "me", text: chatInput }]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-[#030303] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#050507] to-[#030303] text-white flex flex-col antialiased font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-display { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* Global Application Nav Bar */}
      <header className="sticky top-0 z-40 bg-[#050507]/60 backdrop-blur-xl border-b border-white/[0.06] px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 p-[1px]">
            <div className="w-full h-full bg-[#09090b] rounded-[11px] flex items-center justify-center font-display font-bold text-sm tracking-tighter text-white">
              FH
            </div>
          </div>
          <span className="font-display font-bold text-sm uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">FutureHub</span>
        </div>

        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.06] backdrop-blur-md">
          <button className="px-4 py-1.5 text-xs font-medium bg-white/[0.07] border border-white/[0.08] text-white shadow-xl rounded-lg transition-all">Dashboard</button>
          <button className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-all">Create Job</button>
          <button className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-all">Job Details</button>
          <button className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-all">Applicants</button>
          <button className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-all">Profile</button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-xl transition-all relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          </button>
          <div className="h-8 w-[1px] bg-white/[0.08]" />
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] pl-3 pr-1.5 py-1.5 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">Client Mode</span>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300 font-mono">CP</div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout Workspace Area */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mt-8 items-start pb-24">
        
        {/* LEFT COLUMN PANEL */}
        <aside className="md:col-span-3 space-y-5 md:sticky md:top-24">
          <div className="bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-500" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/[0.08] flex items-center justify-center font-bold text-sm text-indigo-400 shadow-inner">HS</div>
              <div>
                <h2 className="text-xs font-semibold text-neutral-200 tracking-tight font-display">Hibernate Studios</h2>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5 tracking-wider">ID: client_0982</p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs text-neutral-400">
              <span className="font-light">Active Briefings</span>
              <span className="font-mono text-xs font-medium text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 shadow-sm">3 Live</span>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-2 flex flex-col gap-1 backdrop-blur-xl shadow-xl">
            <button onClick={() => setActiveFeedFilter("discover")} className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-left transition-all duration-200 ${activeFeedFilter === "discover" ? "bg-white/[0.06] text-white border border-white/[0.08] shadow-md" : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]"}`}>
              <Compass className={`w-4 h-4 transition-transform duration-300 ${activeFeedFilter === "discover" ? "rotate-45 text-indigo-400" : "text-neutral-400"}`} />
              <span className="text-xs font-medium">Discover Feed</span>
            </button>
            <button onClick={() => setActiveFeedFilter("trending")} className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-left transition-all duration-200 ${activeFeedFilter === "trending" ? "bg-white/[0.06] text-white border border-white/[0.08] shadow-md" : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]"}`}>
              <Flame className={`w-4 h-4 ${activeFeedFilter === "trending" ? "text-amber-400 animate-pulse" : "text-neutral-400"}`} />
              <span className="text-xs font-medium">Trending Talent</span>
            </button>
            <button onClick={() => setActiveFeedFilter("network")} className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-left transition-all duration-200 ${activeFeedFilter === "network" ? "bg-white/[0.06] text-white border border-white/[0.08] shadow-md" : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]"}`}>
              <UserCheck className={`w-4 h-4 ${activeFeedFilter === "network" ? "text-emerald-400" : "text-neutral-400"}`} />
              <span className="text-xs font-medium">Vetted Network</span>
            </button>
          </div>
        </aside>

        {/* CENTER COLUMN PANEL */}
        <section className="col-span-1 md:col-span-9 lg:col-span-6 space-y-6">
          <div className="bg-gradient-to-r from-white/[0.04] to-transparent border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 font-display">Cinematic Production Wire</h2>
            </div>
            <SlidersHorizontal className="w-4 h-4 text-neutral-400 hover:text-white cursor-pointer transition-colors" />
          </div>

          {feedPosts.map((post) => (
            <article key={post.id} className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.1]">
              
              {/* Profile Header */}
              <div className="p-5 flex items-center justify-between border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/[0.08] flex items-center justify-center font-bold text-xs text-neutral-200 shadow-inner">{post.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-semibold text-neutral-200 hover:text-indigo-400 cursor-pointer transition-colors">{post.studioName}</h3>
                      <span className="w-1 h-1 rounded-full bg-white/[0.2]" />
                      <span className="text-[10px] text-neutral-500 font-medium">{post.timestamp}</span>
                    </div>
                    <span className="text-[9px] font-mono text-indigo-400/70 font-medium tracking-wider uppercase mt-0.5 block">{post.id}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1 bg-white/[0.04] border border-white/[0.06] text-neutral-300 rounded-full">{post.type}</span>
              </div>

              {/* Media Container */}
              <div className="relative aspect-[16/9] w-full bg-neutral-950 overflow-hidden group select-none">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/20 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-5 left-5 right-5 space-y-2">
                  <h2 className="text-xl font-bold font-display text-white tracking-tight drop-shadow-lg">{post.title}</h2>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="bg-black/40 backdrop-blur-md border border-white/[0.08] px-2.5 py-1 rounded-lg text-neutral-300 flex items-center gap-1.5 shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {post.location}
                    </span>
                    <span className="bg-indigo-500/15 backdrop-blur-md border border-indigo-500/30 px-2.5 py-1 rounded-lg text-indigo-300 font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-950/20">
                      <DollarSign className="w-3.5 h-3.5" /> {post.budget}
                    </span>
                  </div>
                </div>
              </div>

              {/* Engagement Panel Workspace */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                  <div className="flex items-center gap-6 text-neutral-400">
                    <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 text-xs font-medium transition-all ${likedPosts[post.id] ? "text-rose-500 scale-105" : "hover:text-neutral-200"}`}>
                      <Heart className={`w-4 h-4 transition-colors ${likedPosts[post.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                      <span className="font-mono">{likedPosts[post.id] ? post.likes + 1 : post.likes}</span>
                    </button>
                    
                    <button onClick={() => toggleCommentSection(post.id)} className="flex items-center gap-2 text-xs font-medium hover:text-neutral-200 transition-colors">
                      <MessageSquare className="w-4 h-4 text-neutral-400" />
                      <span className="font-mono">{activeComments[post.id]?.length || 0} Comments</span>
                    </button>
                  </div>
                  <button onClick={() => toggleSave(post.id)} className={`transition-all ${savedPosts[post.id] ? "text-indigo-400 scale-105" : "text-neutral-400 hover:text-white"}`}>
                    <Bookmark className={`w-4 h-4 ${savedPosts[post.id] ? "fill-indigo-400 text-indigo-400" : ""}`} />
                  </button>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  <span className="font-semibold text-neutral-200 mr-2">{post.studioName}</span>
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer">#{tag}</span>
                  ))}
                </div>

                {/* INLINE LIVE COMMENTS SYSTEM */}
                {visibleComments[post.id] && (
                  <div className="bg-black/40 rounded-2xl p-4 border border-white/[0.05] mt-4 space-y-4 shadow-inner">
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {activeComments[post.id]?.map((cmt) => (
                        <div key={cmt.id} className="text-xs space-y-1 border-l-2 border-white/[0.08] pl-3 py-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-neutral-300">{cmt.user}</span>
                            <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 bg-white/[0.04] text-neutral-500 rounded border border-white/[0.06] uppercase font-medium">{cmt.role}</span>
                          </div>
                          <p className="text-neutral-400 font-light leading-relaxed">{cmt.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Comment Form input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input 
                        type="text" 
                        placeholder="Add production notes..." 
                        value={commentInputs[post.id] || ""} 
                        onChange={(e) => setCommentInputs(p => ({ ...p, [post.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && handlePostComment(post.id)}
                        className="flex-1 h-10 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all font-light"
                      />
                      <button 
                        onClick={() => handlePostComment(post.id)}
                        className="h-10 w-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>

        {/* RIGHT COLUMN PANEL */}
        <aside className="hidden lg:block lg:col-span-3 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold font-display flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Active Telemetry
              </h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="space-y-3">
              {activeBriefs.map((brief) => (
                <div key={brief.id} className="group bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] p-3.5 rounded-xl space-y-2.5 transition-all hover:bg-white/[0.04]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-200 truncate max-w-[140px]">{brief.position}</h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{brief.studio}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 shadow-sm">{brief.capital}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10 flex items-center gap-1.5 font-mono font-medium">
                      <Users className="w-3 h-3" /> {brief.applicants} profiles
                    </span>
                    <button className="text-neutral-400 hover:text-indigo-400 flex items-center gap-0.5 transition-colors font-medium">
                      <span>Manage</span><ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent rounded-xl p-3 border border-emerald-500/10 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] text-neutral-400 font-medium">Network Volume</span>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-400">+18% mtd</span>
            </div>
          </div>
        </aside>

      </div>

      {/* EXPANDABLE CHAT MESSENGER SYSTEM OVERLAY */}
      <div className={`fixed bottom-0 right-8 w-80 bg-[#0c0c10] border-t border-x border-white/[0.08] rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 z-50 overflow-hidden ${isChatExpanded ? "h-[420px]" : "h-14"}`}>
        
        {/* Chat Header Bar */}
        <div 
          onClick={() => setIsChatExpanded(!isChatExpanded)}
          className="h-14 px-4 bg-white/[0.02] border-b border-white/[0.04] flex items-center justify-between cursor-pointer select-none hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-7 h-7 bg-indigo-600/20 border border-indigo-500/30 text-xs font-mono font-bold flex items-center justify-center rounded-lg text-indigo-300 shadow-inner">
                {activeChatUser.avatar}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0c0c10]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-neutral-200">{activeChatUser.name}</h4>
              {!isChatExpanded && <p className="text-[10px] text-neutral-500 truncate max-w-[160px] font-light">Active Production Query...</p>}
            </div>
          </div>
          
          <div className="text-neutral-400 hover:text-white p-1 bg-white/[0.03] rounded-lg border border-white/[0.05] transition-colors">
            {isChatExpanded ? <Minus className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </div>

        {/* Messaging Content Container */}
        {isChatExpanded && (
          <div className="flex flex-col h-[calc(100%-56px)] bg-black/20">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 text-xs rounded-2xl border transition-all ${
                    msg.sender === "me" 
                      ? "bg-indigo-600 border-indigo-500 text-white rounded-tr-none shadow-md shadow-indigo-600/10" 
                      : "bg-white/[0.03] border-white/[0.05] text-neutral-300 rounded-tl-none"
                  }`}>
                    <p className="leading-relaxed font-light">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Container */}
            <div className="p-3 border-t border-white/[0.05] bg-[#0c0c10] flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Type a secure message..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                className="flex-1 h-9 bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 transition-all font-light"
              />
              <button 
                onClick={handleSendChatMessage}
                className="h-9 w-9 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl flex items-center justify-center text-neutral-300 hover:text-white transition-all active:scale-95 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ClientDashboard;
