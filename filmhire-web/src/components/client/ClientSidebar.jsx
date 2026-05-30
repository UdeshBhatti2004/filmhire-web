// src/components/client/ClientSidebar.jsx

import {
  Compass,
  Briefcase,
  Users,
  PlusCircle,
  MessageSquare,
  Search,
} from "lucide-react";

const ClientSidebar = ({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  selectedTier,
  setSelectedTier,
  talentCount,
  jobsCount,
  applicantsCount,
  conversationsCount,
}) => {
  return (
    <aside className={`${activeView === "messages" ? "hidden lg:block lg:col-span-2" : "lg:col-span-3"} space-y-4`}>
      
      <div className="panel-solid rounded-lg p-3.5 space-y-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />

          <input
            type="text"
            placeholder="Search candidates or jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs input-solid rounded text-slate-300 placeholder-slate-600 transition-all"
          />
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1 mb-1.5">
            Menu
          </span>

          {[
            {
              id: "talent-feed",
              label: "Find Talent",
              icon: Compass,
              count: talentCount,
            },
            {
              id: "create-job",
              label: "Post a New Job",
              icon: PlusCircle,
              count: null,
            },
            {
              id: "manage-jobs",
              label: "My Jobs",
              icon: Briefcase,
              count: jobsCount,
            },
            {
              id: "applicants",
              label: "Review Applicants",
              icon: Users,
              count: applicantsCount,
            },
            {
              id: "messages",
              label: "Direct Chats",
              icon: MessageSquare,
              count: conversationsCount,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full h-8 px-2.5 rounded flex items-center justify-between text-xs transition-all ${
                  isSelected
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 font-bold"
                    : "text-slate-400 hover:bg-white/[0.02] hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected
                        ? "text-cyan-400"
                        : "text-slate-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-white/5 text-slate-500"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeView !== "messages" && (
        <div className="panel-solid rounded-lg p-3.5 space-y-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Filter Experience
          </span>

          <div className="grid grid-cols-2 gap-1 text-xs">
            {["All", "Senior", "Lead", "Director"].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`h-6 rounded text-left px-2 transition-all ${
                  selectedTier === tier
                    ? "bg-white/5 border border-slate-500 text-white"
                    : "border border-white/5 text-slate-500 hover:text-slate-300"
                }`}
              >
                • {tier}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ClientSidebar;