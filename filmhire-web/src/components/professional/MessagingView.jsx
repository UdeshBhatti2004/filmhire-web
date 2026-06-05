  import React, { useState, useEffect } from "react";
  import {
    Filter,
    FileText,
    ImageIcon,
    Paperclip,
    Search,
    Send,
    ShieldCheck,
    MoreHorizontal,
    MessageSquare,
  } from "lucide-react";
  import { supabase } from "../../lib/supabase";

  function MessagingView({
    clientSearchQuery,
    setClientSearchQuery,
    chatEndRef,
    activeJobChatTarget,
    setActiveJobChatTarget,
  }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // FIX #1: Handled locally to prevent parent component re-renders from killing the WebSocket channel
    const [chatMessageInput, setChatMessageInput] = useState("");

    // 1. Authenticate user session
    useEffect(() => {
      const getSessionUser = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);
        if (user) {
          await fetchJobConversations(user.id);
        }
      };
      getSessionUser();
    }, []);

    // Update active chat if parent component forces an external target change
    useEffect(() => {
      if (!activeJobChatTarget) return;

      setActiveChat({
        job_id: activeJobChatTarget.job_id,
        counterpart_id: activeJobChatTarget.counterpart_id,
        displayName: activeJobChatTarget.displayName,
        projectTitle: activeJobChatTarget.projectTitle,
        initials: activeJobChatTarget.displayName?.slice(0, 2).toUpperCase(),
      });
    }, [activeJobChatTarget]);

    // 2. Fetch unique conversations grouped by job_id
    const fetchJobConversations = async (userId) => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select(`
            job_id,
            sender_id,
            receiver_id,
            content,
            created_at,
            jobs (
              id,
              title,
              client:profiles!jobs_client_id_fkey (
                id,
                full_name,
                company_name,
                avatar_url
              )
            )
          `)
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const distinctChats = {}
        const trackingSet = new Set();

        data?.forEach((msg) => {
          if (!trackingSet.has(msg.job_id)) {
            trackingSet.add(msg.job_id);

            const isSender = msg.sender_id === userId;
            const counterpartId = isSender
              ? msg.receiver_id
              : msg.sender_id;

            const clientData = msg.jobs?.client;

            distinctChats.push({
              job_id: msg.job_id,
              projectTitle: msg.jobs?.title || "Production Contract",
              counterpart_id: counterpartId,
              displayName:
                clientData?.company_name ||
                clientData?.full_name ||
                "Production Client",
              avatar_url: clientData?.avatar_url || null,
              initials: (
                clientData?.company_name ||
                clientData?.full_name ||
                "PC"
              )
                .slice(0, 2)
                .toUpperCase(),
              lastSnippet: msg.content,
              formattedTime: new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
          }
        });

        setConversations(distinctChats);

        // FIX #2: Pick the first explicit data map item rather than setting the entire collection array
        if (distinctChats.length > 0 && !activeChat) {
    setActiveChat(distinctChats[0]);
  }
      } catch (err) {
        console.error("Inbox setup trace failure:", err.message);
      } finally {
        setLoading(false);
      }
    };

    // 3. Keep messages loaded and listening in real time
    useEffect(() => {
      // Check for property presence safely
      if (!activeChat?.job_id) return;

      const pullMessageStream = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("job_id", activeChat.job_id)
          .order("created_at", { ascending: true });

        if (!error) setMessages(data || []);
        triggerScroll();
      };

      pullMessageStream();

      const pipelineChannel = supabase
        .channel(`realtime:job_stream:${activeChat.job_id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            // FIX #3: Run primitive string conversion to prevent integer vs string comparison failure loops
            const payloadJobId = String(payload.new?.job_id);
            const activeJobId = String(activeChat?.job_id);

            if (payload.new && payloadJobId === activeJobId) {
              setMessages((prev) => {
                if (prev.some((m) => m.id === payload.new.id)) return prev;
                return [...prev, payload.new];
              });

              // Update sidebar snippet real-time loop updates dynamically
              setConversations((prevConvs) =>
                prevConvs.map((c) =>
                  String(c.job_id) === payloadJobId
                    ? {
                        ...c,
                        lastSnippet: payload.new.content,
                        formattedTime: new Date(payload.new.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      }
                    : c
                )
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(pipelineChannel);
      };
      
    // FIX #4: Watch the primitive ID property value explicitly instead of the shifting object address instance
    }, [activeChat?.job_id]);

    useEffect(() => {
      triggerScroll();
    }, [messages]);

    const triggerScroll = () => {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    };

    // 4. Handle sending messages downstream
    const executeTransmission = async (e) => {
      if (e) e.preventDefault();
      if (!chatMessageInput.trim() || !activeChat || !currentUser) return;

      const messagePayload = {
        job_id: activeChat.job_id,
        sender_id: currentUser.id,
        receiver_id: activeChat.counterpart_id,
        content: chatMessageInput.trim(),
        read: false,
      };

      setChatMessageInput(""); // Snappy UI reset locally

      const { error } = await supabase.from("messages").insert([messagePayload]);

      if (error) console.error("Message write dropped:", error.message);
    };

    // Filter conversations list on search input
    const filteredConversations = conversations.filter(
      (c) =>
        c.displayName.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
        c.projectTitle.toLowerCase().includes(clientSearchQuery.toLowerCase()),
    );

    if (loading) {
      return (
        <div className="h-[580px] bg-[#111116] border border-white/[0.06] rounded-xl flex items-center justify-center text-xs text-neutral-500 font-mono">
          Securing telemetry chat arrays...
        </div>
      );
    }

    return (
      <div>
        <div className="lg:col-span-12 bg-[#111116] border border-white/[0.06] rounded-xl overflow-hidden h-[580px] flex shadow-2xl">
          {/* INBOX INDEX LIST PANE */}
          <div className="w-5/12 border-r border-white/[0.06] flex flex-col h-full bg-black/10">
            <div className="p-3.5 border-b border-white/[0.06] bg-black/20 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Conversations
              </span>
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
              {filteredConversations.map((thread) => {
                const isActive = activeChat?.job_id === thread.job_id;
                return (
                  <div
                    key={thread.job_id}
                    onClick={() => setActiveChat(thread)}
                    className={`p-3.5 flex gap-3 cursor-pointer transition-colors relative text-left ${isActive ? "bg-white/[0.03] border-l-2 border-indigo-500" : "hover:bg-white/[0.01]"}`}
                  >
                    <div className="relative flex-shrink-0">
                      {thread.avatar_url ? (
                        <img
                          src={thread.avatar_url}
                          alt={thread.displayName}
                          className="w-8 h-8 rounded-lg object-cover border border-white/[0.05]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-white/[0.05] flex items-center justify-center font-bold text-xs text-neutral-300 uppercase">
                          {thread.initials}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-neutral-200 truncate">
                          {thread.displayName}
                        </h4>
                        <span className="text-[9px] text-neutral-500 font-mono">
                          {thread.formattedTime}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate font-medium">
                        {thread.projectTitle}
                      </p>
                      <p className="text-[10px] text-neutral-500 truncate font-light mt-0.5">
                        {thread.lastSnippet}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LIVE SYSTEM TERMINAL VIEW SCREEN */}
          <div className="w-7/12 flex flex-col h-full bg-[#0b0b0f]">
            {activeChat ? (
              <>
                <div className="p-3.5 border-b border-white/[0.06] bg-[#111116] flex justify-between items-center text-left">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1 truncate">
                      {activeChat.displayName}{" "}
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </h3>
                    <p className="text-[10px] text-neutral-400 truncate">
                      Workspace Channel •{" "}
                      <span className="text-indigo-400">
                        {activeChat.projectTitle}
                      </span>
                    </p>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-neutral-500 hover:text-white cursor-pointer" />
                </div>

                {/* MESSAGES VIEW TIMELINE */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 hide-scrollbar text-left">
                  <div className="text-center">
                    <span className="text-[9px] text-neutral-600 bg-neutral-900 border border-white/[0.02] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      Secure Direct Node Attached
                    </span>
                  </div>

                  {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 text-xs border ${
                            isMe
                              ? "bg-indigo-600 border-indigo-500 text-white rounded-xl rounded-tr-none shadow"
                              : "bg-[#181822] border-white/[0.05] text-neutral-200 rounded-xl rounded-tl-none"
                          }`}
                        >
                          <p className="font-light leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>
                        <span className="text-[8px] text-neutral-500 font-mono mt-1 px-1">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
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
                      onKeyDown={(e) =>
                        e.key === "Enter" && executeTransmission()
                      }
                      className="flex-1 h-8 bg-[#181822] border border-white/[0.06] rounded px-3 text-xs text-neutral-200 outline-none focus:border-indigo-500/40"
                    />
                    <button
                      onClick={executeTransmission}
                      className="h-8 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold text-xs flex items-center justify-center transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 text-xs p-6">
                <MessageSquare className="w-8 h-8 text-neutral-700 mb-2" />
                Select an active production contract conversation to stream
                pipeline diagnostics.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  export default MessagingView;