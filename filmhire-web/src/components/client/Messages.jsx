// src/components/client/views/Messages.jsx

import { Send } from "lucide-react";

const Messages = ({
  conversations,
  activeChatId,
  setActiveChatId,
  activeChat,
  typedMessage,
  setTypedMessage,
  handleSendMessage,
}) => {
  return (
    <>
      {/* Left Chat List */}
      <div className="md:col-span-4 border-r border-premium flex flex-col bg-[#07070C]">
        <div className="p-4 border-b border-premium flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Direct Inbox
          </span>

          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
            Active Threads
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.02]">
          {conversations.map((chat) => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            const isActive = chat.id === activeChatId;

            return (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full p-3.5 flex items-center gap-3 text-left transition-all relative ${
                  isActive
                    ? "bg-white/[0.03] border-l-2 border-cyan-400"
                    : "hover:bg-white/[0.01]"
                }`}
              >
                <img
                  src={chat.avatar}
                  className="w-9 h-9 rounded object-cover border border-premium"
                  alt=""
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">
                      {chat.name}
                    </h4>

                    <span className="text-[9px] text-slate-500 font-mono">
                      {lastMsg?.time || ""}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate mt-0.5 font-light">
                    {lastMsg
                      ? lastMsg.sender === "me"
                        ? `You: ${lastMsg.text}`
                        : lastMsg.text
                      : chat.role}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Window */}
      <div className="md:col-span-8 flex flex-col bg-[#09090F]">
        <div className="p-4 border-b border-premium flex items-center justify-between bg-[#06060A]/60">
          <div className="flex items-center gap-3">
            <img
              src={activeChat.avatar}
              className="w-8 h-8 rounded object-cover border border-premium"
              alt=""
            />

            <div>
              <h3 className="text-xs font-bold text-white">
                {activeChat.name}
              </h3>

              <p className="text-[10px] text-slate-500">
                {activeChat.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />

            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Sync Connection Secure
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col justify-end min-h-[400px]">
          {activeChat.messages.map((msg) => {
            const isMe = msg.sender === "me";

            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[75%] ${
                  isMe
                    ? "self-end items-end"
                    : "self-start items-start"
                }`}
              >
                <div
                  className={`p-3 rounded text-xs leading-relaxed tracking-wide ${
                    isMe
                      ? "bg-cyan-950/40 text-cyan-200 border border-cyan-500/20 rounded-br-none"
                      : "bg-[#06060A] text-slate-300 border border-premium rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>

                <span className="text-[9px] text-slate-600 mt-1 font-mono px-1">
                  {msg.time}
                </span>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-premium bg-[#06060A]/80 flex items-center gap-2"
        >
          <input
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder={`Message ${activeChat.name}...`}
            className="flex-1 h-9 px-3 text-xs input-solid rounded placeholder-slate-600 text-slate-200 bg-black/30"
          />

          <button
            type="submit"
            disabled={!typedMessage.trim()}
            className="h-9 w-9 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black flex items-center justify-center rounded"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </>
  );
};

export default Messages;