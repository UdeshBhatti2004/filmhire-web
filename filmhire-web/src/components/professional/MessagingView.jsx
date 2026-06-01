import React from 'react'
import {Filter, FileText, ImageIcon, Paperclip, Search, Send, ShieldCheck, MoreHorizontal} from "lucide-react";

function MessagingView({
  chatThreads,
  selectedChatId,
  setSelectedChatId,
  clientSearchQuery,
  setClientSearchQuery,
  chatMessageInput,
  setChatMessageInput,
  handleSendMessage,
  chatEndRef,
  activeChatRoom,
}) {
  return (
    <div>
      <div className="lg:col-span-12 bg-[#111116] border border-white/[0.06] rounded-xl overflow-hidden h-[580px] flex shadow-2xl">

        {/* INBOX INDEX LIST PANE */}
        <div className="w-5/12 border-r border-white/[0.06] flex flex-col h-full bg-black/10">
          <div className="p-3.5 border-b border-white/[0.06] bg-black/20 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">Conversations</span>
            <Filter className="w-3.5 h-3.5 text-neutral-500 hover:text-white cursor-pointer" />
          </div>

          <div className="p-2 border-b border-white/[0.04]">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5" />
              <input
                type="text"
                placeholder="Search by contact or channel..."
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
                className="w-full bg-[#181822] border border-white/[0.05] text-[11px] h-7 rounded pl-7 pr-3 text-neutral-200 outline-none focus:border-indigo-500/40"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/[0.02] hide-scrollbar">
            {chatThreads.map((thread) => {
              const isActive = selectedChatId === thread.id;
              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedChatId(thread.id)}
                  className={`p-3.5 flex gap-3 cursor-pointer transition-colors relative text-left ${isActive ? "bg-white/[0.03] border-l-2 border-indigo-500" : "hover:bg-white/[0.01]"}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-white/[0.05] flex items-center justify-center font-bold text-xs text-neutral-300">
                      {thread.logo}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#111116] ${thread.onlineStatus === 'active' ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-neutral-200 truncate">{thread.clientName}</h4>
                      <span className="text-[9px] text-neutral-500 font-mono">{thread.time}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate font-medium">{thread.projectContext}</p>
                    <p className="text-[10px] text-neutral-500 truncate font-light mt-0.5">{thread.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LIVE SYSTEM TERMINAL VIEW SCREEN */}
        <div className="w-7/12 flex flex-col h-full bg-[#0b0b0f]">
          {activeChatRoom ? (
            <>
              <div className="p-3.5 border-b border-white/[0.06] bg-[#111116] flex justify-between items-center text-left">
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1 truncate">
                    {activeChatRoom.clientName}
                    {activeChatRoom.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  </h3>
                  <p className="text-[10px] text-neutral-400 truncate">{activeChatRoom.titleRole} • <span className="text-indigo-400">{activeChatRoom.projectContext}</span></p>
                </div>
                <MoreHorizontal className="w-4 h-4 text-neutral-500 hover:text-white cursor-pointer" />
              </div>

              {/* SCROLL TIMELINE CHANNELS */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 hide-scrollbar text-left">
                <div className="text-center">
                  <span className="text-[9px] text-neutral-600 bg-neutral-900 border border-white/[0.02] px-2 py-0.5 rounded uppercase tracking-wider font-mono">Channel Verified Protocol Attached</span>
                </div>

                {activeChatRoom.messages.map((msg) => {
                  const isMe = msg.sender === "me";
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[80%] px-3 py-2 text-xs border ${isMe
                          ? "bg-indigo-600 border-indigo-500 text-white rounded-xl rounded-tr-none shadow"
                          : "bg-[#181822] border-white/[0.05] text-neutral-200 rounded-xl rounded-tl-none"
                        }`}>
                        <p className="font-light leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <span className="text-[8px] text-neutral-500 font-mono mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* BOTTOM INPUT COMPOSE CONTROLS */}
              <div className="p-3 border-t border-white/[0.06] bg-[#111116] space-y-2">
                <div className="flex items-center gap-2 text-neutral-500 border-b border-white/[0.03] pb-1.5">
                  <Paperclip className="w-3.5 h-3.5 hover:text-neutral-300 cursor-pointer" />
                  <ImageIcon className="w-3.5 h-3.5 hover:text-neutral-300 cursor-pointer" />
                  <FileText className="w-3.5 h-3.5 hover:text-neutral-300 cursor-pointer" />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write standard professional proposal response string..."
                    value={chatMessageInput}
                    onChange={(e) => setChatMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 h-8 bg-[#181822] border border-white/[0.06] rounded px-3 text-xs text-neutral-200 outline-none focus:border-indigo-500/40"
                  />
                  <button onClick={handleSendMessage} className="h-8 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-xs flex items-center justify-center transition-colors">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 text-xs p-6">
              <MessageSquare className="w-8 h-8 text-neutral-700 mb-2" />
              Select an active verification conversation thread context from the index column.
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default MessagingView
