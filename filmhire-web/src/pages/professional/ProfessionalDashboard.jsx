import { useEffect, useState } from "react";
import { 
  Compass, 
  Briefcase, 
  UserCheck, 
  DollarSign, 
  MapPin, 
  Send, 
  MessageSquare,
  Minus,
  ChevronUp,
  Bell,
  Plus,
  Eye,
  FileText,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Clock
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

const ProfessionalDashboard = () => {
  const [activeFeedFilter, setActiveFeedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Authentication & Role Gate
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

      // Guarding ensuring only professional talent accesses this feed configuration
      if (profile?.role !== "professional") {
        navigate("/client/dashboard");
        return;
      }
    };

    checkAccess();
  }, [navigate]);

  // Global Discovery Feed (Open Client Briefs Available for Pitches)
  const [discoverBriefs, setDiscoverBriefs] = useState([
    {
      id: "BRIEF-902",
      clientName: "Vanguard Cinema Group",
      title: "S/S 2026 Haute Couture Editorial Campaign",
      timestamp: "14m ago",
      description: "Expanding our visual footprint for the summer collection cycle. We require an elite cinematographer equipped with an ARRI Alexa Mini LF or RED V-Raptor. Must have documented history shooting high-contrast, stylized editorial runway configurations.",
      budget: "$6,500 - $8,000",
      location: "Paris / Milan",
      type: "Contract",
      views: 124,
      proposalsCount: 14,
      tags: ["Cinematography", "ARRI", "High-Fashion"],
      category: "video"
    },
    {
      id: "BRIEF-884",
      clientName: "Nexus Indie Labs",
      title: "Experimental Liquid Motion Title Sequence Design",
      timestamp: "2h ago",
      description: "Looking for a 3D artist to craft a 45-second fluid dynamics intro sequence for an indie sci-fi feature film. Deep knowledge of custom noise shaders, liquid distortion mechanics, and openGL/WebGL execution frames is non-negotiable.",
      budget: "$4,500 Flat",
      location: "Remote / Global",
      type: "Project-Based",
      views: 312,
      proposalsCount: 29,
      tags: ["WebGL", "3D Motion", "LiquidShaders"],
      category: "motion"
    },
    {
      id: "BRIEF-871",
      clientName: "Aether Creative Agency",
      title: "Immersive Unreal Engine 5 Environment Artist",
      timestamp: "5h ago",
      description: "Seeking an environment designer proficient in UE5 Nanite and Lumen workflows for a luxury retail virtual showroom build. Architectural background or spatial design focus is highly prioritized.",
      budget: "$9,000 - $11,000",
      location: "Hybrid / NYC",
      type: "Retainer",
      views: 98,
      proposalsCount: 6,
      tags: ["UE5", "Real-Time", "Spatial-Design"],
      category: "3d"
    }
  ]);

  // Track the Professional's Live Submitted Pitches & Applications
  const [mySubmittedPitches, setMySubmittedPitches] = useState([
    { 
      id: "PITCH-401", 
      targetBriefId: "BRIEF-902",
      clientName: "Vanguard Cinema Group",
      projectTitle: "Haute Couture Editorial Campaign",
      status: "Under Review",
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      submittedDate: "Today"
    },
    { 
      id: "PITCH-392", 
      targetBriefId: "BRIEF-810",
      clientName: "Helix Tech Brands",
      projectTitle: "B2B Product Keynote Motion Frame",
      status: "Shortlisted",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      submittedDate: "2 days ago"
    }
  ]);

  // Chat Messenger System State
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [activeChatUser] = useState({ name: "Devon Lane", role: "Creative Director @ Vanguard", avatar: "DL" });
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "them", text: "Hey Alex! Just saw your response to our Haute Couture brief. Is your camera package currently based out of Europe?" },
    { id: 2, sender: "me", text: "Hey Devon! Yes, my full Alexa Mini LF kit is currently flight-cased in Milan. Ready for immediate deployment." },
    { id: 3, sender: "them", text: "Excellent. Reviewing your attached treatment layout with the producers now." }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: "me", text: chatInput }]);
    setChatInput("");
  };

  const handlePitchBrief = (briefId, title) => {
    alert(`Initializing custom Treatment Builder and Secure File Vault entry for: ${title}`);
  };

  // Filtering Logic for the Professional's Feed
  const filteredBriefs = discoverBriefs.filter(brief => {
    const matchesCategory = activeFeedFilter === "all" || brief.category === activeFeedFilter;
    const matchesSearch = brief.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          brief.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
          <button className="px-4 py-1.5 text-xs font-medium bg-white/[0.07] border border-white/[0.08] text-white shadow-xl rounded-lg transition-all">Feed Radar</button>
          <button className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-all">My Treatments</button>
          <button className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-all">Active Contracts</button>
          <button className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-all">Portfolio Vault</button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-xl transition-all relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          </button>
          <div className="h-8 w-[1px] bg-white/[0.08]" />
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] pl-3 pr-1.5 py-1.5 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">Creator Mode</span>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300 font-mono">AR</div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout Workspace Area */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mt-8 items-start pb-24">
        
        {/* LEFT COLUMN: PROFESSIONAL RADAR CONTROL */}
        <aside className="md:col-span-3 space-y-5 md:sticky md:top-24">
          {/* Creator Profile Summary Widget */}
          <div className="bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/15 transition-all duration-500" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/[0.08] flex items-center justify-center font-bold text-sm text-indigo-400 shadow-inner">AR</div>
              <div>
                <h2 className="text-xs font-semibold text-neutral-200 tracking-tight font-display">Alex Rivers</h2>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5 tracking-wider">Cinematographer / DP</p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs text-neutral-400">
              <span className="font-light flex items-center gap-1.5 text-neutral-400"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Match Rating</span>
              <span className="font-mono text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 shadow-sm">Top 2%</span>
            </div>
          </div>

          {/* Quick Sub-Category Feed Triggers */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-2 flex flex-col gap-1 backdrop-blur-xl shadow-xl">
            <div className="px-3 py-2 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">Filter Specialization</div>
            <button onClick={() => setActiveFeedFilter("all")} className={`w-full px-4 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all duration-200 ${activeFeedFilter === "all" ? "bg-white/[0.06] text-white border border-white/[0.08]" : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]"}`}>
              <Compass className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-medium">All Available Briefs</span>
            </button>
            <button onClick={() => setActiveFeedFilter("video")} className={`w-full px-4 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all duration-200 ${activeFeedFilter === "video" ? "bg-white/[0.06] text-white border border-white/[0.08]" : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]"}`}>
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-medium">Cinematography</span>
            </button>
            <button onClick={() => setActiveFeedFilter("motion")} className={`w-full px-4 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all duration-200 ${activeFeedFilter === "motion" ? "bg-white/[0.06] text-white border border-white/[0.08]" : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]"}`}>
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium">Motion & Shaders</span>
            </button>
            <button onClick={() => setActiveFeedFilter("3d")} className={`w-full px-4 py-2.5 rounded-xl flex items-center gap-3 text-left transition-all duration-200 ${activeFeedFilter === "3d" ? "bg-white/[0.06] text-white border border-white/[0.08]" : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]"}`}>
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-medium">Real-Time / 3D Design</span>
            </button>
          </div>
        </aside>

        {/* CENTER COLUMN: THE DISCOVERY LIVE BRIEF FEED */}
        <section className="col-span-1 md:col-span-9 lg:col-span-5 space-y-6">
          {/* Feed Search and Control Console */}
          <div className="bg-gradient-to-r from-white/[0.04] to-transparent border border-white/[0.06] rounded-2xl p-4 space-y-3 shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 font-display">Live Opportunity Feed Radar</h2>
            </div>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search tools, platforms, engine constraints (e.g. ARRI, UE5)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.06] text-xs h-9 rounded-xl pl-10 pr-4 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 transition-all font-light"
              />
            </div>
          </div>

          {/* Render Filtered Results */}
          {filteredBriefs.length === 0 ? (
            <div className="bg-white/[0.01] border border-dashed border-white/[0.06] rounded-2xl p-12 text-center text-xs text-neutral-500 font-light">
              No briefs matched your exact profile metrics or active search term.
            </div>
          ) : (
            filteredBriefs.map((brief) => (
              <article key={brief.id} className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-2xl transition-all duration-300 hover:border-white/[0.1]">
                
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/[0.04] border border-white/[0.06] text-neutral-400 px-2 py-0.5 rounded">{brief.id}</span>
                      <span className="text-[10px] text-neutral-400 font-medium font-display">{brief.clientName}</span>
                    </div>
                    <h3 className="text-base font-bold font-display text-neutral-200 tracking-tight mt-2">{brief.title}</h3>
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full">{brief.type}</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-light">{brief.description}</p>

                <div className="flex flex-wrap gap-2 text-[10px] pt-1">
                  <span className="bg-neutral-900 border border-white/[0.06] px-2.5 py-1 rounded-lg text-neutral-300 flex items-center gap-1.5 shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" /> {brief.location}
                  </span>
                  <span className="bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-emerald-300 font-semibold flex items-center gap-1.5 shadow-md">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {brief.budget}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {brief.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-neutral-400 bg-white/[0.03] border border-white/[0.05] px-2.5 py-0.5 rounded-full">#{tag}</span>
                  ))}
                </div>

                {/* Submitting Actions Panel */}
                <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                  <div className="flex gap-4 text-[11px] text-neutral-500 font-medium">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> <strong className="text-neutral-300 font-mono">{brief.views}</strong> interactions</span>
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> <strong className="text-neutral-300 font-mono">{brief.proposalsCount}</strong> pitched</span>
                  </div>
                  
                  <button 
                    onClick={() => handlePitchBrief(brief.id, brief.title)}
                    className="flex items-center gap-1.5 text-[11px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    Pitch Custom Treatment <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

              </article>
            ))
          )}
        </section>

        {/* RIGHT COLUMN: PITCH TRACKER & STATUS WORKFLOW */}
        <aside className="col-span-1 md:col-span-12 lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <h2 className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" /> Treatment Submissions
              </h2>
              <span className="text-[10px] bg-neutral-800 text-neutral-400 font-mono px-2 py-0.5 rounded-md">{mySubmittedPitches.length} Active</span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {mySubmittedPitches.map((pitch) => (
                <div key={pitch.id} className="group bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl space-y-3 transition-all duration-300 hover:bg-white/[0.02]">
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-neutral-500">{pitch.id}</span>
                      <h4 className="text-xs font-semibold text-neutral-200 mt-0.5">{pitch.projectTitle}</h4>
                      <p className="text-[10px] text-neutral-500 font-light mt-0.5">{pitch.clientName}</p>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${pitch.statusColor}`}>
                      {pitch.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Submitted {pitch.submittedDate}</span>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View Submission</button>
                  </div>

                </div>
              ))}
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

export default ProfessionalDashboard;