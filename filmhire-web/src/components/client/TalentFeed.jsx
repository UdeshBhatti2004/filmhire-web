// src/components/client/views/TalentFeed.jsx

import { ChevronRight, MessageSquare } from "lucide-react";

const TalentFeed = ({
  talentFeed,
  handleDirectRouteToChat,
}) => {
  return (
    <div className="space-y-4">
      <div className="panel-solid rounded-lg p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xs font-bold text-white uppercase tracking-wide">
            Available Professionals
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Browse hand-picked top developers ready for hire.
          </p>
        </div>
      </div>

      {talentFeed.map((post) => (
        <div
          key={post.id}
          className="panel-solid rounded-lg overflow-hidden transition-all hover:border-white/10"
        >
          <div className="p-3.5 border-b border-premium flex items-start justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <img
                src={post.avatar}
                className="w-8 h-8 rounded object-cover border border-premium"
                alt=""
              />

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-white">
                    {post.artist}
                  </h2>

                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.2 rounded font-medium">
                    {post.match}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  {post.role}
                  {" • "}
                  <span className="text-slate-500 text-[11px]">
                    {post.experience}
                  </span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="block text-xs font-bold text-white">
                {post.rate}
              </span>

              <span className="text-[10px] text-emerald-400 font-medium">
                Available Now
              </span>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-200">
              {post.title}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              {post.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {post.software.map((tech, i) => (
                <span
                  key={i}
                  className="text-[10px] text-slate-400 bg-[#06060A] px-2 py-0.5 rounded border border-premium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="relative aspect-video bg-black/20 border-t border-premium overflow-hidden">
            <img
              src={post.image}
              className="w-full h-full object-cover opacity-75"
              alt=""
            />
          </div>

          <div className="p-2.5 bg-[#06060A] border-t border-premium flex items-center justify-between text-xs">
            <button
              onClick={() =>
                handleDirectRouteToChat(
                  post.artist,
                  post.avatar
                )
              }
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 px-2 py-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
              Message Candidate
            </button>

            <button className="text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1 bg-cyan-500/5 px-2.5 py-1 rounded border border-cyan-500/10 font-bold">
              View Full Portfolio
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TalentFeed;