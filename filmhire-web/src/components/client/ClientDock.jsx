// src/components/client/ClientDock.jsx

import {
  Compass,
  PlusCircle,
  Briefcase,
  Users,
  MessageSquare,
} from "lucide-react";

const ClientDock = ({ activeView, setActiveView }) => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-[440px] px-4">
      <nav className="dock-blur rounded-lg p-1.5 flex items-center justify-between">
        {[
          {
            id: "talent-feed",
            label: "Talent",
            icon: Compass,
          },
          {
            id: "create-job",
            label: "Post Job",
            icon: PlusCircle,
          },
          {
            id: "manage-jobs",
            label: "My Jobs",
            icon: Briefcase,
          },
          {
            id: "applicants",
            label: "Applicants",
            icon: Users,
          },
          {
            id: "messages",
            label: "Chats",
            icon: MessageSquare,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex-1 py-1.5 rounded flex flex-col items-center gap-0.5 transition-all ${
                active
                  ? "text-cyan-400 bg-white/[0.04] font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />

              <span className="text-[9px] uppercase tracking-wider font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ClientDock;