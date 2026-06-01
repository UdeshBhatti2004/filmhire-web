import React from "react";
import {
  Search,
  Compass,
  Briefcase,
  MessageSquare,
  User,
} from "lucide-react";

function ProfessionalNavbar({
  currentTab,
  setCurrentTab,
  chatThreads = [],
}) {
  return (
    <header className="w-full bg-[#111116] border-b border-white/[0.06] sticky top-0 z-50 h-14 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div
          className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-base text-white tracking-tighter cursor-pointer"
          onClick={() => setCurrentTab("home")}
        >
          In
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Search network infrastructure..."
            className="w-full bg-[#181822] border border-white/[0.08] text-xs h-8 rounded pl-9 pr-4 text-neutral-200 outline-none focus:border-indigo-500/50 focus:bg-[#1c1c28] transition-all"
          />
        </div>
      </div>

      <nav className="flex items-center gap-1 sm:gap-6 ml-4">
        {[
          {
            id: "home",
            label: "Home Feed",
            icon: Compass,
          },
          {
            id: "jobs",
            label: "Jobs",
            icon: Briefcase,
          },
          {
            id: "messaging",
            label: "Messaging",
            icon: MessageSquare,
            badge: chatThreads.some((t) => t.unread),
          },
          {
            id: "profile",
            label: "Me Profile",
            icon: User,
          },
        ].map((navItem) => {
          const IconComponent = navItem.icon;
          const isTarget = currentTab === navItem.id;

          return (
            <button
              key={navItem.id}
              onClick={() => setCurrentTab(navItem.id)}
              className={`flex flex-col items-center justify-center h-14 px-2 sm:px-3 relative group transition-colors ${
                isTarget
                  ? "text-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`w-[21px] h-[21px] ${
                    isTarget ? "stroke-[2.2]" : "stroke-[1.8]"
                  }`}
                />

                {navItem.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full" />
                )}
              </div>

              <span className="text-[10px] tracking-tight mt-0.5 font-medium hidden md:inline-block">
                {navItem.label}
              </span>

              {isTarget && (
                <div className="absolute bottom-0 inset-x-2 h-[2px] bg-white rounded-t-full" />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

export default ProfessionalNavbar;