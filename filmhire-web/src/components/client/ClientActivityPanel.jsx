// src/components/client/ClientActivityPanel.jsx

import { MessageSquare } from "lucide-react";

const ClientActivityPanel = ({
  activeView,
  conversations,
  setActiveChatId,
  setActiveView,
}) => {
  if (activeView === "messages") return null;

  return (
    <aside className="lg:col-span-3 space-y-4">
      <div className="panel-solid rounded-lg p-3.5 space-y-3">
        <div className="flex items-center justify-between border-b border-premium pb-2">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Recent Live Activity
            </span>
          </div>
        </div>

        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {conversations.slice(0, 2).map((chat) => {
            const lastMsg =
              chat.messages[chat.messages.length - 1];

            return (
              <div
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setActiveView("messages");
                }}
                className="bg-[#06060A] border border-premium p-2 rounded space-y-1 cursor-pointer hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-cyan-400 font-bold">
                    {chat.name}
                  </span>

                  <span className="text-slate-500 text-[9px] font-mono">
                    {lastMsg?.time || "Active"}
                  </span>
                </div>

                <p className="text-xs text-slate-400 truncate font-light">
                  {lastMsg?.text || "Open thread."}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default ClientActivityPanel;