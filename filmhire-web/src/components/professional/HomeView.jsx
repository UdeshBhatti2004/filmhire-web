import React from "react";
import {
  CheckCircle,
  ImageIcon,
  MoreHorizontal,
  ShieldCheck,
  ThumbsUp,
  MapPin,
  Calendar,
  Wallet,
  Clock3,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomeView = ({
  profile,
  feedJobs,
  homePosts,
  newPostText,
  setNewPostText,
  newPostTools,
  setNewPostTools,
  handleCreateHomePost,
  handleLikePost,
  postMedia,
  handlePostMediaChange,
}) => {

  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* LEFT PROFILE CARD */}
      <aside className="lg:col-span-3 space-y-4">
        <div className="bg-[#111116] border border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
          <div className="h-16 bg-gradient-to-br from-neutral-800 to-indigo-950" />

          <div className="px-4 pb-4 relative text-center sm:text-left">
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-[#111116] absolute -top-7 left-4"
            />

            <div className="pt-9">
              <h3 className="text-sm font-bold text-white flex items-center gap-1">
                {profile.full_name}
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/10" />
              </h3>

              <p className="text-[11px] text-indigo-300 mt-0.5 leading-tight">
                {profile.specializations?.join(" • ")}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.05] text-[11px] space-y-2 text-neutral-400">
              <div className="flex justify-between">
                <span>Role</span>
                <span className="text-indigo-400 capitalize">
                  {profile.role}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Location</span>
                <span className="text-neutral-300">{profile.city}</span>
              </div>

              <div className="flex justify-between">
                <span>Rating</span>
                <span className="text-neutral-300">
                  {profile.avg_rating || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Reviews</span>
                <span className="text-neutral-300">
                  {profile.total_reviews || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER FEED */}
      <main className="lg:col-span-6 space-y-4">
        <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-4 space-y-3">
          <div className="flex gap-3">
            <img
              src={profile.avatar_url}
              alt="Me"
              className="w-9 h-9 rounded-lg object-cover"
            />

            <div className="flex-1 space-y-2">
              <textarea
                placeholder="Showcase your latest work, project, reel, edit, or collaboration request..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full bg-[#181822] border border-white/[0.06] rounded-lg p-3 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500/40 resize-none h-20 placeholder:text-neutral-500"
              />

              <input
                type="text"
                placeholder="Tools used (Premiere Pro, DaVinci Resolve, Blender...)"
                value={newPostTools}
                onChange={(e) => setNewPostTools(e.target.value)}
                className="w-full bg-[#181822] border border-white/[0.06] rounded-md h-7 px-3 text-[11px] text-neutral-200 outline-none focus:border-indigo-500/30 placeholder:text-neutral-600"
              />
              {postMedia && (
                <p className="text-[11px] text-green-400">
                  Selected: {postMedia.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
            <div className="flex gap-2 text-neutral-400 text-[11px]">
              <label className="flex items-center gap-1 hover:text-neutral-200 px-2 py-1 rounded bg-white/[0.02] border border-white/[0.04] cursor-pointer">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                Media
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handlePostMediaChange}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={handleCreateHomePost}
              disabled={!newPostText.trim()}
              className="h-7 bg-white text-black font-bold text-xs px-4 rounded hover:bg-neutral-200 disabled:opacity-40"
            >
              Post Update
            </button>
          </div>
        </div>
    
        {/* POSTS */}
        <div className="space-y-3">
          {homePosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#111116] border border-white/[0.06] rounded-xl p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <img
                    src={post.professional?.avatar_url}
                    alt="Avatar"
                    className="w-9 h-9 rounded-lg object-cover bg-neutral-800"
                  />

                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      {post.professional?.full_name}
                    </h4>

                    <p className="text-[10px] text-neutral-400">
                      {post.professional?.specializations?.join(" • ")}
                    </p>

                    <p className="text-[9px] text-neutral-500 mt-0.5">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>

              {post.media_url && (
                <div className="rounded-lg overflow-hidden border border-white/[0.04]">
                  <img
                    src={post.media_url}
                    alt="Post"
                    className="w-full object-cover"
                  />
                </div>
              )}

              {post.tools?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-black/20 rounded-md border border-white/[0.02]">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
                    Pipeline Dependencies:
                  </span>

                  {post.tools.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/10 px-1.5 py-0.5 rounded font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px] text-neutral-400">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-1.5 ${
                    post.hasLiked ? "text-indigo-400" : ""
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.likes_count} Likes</span>
                </button>

                <span>{post.comments_count} comments</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="lg:col-span-3 space-y-4 hidden lg:block">
        <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-4">
          <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wide mb-4">
            Open Opportunities
          </h4>

          <div className="space-y-3">
            {feedJobs?.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="border-b border-white/[0.04] pb-3 last:border-b-0"
              >
                <p className="text-sm text-white font-medium">{job.title}</p>

                <p className="text-xs text-neutral-500 mt-1">
                  {job.location_text}
                </p>

                <p className="text-xs text-green-400 mt-1">
                  ₹{job.budget_min} - ₹{job.budget_max}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default HomeView;
