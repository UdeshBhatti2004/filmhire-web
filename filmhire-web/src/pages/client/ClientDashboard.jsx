import React, { useEffect, useState } from "react";
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
  Flame,
  UserCheck,
  SlidersHorizontal,
  MapPin,
  DollarSign,
  Heart,
  Bookmark,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase"; 
import ClientNavbar from "../../components/client/ClientNavbar";

// ==========================================
// PLACEHOLDER INTERNAL SUB-COMPONENTS
// ==========================================
const MessagesView = ({
  conversations,
  activeChatId,
  setActiveChatId,
  activeChat,
  typedMessage,
  setTypedMessage,
  handleSendMessage,
}) => (
  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl h-[600px] flex flex-col justify-between">
    <div className="flex-1 overflow-y-auto space-y-3 text-xs pr-2">
      {activeChat?.messages?.map((m) => (
        <div
          key={m.id}
          className={`p-3 rounded-xl max-w-[70%] ${m.sender === "me" ? "bg-indigo-600 ml-auto text-white" : "bg-white/5 mr-auto text-neutral-300"}`}
        >
          {m.text}
        </div>
      ))}
    </div>
    <form
      onSubmit={handleSendMessage}
      className="flex gap-2 border-t border-white/5 pt-4 mt-2"
    >
      <input
        type="text"
        value={typedMessage}
        onChange={(e) => setTypedMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-xs outline-none focus:border-indigo-500"
      />
      <button
        type="submit"
        className="p-3 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 transition-colors"
      >
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  </div>
);

const CreateJob = () => (
  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-xs text-neutral-400">
    <h3 className="text-sm font-semibold text-white mb-2">Post a New Briefing</h3>
    Create job application forms interface wrapper layer.
  </div>
);


const ClientDashboard = () => {
  const navigate = useNavigate();

  // Basic Navigation View States
  const [activeView, setActiveView] = useState("talent-feed");
  const [activeFeedFilter, setActiveFeedFilter] = useState("discover");
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  // Functional Inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatId, setActiveChatId] = useState("chat-1");
  const [typedMessage, setTypedMessage] = useState("");

  // Interaction Reactive States
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // ==========================================
  // REALISTIC DASHBOARD DATASETS
  // ==========================================
  const [conversations, setConversations] = useState([
    {
      id: "chat-1",
      name: "Devon Lane",
      role: "3D Environment Artist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      messages: [
        { id: 1, sender: "them", text: "Hey Marcus, checked out the design specs for the virtual production set.", time: "10:14 AM" },
        { id: 2, sender: "me", text: "Awesome! What do you think about the wet asphalt shader approach?", time: "10:16 AM" },
        { id: 3, sender: "them", text: "Shader optimizations are complete. Custom sub-surface scattering matrices look extremely clean under neon arrays.", time: "14m ago" },
      ],
    },
  ]);

  const [feedPosts] = useState([
    {
      id: "POST-991",
      studioName: "StarLume Studios",
      avatar: "SL",
      timestamp: "2 hours ago",
      type: "Production Brief",
      title: "Virtual Horizon Modular Stages",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop",
      location: "Vancouver, BC",
      budget: "$12,000",
      likes: 42,
      description: "Developing cross-platform pipeline tools for real-time camera tracking optimization setups in high-end volume sets.",
      tags: ["UnrealEngine", "VirtualProduction", "ICVFX"],
    },
  ]);

  const [activeBriefs] = useState([
    { id: "B-1", position: "Lead ACES Colorist", studio: "Hibernate Studios", capital: "$4,500", applicants: 24 },
    { id: "B-2", position: "UE5 Generalist", studio: "Hibernate Studios", capital: "$8,000", applicants: 42 },
  ]);


  const [activeComments, setActiveComments] = useState({
    "POST-991": [
      { id: 1, user: "Sasha Grey", role: "Tech Director", text: "Are you running this pipeline on dual-node configurations?" },
    ],
  });

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations;

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
              { id: Date.now(), sender: "me", text: typedMessage.trim(), time: "Just now" },
            ],
          };
        }
        return chat;
      }),
    );
    setTypedMessage("");
  };


  const toggleLike = (id) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id) => {
    setSavedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCommentSection = (id) => {
    setVisibleComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePostComment = (postId) => {
    if (!commentInputs[postId]?.trim()) return;
    const newComment = {
      id: Date.now(),
      user: "Hibernate Studios",
      role: "Client / Producer",
      text: commentInputs[postId].trim(),
    };
    setActiveComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login"); return; }

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
  // VIEW RENDER CONDITIONAL SWITCH
  // ==========================================
  const renderCenterContent = () => {
    switch (activeView) {
      case "messages":
        return (
          <MessagesView 
            conversations={conversations}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            activeChat={activeChat}
            typedMessage={typedMessage}
            setTypedMessage={setTypedMessage}
            handleSendMessage={handleSendMessage}
          />
        );
      case "create-job":
        return <CreateJob />;
      case "talent-feed":
      default:
        return (
          <>
            <div className="bg-gradient-to-r from-white/[0.04] to-transparent border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-xl">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 font-display">
                  Cinematic Production Wire
                </h2>
              </div>
              <SlidersHorizontal className="w-4 h-4 text-neutral-400 hover:text-white cursor-pointer transition-colors" />
            </div>

            {feedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.1]"
              >
                <div className="p-5 flex items-center justify-between border-b border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/[0.08] flex items-center justify-center font-bold text-xs text-neutral-200 shadow-inner">
                      {post.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-semibold text-neutral-200 hover:text-indigo-400 cursor-pointer transition-colors">
                          {post.studioName}
                        </h3>
                        <span className="w-1 h-1 rounded-full bg-white/[0.2]" />
                        <span className="text-[10px] text-neutral-500 font-medium">
                          {post.timestamp}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-indigo-400/70 font-medium tracking-wider uppercase mt-0.5 block">
                        {post.id}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1 bg-white/[0.04] border border-white/[0.06] text-neutral-300 rounded-full">
                    {post.type}
                  </span>
                </div>

                <div className="relative aspect-[16/9] w-full bg-neutral-950 overflow-hidden group select-none">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5 space-y-2">
                    <h2 className="text-xl font-bold font-display text-white tracking-tight drop-shadow-lg">{post.title}</h2>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="bg-black/40 backdrop-blur-md border border-white/[0.08] px-2.5 py-1 rounded-lg text-neutral-300 flex items-center gap-1.5 shadow-md">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {post.location}
                      </span>
                      <span className="bg-indigo-500/15 backdrop-blur-md border border-indigo-500/30 px-2.5 py-1 rounded-lg text-indigo-300 font-semibold flex items-center gap-1.5 shadow-md">
                        <DollarSign className="w-3.5 h-3.5" /> {post.budget}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                    <div className="flex items-center gap-6 text-neutral-400">
                      <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 text-xs font-medium transition-all ${likedPosts[post.id] ? "text-rose-500 scale-105" : "hover:text-neutral-200"}`}>
                        <Heart className={`w-4 h-4 transition-colors ${likedPosts[post.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                        <span className="font-mono">{likedPosts[post.id] ? post.likes + 1 : post.likes}</span>
                      </button>
                      <button onClick={() => toggleCommentSection(post.id)} className="flex items-center gap-2 text-xs font-medium hover:text-neutral-200 transition-colors">
                        <MessageSquare className="w-4 h-4 text-neutral-400" />
                        <span className="font-mono">{activeComments[post.id]?.length || 0} Notes</span>
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
                      <span key={idx} className="text-[10px] text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>

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

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Add production notes..."
                          value={commentInputs[post.id] || ""}
                          onChange={(e) => setCommentInputs((p) => ({ ...p, [post.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && handlePostComment(post.id)}
                          className="flex-1 h-10 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all font-light"
                        />
                        <button onClick={() => handlePostComment(post.id)} className="h-10 w-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#040408] text-slate-200 flex flex-col antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=400;500;600;700;800&family=JetBrains+Mono:wght=400;500;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #040408; }
        .font-mono { font-family: 'JetBrains Mono', sans-serif; }
  
      `}</style>

      <ClientNavbar />

      <div className="flex-1 max-w-[1440px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mt-8 items-start pb-24">
        {/* LEFT COLUMN */}
        <aside className="md:col-span-3 space-y-5 md:sticky md:top-24 text-left">
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
              <span className="font-mono text-xs font-medium text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 shadow-sm">2 Live</span>
            </div>
          </div>

        </aside>

        {/* CENTER HOUSING CONTAINER */}
        <section className="col-span-1 md:col-span-9 lg:col-span-6 space-y-6 text-left">
          {renderCenterContent()}
        </section>
      </div>

    </div>
  );
};

export default ClientDashboard;