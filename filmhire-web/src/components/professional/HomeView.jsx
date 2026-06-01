import React from "react";
import {
  CheckCircle,
  ImageIcon,
  MoreHorizontal,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react";

function HomeView({
  profile,
  homePosts,
  newPostText,
  setNewPostText,
  newPostTools,
  setNewPostTools,
  handleCreateHomePost,
  handleLikePost,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* LEFT PROFILE CARD */}
      <aside className="lg:col-span-3 space-y-4">
        <div className="bg-[#111116] border border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
          <div className="h-16 bg-gradient-to-br from-neutral-800 to-indigo-950" />

          <div className="px-4 pb-4 relative text-center sm:text-left">
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-14 h-14 rounded-xl object-cover border-2 border-[#111116] absolute -top-7 left-4"
            />

            <div className="pt-9">
              <h3 className="text-sm font-bold text-white flex items-center gap-1">
                {profile.name}
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/10" />
              </h3>

              <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight">
                {profile.title}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.05] text-[11px] space-y-2 text-neutral-400">
              <div className="flex justify-between">
                <span>Profile impressions</span>
                <span className="text-indigo-400 font-mono font-bold">
                  1.4K
                </span>
              </div>

              <div className="flex justify-between">
                <span>Network Growth</span>
                <span className="text-indigo-400 font-mono font-bold">
                  +18%
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
              src={profile.avatar}
              alt="Me"
              className="w-9 h-9 rounded-lg object-cover"
            />

            <div className="flex-1 space-y-2">
              <textarea
                placeholder="Share a project deployment breakthrough or thought pattern..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full bg-[#181822] border border-white/[0.06] rounded-lg p-3 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500/40 resize-none h-20 placeholder:text-neutral-500"
              />

              <input
                type="text"
                placeholder="Tools mapped (e.g. After Effects, Figma, Tailwind CSS)"
                value={newPostTools}
                onChange={(e) => setNewPostTools(e.target.value)}
                className="w-full bg-[#181822] border border-white/[0.06] rounded-md h-7 px-3 text-[11px] text-neutral-200 outline-none focus:border-indigo-500/30 placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
            <div className="flex gap-2 text-neutral-400 text-[11px]">
              <button className="flex items-center gap-1 hover:text-neutral-200 px-2 py-1 rounded bg-white/[0.02] border border-white/[0.04]">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                Media
              </button>
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
                    src={post.author.avatar}
                    alt="Avatar"
                    className="w-9 h-9 rounded-lg object-cover bg-neutral-800"
                  />

                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      {post.author.name}

                      {post.author.isCompany && (
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </h4>

                    <p className="text-[10px] text-neutral-400">
                      {post.author.title}
                    </p>

                    <p className="text-[9px] text-neutral-500 mt-0.5">
                      {post.time}
                    </p>
                  </div>
                </div>

                <MoreHorizontal className="w-4 h-4 text-neutral-500" />
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>

              {post.media && (
                <div className="rounded-lg overflow-hidden border border-white/[0.04] aspect-video">
                  <img
                    src={post.media}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {post.techUsed?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-black/20 rounded-md border border-white/[0.02]">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
                    Pipeline Dependencies:
                  </span>

                  {post.techUsed.map((tech, idx) => (
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
                  <span>{post.likes} Likes</span>
                </button>

                <span>{post.comments} comments</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="lg:col-span-3 space-y-4 hidden lg:block">
        <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
            Industry Trends
          </h4>

          <div className="space-y-2 text-xs">
            <div>
              <p className="text-neutral-200 font-medium">
                #BrutalistMotionReels
              </p>

              <span className="text-[10px] text-neutral-500 font-mono">
                4,120 posts this week
              </span>
            </div>

            <div>
              <p className="text-neutral-200 font-medium">
                #HoudiniLiquidLayouts
              </p>

              <span className="text-[10px] text-neutral-500 font-mono">
                1,894 posts this week
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default HomeView;