// src/components/client/ClientHeader.jsx

import { Bell } from "lucide-react";

const ClientHeader = () => {
  return (
    <header className="sticky top-0 z-40 bg-[#06060A]/90 backdrop-blur-md border-b border-white/5 px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-6 w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-cyan-500/10 border border-cyan-500/30 rounded flex items-center justify-center font-bold text-[11px] text-cyan-400">
            H
          </div>

          <span className="font-bold text-xs uppercase tracking-wider text-white">
            Hibernate Studios
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse" />

          <span>System Operational</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-1.5 text-slate-500 hover:text-white transition-colors relative bg-white/[0.02] border border-white/5 rounded">
          <Bell className="w-3.5 h-3.5" />

          <span className="absolute top-1 right-1 w-1 h-1 bg-cyan-400 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 pl-2.5 pr-2 py-1 rounded">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
            className="w-5 h-5 rounded bg-slate-800 object-cover border border-white/5"
            alt=""
          />

          <span className="text-xs font-medium text-slate-300 hidden sm:inline-block">
            Marcus Vane
          </span>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;