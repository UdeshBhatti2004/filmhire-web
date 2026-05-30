import { Bell, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function ClientNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showJobsMenu, setShowJobsMenu] = useState(false);

  const isDashboardActive =
    location.pathname === "/client/dashboard";

  const isJobsActive =
    location.pathname === "/client/create-job" ||
    location.pathname === "/client/jobs";

  return (
    <header className="sticky top-0 z-40 bg-[#050507]/60 backdrop-blur-xl border-b border-white/[0.06] px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3 select-none">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 p-[1px]">
          <div className="w-full h-full bg-[#09090b] rounded-[11px] flex items-center justify-center font-bold text-sm tracking-tighter text-white">
            FH
          </div>
        </div>

        <span className="font-bold text-sm uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
          FilmHire
        </span>
      </div>

      <nav className="hidden lg:flex items-center gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.06] backdrop-blur-md">
        
        <button
          onClick={() => navigate("/client/dashboard")}
          className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
            isDashboardActive
              ? "bg-white/[0.07] border border-white/[0.08] text-white shadow-xl"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          Dashboard
        </button>

        <div className="relative">
          <button
            onClick={() => setShowJobsMenu((prev) => !prev)}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
              isJobsActive
                ? "bg-white/[0.07] border border-white/[0.08] text-white shadow-xl"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Jobs
            <ChevronDown className="w-3 h-3" />
          </button>

          {showJobsMenu && (
            <div className="absolute top-11 left-0 w-44 bg-[#0f0f11] border border-white/[0.08] rounded-xl p-1 shadow-2xl">
              <button
                onClick={() => {
                  navigate("/client/create-job");
                  setShowJobsMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-300 hover:bg-white/[0.06]"
              >
                Create Job
              </button>

              <button
                onClick={() => {
                  navigate("/client/jobs");
                  setShowJobsMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-300 hover:bg-white/[0.06]"
              >
                My Jobs
              </button>
            </div>
          )}
        </div>

        <button
          className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-all"
        >
          Applicants
        </button>

        <button
          className="px-4 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-all"
        >
          Profile
        </button>
      </nav>

      <div className="flex items-center gap-4">
        <button className="p-2 text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-xl transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        <div className="h-8 w-[1px] bg-white/[0.08]" />

        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] pl-3 pr-1.5 py-1.5 rounded-xl">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
            Client Mode
          </span>

          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300 font-mono">
            CP
          </div>
        </div>
      </div>
    </header>
  );
}

export default ClientNavbar;    