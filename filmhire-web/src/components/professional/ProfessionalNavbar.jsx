import React from "react";
import { Compass, Briefcase, MessageSquare, User, Search } from "lucide-react";

function ProfessionalNavbar({ currentTab, setCurrentTab, chatThreads = [] }) {
  const navItems = [
    { id: "home", label: "Home Feed", icon: Compass },
    { id: "jobs", label: "Job Board", icon: Briefcase },
    {
      id: "messaging",
      label: "Messages",
      icon: MessageSquare,
      badge: chatThreads.some((t) => t.unread),
    },
    { id: "profile", label: "My Profile", icon: User },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 bg-[#09090b] border-r border-neutral-900 flex flex-col items-center justify-between py-5 z-50 selection:bg-white selection:text-black">
      
      {/* TOP: BRAND ANCHOR & SEARCH CONTAINER */}
      <div className="flex flex-col items-center gap-5 w-full">
        {/* Core Identity Monogram */}
        <button
          onClick={() => setCurrentTab("home")}
          className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm tracking-tighter active:scale-95 transition-all shadow-md shadow-white/5"
        >
          In
        </button>

        {/* Global Search Micro-Action */}
        <div className="relative group px-2 w-full">
          <button 
            className="w-full aspect-square flex items-center justify-center rounded-xl text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900 transition-all"
            aria-label="Search Platform"
          >
            <Search className="w-4 h-4 stroke-[2]" />
          </button>
          
          {/* Action Descriptive Tooltip Label */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-neutral-900 text-neutral-200 border border-neutral-800 text-[10px] font-medium tracking-wide rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 delay-100 whitespace-nowrap z-50 shadow-2xl translate-x-1 group-hover:translate-x-0">
            Search Network
          </div>
        </div>
      </div>


      {/* CENTER: CORE NAV INTERFACE */}
      <nav className="flex flex-col gap-1.5 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <div key={item.id} className="relative group w-full">
              <button
                onClick={() => setCurrentTab(item.id)}
                className={`w-full aspect-square rounded-xl flex items-center justify-center relative transition-all duration-200 active:scale-95
                  ${isActive 
                    ? "bg-neutral-900 text-white shadow-inner" 
                    : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50"
                  }`}
              >
                <div className="relative">
  <Icon
    className={`w-[18px] h-[18px] transition-transform duration-200 ${
      isActive ? "stroke-[2.2] scale-105" : "stroke-[1.8]"
    }`}
  />

  {item.badge && (
    <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full ring-2 ring-[#09090b]" />
  )}
</div>

{isActive && (
  <div className="absolute left-0 top-1/3 bottom-1/3 w-[3px] bg-white rounded-r-full" />
)}
</button>

<div className="absolute left-full ...">
  {item.label}
</div>

</div>
          );
        })}
      </nav>

      {/* BOTTOM: ACCOUNT ANCHOR */}
      <div className="w-full flex justify-center px-2 relative group">
        <button 
          onClick={() => setCurrentTab("profile")}
          className={`w-10 h-10 rounded-xl overflow-hidden border transition-all active:scale-95 bg-neutral-900 ${
            currentTab === "profile" 
              ? "border-white shadow-lg shadow-white/5" 
              : "border-neutral-800 hover:border-neutral-600"
          }`}
        >
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&q=80" 
            alt="Profile Account" 
            className="w-full h-full object-cover select-none"
          />
        </button>

        {/* Account Hover Name Label */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-neutral-900 text-neutral-200 border border-neutral-800 text-[10px] font-semibold tracking-wide rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 delay-100 whitespace-nowrap z-50 shadow-2xl translate-x-1 group-hover:translate-x-0">
          User Settings
        </div>
      </div>

    </aside>
  );
}

export default ProfessionalNavbar;