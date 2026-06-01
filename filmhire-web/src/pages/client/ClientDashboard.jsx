import { useEffect, useState } from "react";
import {
  Compass,
  Briefcase,
  Users,
  PlusCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Search,
  Bell,
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  Activity,
  ChevronRight,
  Terminal,
  Send,
} from "lucide-react";

import ClientNavbar from "../../components/client/ClientNavbar";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("talent-feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("All");
  const [activeChatId, setActiveChatId] = useState("chat-1");
  const [typedMessage, setTypedMessage] = useState("");
  const [job, setJob] = useState(null);




  const [conversations, setConversations] = useState([
    {
      id: "chat-1",
      name: "Devon Lane",
      role: "3D Environment Artist",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      messages: [
        {
          id: 1,
          sender: "them",
          text: "Hey Marcus, checked out the design specs for the virtual production set.",
          time: "10:14 AM",
        },
        {
          id: 2,
          sender: "me",
          text: "Awesome! What do you think about the wet asphalt shader approach?",
          time: "10:16 AM",
        },
        {
          id: 3,
          sender: "them",
          text: "Shader optimizations are complete. Custom sub-surface scattering matrices look extremely clean under neon arrays.",
          time: "14m ago",
        },
      ],
    },
    {
      id: "chat-2",
      name: "Marcus Vane",
      role: "Senior Colorist",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
      messages: [
        {
          id: 1,
          sender: "me",
          text: "Hi Marcus, can you supply your recent workflow file for the ACES lookup matrices?",
          time: "Yesterday",
        },
        {
          id: 2,
          sender: "them",
          text: "Attaching updated showreel file...",
          time: "2h ago",
        },
      ],
    },
    {
      id: "chat-3",
      name: "Elena Rostova",
      role: "Senior Colorist",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
      messages: [
        {
          id: 1,
          sender: "me",
          text: "Welcome to Hibernate Studios, Elena! Let's schedule an initial onboarding call soon.",
          time: "3 days ago",
        },
      ],
    },
  ]);

  const activeChat =
    conversations.find((c) => c.id === activeChatId) || conversations;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: Date.now(),
                sender: "me",
                text: typedMessage.trim(),
                time: "Just now",
              },
            ],
          };
        }
        return chat;
      }),
    );
    setTypedMessage("");
  };

  const handleDirectRouteToChat = (candidateName, candidateAvatar) => {
    const existingChat = conversations.find(
      (c) => c.name.toLowerCase() === candidateName.toLowerCase(),
    );

    if (existingChat) {
      setActiveChatId(existingChat.id);
    } else {
      const newId = `chat-${Date.now()}`;
      const newChat = {
        id: newId,
        name: candidateName,
        role: "Professional",
        avatar: candidateAvatar,
        messages: [
          {
            id: 1,
            sender: "me",
            text: "Hi! Let's discuss your application profile.",
            time: "Just now",
          },
        ],
      };
      setConversations([newChat, ...conversations]);
      setActiveChatId(newId);
    }
    setActiveView("messages");
  };

  // Authentication Gate
  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
      }
    };
    checkAccess();
  }, [navigate]);

  // ==========================================
  // REALISTIC DASHBOARD DATASETS
  // ==========================================
  const [talentFeed] = useState([
    {
      id: "TALENT-771",
      artist: "Devon Lane",
      role: "3D Environment Artist",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      rate: "$95/hr",
      experience: "Senior (6+ Yrs)",
      title: "Cyberpunk Alleyway - Realtime UE5 Render",
      image:
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop",
      description:
        "Finished optimization framework for a cinematic virtual production environment. Implemented custom sub-surface scattering shaders for wet asphalt textures under neon load arrays.",
      software: ["Unreal Engine 5", "Houdini", "Substance"],
      match: "98% Match",
    },
    {
      id: "TALENT-769",
      artist: "Elena Rostova",
      role: "Senior Colorist",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
      rate: "$120/hr",
      experience: "Lead / Supervisor",
      title: "Commercial Film Grade - ACES Pipeline Workflow",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
      description:
        "Color timing breakdown for an upcoming high-fashion lifestyle brand campaign. Emphasized rich filmic skin tones, deep organic shadows, and dynamic green channel isolation matrices.",
      software: ["DaVinci Resolve", "Nuke", "Lattice"],
      match: "94% Match",
    },
  ]);

  const [myJobs] = useState([
    {
      id: "JOB-101",
      title: "Lead Colorist (ACES)",
      applications: 24,
      accepted: 2,
      reviewing: 14,
      status: "Open",
      budget: "$4,500",
      speed: "Urgent",
    },
    {
      id: "JOB-102",
      title: "UE5 Technical Generalist",
      applications: 42,
      accepted: 1,
      reviewing: 31,
      status: "Open",
      budget: "$8,000",
      speed: "Normal",
    },
    {
      id: "JOB-103",
      title: "High-Fashion Cinematographer",
      applications: 18,
      accepted: 0,
      reviewing: 8,
      status: "Draft",
      budget: "$6,000",
      speed: "Flexible",
    },
  ]);

  const [applicants] = useState([
    {
      id: "APP-01",
      name: "Marcus Vane",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
      jobTitle: "Lead Colorist (ACES)",
      role: "Senior Colorist",
      matchScore: "96%",
      status: "Reviewing",
    },
    {
      id: "APP-02",
      name: "Sasha Grey",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
      jobTitle: "UE5 Technical Generalist",
      role: "Technical Artist",
      matchScore: "91%",
      status: "Hired",
    },
    {
      id: "APP-03",
      name: "Amara Singh",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
      jobTitle: "Lead Colorist (ACES)",
      role: "Finishing Artist",
      matchScore: "84%",
      status: "Pending",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#040408] text-slate-200 flex flex-col antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=400;500;600;700;800&family=JetBrains+Mono:wght=400;500;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #040408; }
        .font-mono { font-family: 'JetBrains Mono', sans-serif; }
        
        .border-premium { border-color: rgba(255, 255, 255, 0.04); }
        .panel-solid { background-color: #09090F; border: 1px solid rgba(255, 255, 255, 0.04); }
        .input-solid { background-color: #06060A; border: 1px solid rgba(255, 255, 255, 0.06); }
        .input-solid:focus { border-color: #06B6D4; outline: none; box-shadow: 0 0 12px rgba(6, 182, 212, 0.15); }
        
        .dock-blur {
          background: rgba(9, 9, 15, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 24px 60px -12px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05);
        }
      `}</style>
      {/* Global Application Nav Bar */}
      <ClientNavbar/>

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
          {/* ==========================================
              NEW: FULL INSTAGRAM-STYLE CHAT INTERFACE
              ========================================== */}
          {activeView === "messages" && (
  <Messages
    conversations={conversations}
    activeChatId={activeChatId}
    setActiveChatId={setActiveChatId}
    activeChat={activeChat}
    typedMessage={typedMessage}
    setTypedMessage={setTypedMessage}
    handleSendMessage={handleSendMessage}
  />
)}

          {/* CARD STREAM VIEW: TALENT DIRECTORY */}
          {activeView === "talent-feed" && (
  <TalentFeed
    talentFeed={talentFeed}
    handleDirectRouteToChat={handleDirectRouteToChat}
  />
)}

          {/* SIMPLIFIED FORM VIEW: CREATE A JOB POST */}
          {activeView === "create-job" && <CreateJob />}

          {/* DATA LOG LIST VIEW: MANAGE CURRENT LISTINGS */}
          {activeView === "manage-jobs" && (
  <ManageJobs  />
)}

          {/* TABLE MATRIX VIEW: REVIEW APPLICANTS */}
          {activeView === "applicants" && (
  <Applicants
    applicants={applicants}
    handleDirectRouteToChat={handleDirectRouteToChat}
  />
)}
        </div>

        {/* RIGHT COLUMN: METRICS & SYSTEM OUTLOOK (Hidden when full layout chat is engaged to keep space clean) */}
       <ClientActivityPanel
  activeView={activeView}
  conversations={conversations}
  setActiveChatId={setActiveChatId}
  setActiveView={setActiveView}
/>
      </div>

      {/* Persistent Floating Bottom Dock Navigation */}
      <ClientDock activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default ClientDashboard;
