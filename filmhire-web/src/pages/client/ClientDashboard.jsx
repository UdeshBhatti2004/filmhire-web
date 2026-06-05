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

  const [currentUserId, setCurrentUserId] = useState(null);

  // Basic Navigation View States
  const [activeView, setActiveView] = useState("talent-feed");
  const [activeFeedFilter, setActiveFeedFilter] = useState("discover");
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  const [feedPosts, setFeedPosts] = useState([]);

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


  const [activeBriefs] = useState([
    { id: "B-1", position: "Lead ACES Colorist", studio: "Hibernate Studios", capital: "$4,500", applicants: 24 },
    { id: "B-2", position: "UE5 Generalist", studio: "Hibernate Studios", capital: "$8,000", applicants: 42 },
  ]);

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations;

  const fetchFeedPosts = async () => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from("professional_posts")
        .select(`
          *,
          professional:profiles(
            id,
            full_name,
            avatar_url,
            specializations
          ),
          professional_post_likes(
            user_id
          ),
          professional_post_comments(
            id,
            comment,
            created_at,
            user:profiles(
              full_name,
              role
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const postsWithCounts = (data || []).map((post) => ({
        ...post,
        likes_count: post.professional_post_likes?.length || 0,
        comments_count: post.professional_post_comments?.length || 0,
        hasLiked: post.professional_post_likes?.some(
          (like) => like.user_id === currentUserId
        ),
        // Sort sequential logs chronologically by oldest first 
        professional_post_comments: post.professional_post_comments?.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        ) || []
      }));

      setFeedPosts(postsWithCounts);
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  };

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

  const handleLikePost = async (postId) => {
    try {
      const post = feedPosts.find((p) => p.id === postId);
      if (!post || !currentUserId) return;

      if (post.hasLiked) {
        // 1. Optimistic UI update for Unlike
        setFeedPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  hasLiked: false,
                  likes_count: Math.max((p.likes_count || 0) - 1, 0),
                }
              : p
          )
        );

        // 2. Database Transactions
        const { error } = await supabase
          .from("professional_post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", currentUserId);

        if (error) throw error;

        await supabase
          .from("professional_posts")
          .update({ likes_count: Math.max((post.likes_count || 0) - 1, 0) })
          .eq("id", postId);

      } else {
        // 1. Optimistic UI update for Like
        setFeedPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  hasLiked: true,
                  likes_count: (p.likes_count || 0) + 1,
                }
              : p
          )
        );

        // 2. Database Transactions
        const { error } = await supabase
          .from("professional_post_likes")
          .insert({ post_id: postId, user_id: currentUserId });

        if (error) throw error;

        await supabase
          .from("professional_posts")
          .update({ likes_count: (post.likes_count || 0) + 1 })
          .eq("id", postId);
      }
    } catch (err) {
      console.error("Like error:", err);
      fetchFeedPosts();
    }
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

  const handlePostComment = async (postId) => {
    const commentText = commentInputs[postId]?.trim();

    if (!commentText || !currentUserId) return;

    try {
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));

      const { error } = await supabase
        .from("professional_post_comments")
        .insert({
          post_id: postId,
          user_id: currentUserId,
          comment: commentText,
        });

      if (error) throw error;

      const post = feedPosts.find((p) => p.id === postId);

      await supabase
        .from("professional_posts")
        .update({
          comments_count: (post?.comments_count || 0) + 1,
        })
        .eq("id", postId);

    } catch (err) {
      console.error("Error writing comment to database:", err);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }
      setCurrentUserId(user.id);

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
  }, [navigate]);

  useEffect(() => {
    if (currentUserId) {
      fetchFeedPosts();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel("client-post-feed")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "professional_posts",
        },
        () => {
          fetchFeedPosts();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "professional_post_comments",
        },
        () => {
          fetchFeedPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

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
    className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-zinc-700/80 m-4 max-w-2xl mx-auto"
  >
    {/* Header Section */}
    <div className="p-4 flex items-center justify-between">
      <div 
        onClick={() => navigate(`/profile/${post.professional?.id}`)}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <img
          src={post.professional?.avatar_url || "https://ui-avatars.com/api/?name=User"}
          alt=""
          className="w-9 h-9 rounded-full object-cover bg-zinc-800 border border-zinc-700/50"
        />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors">
              {post.professional?.full_name || "Professional"}
            </h3>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span className="text-xs text-zinc-500">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {post.professional?.specializations || "Creative"}
          </p>
        </div>
      </div>
    </div>

    {/* Media Body */}
    <div className="relative aspect-[16/9] w-full bg-zinc-950 border-y border-zinc-800">
      {post.media_url?.match(/\.(mp4|webm|mov)$/i) ? (
        <video
          src={post.media_url}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={post.media_url}
          alt=""
          className="w-full h-full object-cover"
        />
      )}
    </div>

    {/* Content & Action Tray */}
    <div className="p-4 space-y-3.5">
      {/* Interaction Buttons */}
      <div className="flex items-center justify-between text-zinc-400">
        <div className="flex items-center gap-5">
          <button
            onClick={() => handleLikePost(post.id)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              post.hasLiked ? "text-rose-500 font-medium" : "hover:text-zinc-200"
            }`}
          >
            <Heart className={`w-4 h-4 ${post.hasLiked ? "fill-rose-500" : ""}`} />
            <span>{post.likes_count || 0}</span>
          </button>

          <button
            onClick={() => toggleCommentSection(post.id)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              visibleComments[post.id] ? "text-indigo-400 font-medium" : "hover:text-zinc-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments_count || 0}</span>
          </button>
        </div>

        <button
          onClick={() => toggleSave(post.id)}
          className={`transition-colors ${
            savedPosts[post.id] ? "text-indigo-400" : "hover:text-zinc-200"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${savedPosts[post.id] ? "fill-indigo-400" : ""}`} />
        </button>
      </div>

      {/* Post Text Description */}
      <div className="space-y-2">
        <p className="text-sm text-zinc-300 leading-relaxed">
          <span className="font-medium text-zinc-200 mr-2">
            {post.professional?.full_name || "Professional"}
          </span>
          {post.content}
        </p>

        {post.tools && post.tools.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tools.map((tool, idx) => (
              <span key={idx} className="text-xs text-indigo-400 hover:underline cursor-pointer">
                #{tool}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Clean, Non-intrusive Comments Section */}
      {visibleComments[post.id] && (
        <div className="pt-4 border-t border-zinc-800 space-y-4">
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {post.professional_post_comments?.map((cmt) => (
              <div key={cmt.id} className="text-sm flex gap-2 items-start">
                <span className="font-medium text-zinc-200 whitespace-nowrap">
                  {cmt.user?.full_name || "Anonymous"}:
                </span>
                <span className="text-zinc-400 break-words flex-1">{cmt.comment}</span>
              </div>
            ))}

            {(!post.professional_post_comments || post.professional_post_comments.length === 0) && (
              <p className="text-xs text-zinc-500 py-2">No comments yet. Be the first to reply.</p>
            )}
          </div>

          {/* Inline Input Box */}
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentInputs[post.id] || ""}
              onChange={(e) =>
                setCommentInputs((p) => ({ ...p, [post.id]: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handlePostComment(post.id)}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-700 transition-colors"
            />
            <button
              onClick={() => handlePostComment(post.id)}
              className="text-xs text-indigo-400 font-medium hover:text-indigo-300 px-2 py-1 transition-colors"
            >
              Post
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