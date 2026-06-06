// ProfessionalNavbar.jsx
import React, { useState, useEffect } from "react";
import {
  Compass,
  Briefcase,
  MessageSquare,
  Search,
  Bell,
  Users,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import ConnectionRequests from "./ConnectionRequests"; 

function ProfessionalNavbar({ currentTab, setCurrentTab }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userDisplayName, setUserDisplayName] = useState("Me");

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setUserDisplayName(profile.full_name || "Me");
          if (profile.avatar_url) {
            setUserAvatar(profile.avatar_url);
          }
        }
      } catch (err) {
        console.error("Error fetching navbar user image:", err);
      }
    };

    fetchCurrentUserProfile();
  }, []);

  const dynamicFallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}&background=0a0a0a&color=737373`;

  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 w-16 bg-[#09090b] border-r border-neutral-900 flex flex-col items-center justify-between py-5 z-50 selection:bg-white selection:text-black">
        
        {/* TOP: LOGO & AUXILIARY PLATFORM CONTROLS */}
        <div className="flex flex-col items-center gap-4 w-full">
          <button
            onClick={() => setCurrentTab("home")}
            className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm tracking-tighter active:scale-95 transition-all shadow-md shadow-white/5"
          >
            In
          </button>

          <div className="relative group px-2 w-full">
            <button
              className="w-full aspect-square flex items-center justify-center rounded-xl text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900 transition-all"
              aria-label="Search Platform"
            >
              <Search className="w-4 h-4" />
            </button>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-neutral-900 text-neutral-200 border border-neutral-800 text-[10px] font-medium tracking-wide rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 delay-100 whitespace-nowrap z-50 shadow-2xl translate-x-1 group-hover:translate-x-0">
              Search Network
            </div>
          </div>

          <div className="relative group px-2 w-full">
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className={`w-full aspect-square flex items-center justify-center rounded-xl transition-all relative active:scale-95
                ${isDrawerOpen ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900"}`}
              aria-label="Network Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            </button>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-neutral-900 text-neutral-200 border border-neutral-800 text-[10px] font-medium tracking-wide rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 delay-100 whitespace-nowrap z-50 shadow-2xl translate-x-1 group-hover:translate-x-0">
              Activity Stream
            </div>
          </div>
        </div>

        {/* CENTER NAV: CORE CHANNELS */}
        <nav className="flex flex-col items-center gap-3 w-full my-auto">
          {[
            {
              id: "home",
              label: "Home Feed",
              icon: Compass,
            },
            {
              id: "connections",
              label: "My Network",
              icon: Users,
            },
            {
              id: "jobs",
              label: "Jobs",
              icon: Briefcase,
            },
            {
              id: "workspaces",
              label: "Workspaces",
              icon: MessageSquare,
            },
          ].map((navItem) => {
            const Icon = navItem.icon;
            const isActive = currentTab === navItem.id;

            return (
              <div key={navItem.id} className="relative group w-full px-2">
                <button
                  onClick={() => {
                    setCurrentTab(navItem.id);
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full aspect-square rounded-xl flex items-center justify-center relative transition-all duration-200 active:scale-95
                    ${isActive ? "bg-neutral-900 text-white shadow-inner" : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50"}`}
                >
                  <div className={`relative ${isActive ? "stroke-[2.2] scale-105 text-white" : "stroke-[1.8]"}`}>
                    <Icon className="w-[18px] h-[18px]" />
                  </div>

                  {isActive && (
                    <div className="absolute left-0 top-1/3 bottom-1/3 w-[3px] bg-white rounded-r-full" />
                  )}
                </button>

                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-neutral-900 text-neutral-200 border border-neutral-800 text-[10px] font-semibold tracking-wide rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 delay-100 whitespace-nowrap z-50 shadow-2xl translate-x-1 group-hover:translate-x-0">
                  {navItem.label}
                </div>
              </div>
            );
          })}
        </nav>

        {/* BOTTOM: PROFILE ACCENT ACTION */}
        <div className="w-full flex justify-center px-2 relative group">
          <button
            onClick={() => {
              setCurrentTab("profile");
              setIsDrawerOpen(false);
            }}
            className={`w-10 h-10 rounded-xl overflow-hidden border transition-all active:scale-95 bg-neutral-900 flex items-center justify-center relative ${
              currentTab === "profile" ? "border-white shadow-lg shadow-white/5" : "border-neutral-800 hover:border-neutral-600"
            }`}
          >
            <img
              src={userAvatar || dynamicFallbackAvatar}
              alt="My Profile"
              className="w-full h-full object-cover select-none"
            />
            {currentTab === "profile" && (
              <div className="absolute left-0 top-1/4 bottom-1/4 w-[2.5px] bg-white rounded-r-full" />
            )}
          </button>

          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-neutral-900 text-neutral-200 border border-neutral-800 text-[10px] font-semibold tracking-wide rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 delay-100 whitespace-nowrap z-50 shadow-2xl translate-x-1 group-hover:translate-x-0">
            My Profile
          </div>
        </div>
      </aside>

      {/* --- NOTIFICATION SLIDE-OUT PANEL DRAWER --- */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 bottom-0 w-[420px] max-w-[calc(100vw-5rem)] bg-[#09090b] border-r border-neutral-900 p-4 z-40 transition-transform duration-300 ease-out flex flex-col shadow-[25px_0_50px_-15px_rgba(0,0,0,0.5)] ${
          isDrawerOpen ? "translate-x-16" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between pb-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            Activity Terminal
          </span>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <ConnectionRequests onDataChange={() => console.log("Data changes synced across terminal context...")} />
        </div>
      </div>
    </>
  );
}

export default ProfessionalNavbar;