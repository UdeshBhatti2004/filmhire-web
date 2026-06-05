import React from "react";
import {
  CheckCircle,
  ImageIcon,
  MoreHorizontal,
  ThumbsUp,
  MapPin,
  MessageSquare,
  Star,
  Briefcase,
  Layers,
  Send,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

const HomeView = ({
  profile,
  feedJobs,
  setCurrentTab,
}) => {


  const navigate = useNavigate()

const [newPostText, setNewPostText] = useState("");
const [postMedia, setPostMedia] = useState(null);
const [newPostTools, setNewPostTools] = useState("");
const [homePosts, setHomePosts] = useState([]);


useEffect(() => {
  fetchPosts();
}, []);


const handlePostMediaChange = (e) => {
    if (e.target.files?.[0]) {
  setPostMedia(e.target.files[0]);
}
  };

  const handleLikePost = (postId) => {
    setHomePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked,
          };
        }
        return post;
      }),
    );
  };

  const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("professional_posts")
        .select(
          `
          *,
          professional:profiles(
            id,
            full_name,
            avatar_url,
            specializations
          )
        `,
        )
        .order("created_at", { ascending: false });
  
      if (error) {
        console.error(error);
        return;
      }
      setHomePosts(data || []);
    };

  
    const handleCreateHomePost = async () => {
      if (!newPostText.trim()) return;
  
      try {
        let mediaUrl = null;
  
        if (postMedia) {
          const fileExt = postMedia.name.split(".").pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `posts/${fileName}`;
  
          const { error: uploadError } = await supabase.storage
            .from("post-media")
            .upload(filePath, postMedia);
  
          if (uploadError) throw uploadError;
  
          const {
            data: { publicUrl },
          } = supabase.storage.from("post-media").getPublicUrl(filePath);
  
          mediaUrl = publicUrl;
        }
  
        const toolsArray = newPostTools
          .split(",")
          .map((tool) => tool.trim())
          .filter(Boolean);
  
        const { error } = await supabase.from("professional_posts").insert({
          professional_id: profile.id,
          content: newPostText,
          media_url: mediaUrl,
          tools: toolsArray,
        });
  
        if (error) throw error;
  
        setNewPostText("");
        setNewPostTools("");
        setPostMedia(null);
  
        fetchPosts();
      } catch (err) {
        console.error(err);
      }
    };
    
  return (
    <div className="w-full bg-[#09090b] text-neutral-200 min-h-screen selection:bg-white selection:text-black antialiased flex justify-center">
      
      {/* GLOBAL FLUID CANVAS WRAPPER */}
      <div className="w-full max-w-full grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* ================= LEFT CONTROLLER COLUMN ================= */}
        <aside className="lg:col-span-3 bg-[#0d0d0f] border-r border-neutral-900/60 p-6 xl:p-8 space-y-6 hidden lg:block sticky top-0 h-screen overflow-y-auto">
          
          {/* PROFILE SUMMARY HUB */}
          <div className="bg-[#121214] border border-neutral-800/60 rounded-2xl overflow-hidden shadow-xl">
            <div className="h-20 bg-gradient-to-br from-neutral-900 via-indigo-950/30 to-neutral-900 relative">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px)] bg-[size:16px_16px]" />
            </div>

            <div className="px-5 pb-6 relative">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 border-4 border-[#121214] absolute -top-8 left-5 shadow-2xl">
                <img
                  src={profile.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&fit=crop"}
                  alt={profile.full_name}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              <div className="pt-11 space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 tracking-tight">
                  {profile.full_name || "Anonymous Member"}
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400 fill-indigo-500/10" />
                </h3>
                <p className="text-[11px] text-neutral-400 font-medium tracking-wide truncate">
                  {profile.specializations?.join(" • ") || "Creative Arts"}
                </p>
              </div>

              {/* QUICK METRICS SHEET */}
              <div className="mt-5 pt-4 border-t border-neutral-900 text-[11px] space-y-3 font-medium text-neutral-400">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Platform Account</span>
                  <span className="text-indigo-300 capitalize text-[10px] bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md font-bold tracking-wide">
                    {profile.role || "Professional"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-600" /> Location
                  </span>
                  <span className="text-neutral-200">{profile.city || "Remote"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-neutral-600" /> Rank Metric
                  </span>
                  <span className="text-neutral-200 font-mono bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded">
                    {Number(profile.avg_rating || 0).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ADD COMPACT EXTRA NAVIGATION INTERFACES HERE IF NEEDED TO FILL SPACE */}
          <div className="pt-2 text-[11px] text-neutral-600">
            <p>© 2026 Professional Guild network infrastructure. All rights reserved.</p>
          </div>
        </aside>

        {/* ================= CENTER STREAM STREAM FEED ================= */}
        <main className="col-span-1 lg:col-span-6 px-4 py-6 md:p-8 space-y-6 lg:h-screen lg:overflow-y-auto scrollbar-none">
          
          {/* COMPOSER / POST EDITOR INTERFACE */}
          <div className="bg-[#121214] border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex gap-4 items-start">
              <img
                src={profile.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop"}
                alt="Me"
                className="w-10 h-10 rounded-xl object-cover border border-neutral-800 shrink-0 select-none"
              />

              <div className="flex-1 space-y-3">
                <textarea
                  placeholder="Share a production insight, portfolio item update, or creative request..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  className="w-full bg-neutral-900/40 border border-neutral-900 focus:border-neutral-700/80 rounded-xl p-3.5 text-xs text-neutral-200 focus:outline-none transition-colors resize-none h-24 placeholder:text-neutral-500 leading-relaxed"
                />

                <div className="relative flex items-center">
                  <Layers className="w-3.5 h-3.5 text-neutral-600 absolute left-3" />
                  <input
                    type="text"
                    placeholder="Pipeline workflow specs (e.g., DaVinci Resolve...)"
                    value={newPostTools}
                    onChange={(e) => setNewPostTools(e.target.value)}
                    className="w-full bg-neutral-900/40 border border-neutral-900 focus:border-neutral-700/80 rounded-xl h-9 pl-9 pr-4 text-xs text-neutral-200 outline-none transition-colors placeholder:text-neutral-600"
                  />
                </div>
                
                {postMedia && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-emerald-400 text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Staged asset: {postMedia.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-neutral-900">
              <label className="flex items-center gap-2 hover:text-neutral-100 px-3 h-9 rounded-xl bg-neutral-900/60 border border-neutral-900 hover:border-neutral-800 cursor-pointer select-none text-xs font-medium transition-all active:scale-[0.98]">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>Attach Asset</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handlePostMediaChange}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleCreateHomePost}
                disabled={!newPostText.trim()}
                className="h-9 bg-white text-black font-semibold text-xs px-5 rounded-xl hover:bg-neutral-200 transition-all disabled:opacity-20 disabled:hover:bg-white active:scale-[0.98]"
              >
                Publish Post
              </button>
            </div>
          </div>

          {/* TIMELINE TIMELINE STACK CONTAINER */}
          <div className="space-y-5">
            {homePosts.map((post) => (
              <article
                key={post.id}
                className="bg-[#121214] border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-lg"
              >
                {/* HEADER METADATA METRICS */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <img
                      src={post.professional?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop"}
                      alt="Avatar"
                      className="w-10 h-10 rounded-xl object-cover bg-neutral-900 border border-neutral-900 select-none"
                    />

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                        {post.professional?.full_name}
                      </h4>
                      <p className="text-[10px] font-medium text-neutral-400 tracking-wide">
                        {post.professional?.specializations?.join(" • ") || "Creative Guild"}
                      </p>
                      <p className="text-[9px] text-neutral-500 font-mono">
                        {new Date(post.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <button className="text-neutral-500 hover:text-neutral-300 p-1.5 hover:bg-neutral-900 rounded-xl transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* POST BODY DESCRIPTION */}
                <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap font-sans font-normal">
                  {post.content}
                </p>

                {/* ATTACHED MEDIA PREVIEW IMAGE */}
                {post.media_url && (
                  <div className="rounded-xl overflow-hidden border border-neutral-900 bg-neutral-950 max-h-[420px] flex items-center justify-center">
                    <img
                      src={post.media_url}
                      alt="Uploaded network asset"
                      className="w-full h-full object-cover max-h-[420px]"
                    />
                  </div>
                )}

                {/* PIPELINE CAPABILITIES DEPS */}
                {post.tools?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 p-2 bg-neutral-950/40 rounded-xl border border-neutral-900/60">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 pl-1">
                      Pipeline Tech:
                    </span>
                    {post.tools.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium font-mono bg-neutral-900 text-neutral-300 border border-neutral-800 px-2 py-0.5 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* TIMELINE CONTROLLERS PERFORMANCE */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-900 text-xs font-semibold text-neutral-400">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-neutral-900 transition-all active:scale-95 ${
                      post.hasLiked ? "text-white bg-neutral-900" : "hover:text-neutral-100"
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${post.hasLiked ? "fill-white text-black" : "stroke-[1.8]"}`} />
                    <span>{post.likes_count} Likes</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!expandedComments[post.id]) {
                        fetchComments(post.id);
                      }
                      setExpandedComments((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }));
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-neutral-900 hover:text-neutral-100 transition-all active:scale-95 ${
                      expandedComments[post.id] ? "text-white bg-neutral-900" : ""
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 stroke-[1.8]" />
                    <span>{post.comments_count} Feedback</span>
                  </button>
                </div>

                {/* EXPANDED FEEDBACK SYSTEM */}
                {expandedComments[post.id] && (
                  <div className="pt-3 border-t border-neutral-900/50 space-y-4">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Write constructive portfolio feedback..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        className="flex-1 bg-neutral-950/50 border border-neutral-900 focus:border-neutral-800 rounded-xl h-9 px-3.5 text-xs text-neutral-200 outline-none transition-colors placeholder:text-neutral-600 font-sans"
                      />

                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!(commentInputs[post.id] || "").trim()}
                        className="h-9 shortcut-square rounded-xl bg-neutral-900 border border-neutral-800 px-3 text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-all active:scale-95 disabled:opacity-20"
                      >
                        <Send className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    </div>

                    {/* THREAD SUB-LIST STACK */}
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                      {(comments[post.id] || []).length === 0 ? (
                        <div className="text-[11px] text-neutral-500 italic py-4 text-center">
                          No portfolio review notes posted on this update yet.
                        </div>
                      ) : (
                        comments[post.id].map((comment) => (
                          <div
                            key={comment.id}
                            className="flex gap-3 p-3 rounded-xl bg-neutral-950/40 border border-neutral-900/40 items-start"
                          >
                            <img
                              src={comment.profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop"}
                              alt=""
                              className="w-7 h-7 rounded-lg object-cover bg-neutral-900 shrink-0 select-none"
                            />

                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex justify-between items-baseline gap-4">
                                <p className="text-xs font-bold text-white truncate tracking-tight">
                                  {comment.profile?.full_name}
                                </p>
                                <p className="text-[9px] text-neutral-500 font-mono shrink-0">
                                  {new Date(comment.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                </p>
                              </div>

                              <p className="text-xs text-neutral-300 leading-relaxed font-sans font-normal break-words">
                                {comment.comment}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </article>
            ))}
                    </div>

          <button
            onClick={() => setCurrentTab("jobs")}
            className="w-full mt-4 text-xs bg-white/5 hover:bg-white/10 rounded-lg py-2"
          >
            View All Jobs
          </button>
                </main>

      </div>
    </div>
  );
};

export default HomeView;