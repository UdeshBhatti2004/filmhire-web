import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import {
  FolderKanban,
  Building2,
  Calendar,
  Wallet,
  CheckCircle,
} from "lucide-react";

function ProfessionalWorkspaceView() {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
const [messages, setMessages] = useState([]);
const [messageInput, setMessageInput] = useState("");
const [typingUser, setTypingUser] = useState(null);


  const [unreadCounts, setUnreadCounts] = useState({});


const chatEndRef = useRef(null);


const typingTimeoutRef = useRef(null);

useEffect(() => {
  getCurrentUser();
}, []);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);


useEffect(() => {
  if (!selectedWorkspace?.id) return;

  const channel = supabase
    .channel(`messages-${selectedWorkspace.id}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
      },
      (payload) => {
  const newMessage = payload.new;

  if (payload.eventType === "INSERT") {
    if (newMessage.job_id === selectedWorkspace.id) {
      setMessages((prev) => [...prev, newMessage]);
    }

    fetchWorkspaces();

    if (newMessage.receiver_id === currentUser?.id) {
      fetchUnreadCounts(currentUser.id);
    }
  }

  if (payload.eventType === "UPDATE") {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === newMessage.id ? newMessage : msg
      )
    );
  }
}
    )
    .on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "typing_status",
  },
  async (payload) => {
    const typingData = payload.new;

    if (
      typingData.workspace_id === selectedWorkspace.id &&
      typingData.user_id !== currentUser?.id
    ) {
      if (typingData.is_typing) {
  setTypingUser(
    selectedWorkspace.client?.company_name ||
      selectedWorkspace.client?.full_name
  );
} else {
  setTypingUser(null);
}
    }
  }
)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [selectedWorkspace,currentUser]);

    const fetchUnreadCounts = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("job_id")
      .eq("receiver_id", userId)
      .eq("read", false);

    if (error) throw error;

    const counts = {};

    data?.forEach((msg) => {
      counts[msg.job_id] = (counts[msg.job_id] || 0) + 1;
    });

    setUnreadCounts(counts);
  } catch (err) {
    console.error(err);
  }
};

    const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  setCurrentUser(user);

  if (user) {
    fetchUnreadCounts(user.id);
  }
};

const markMessagesAsRead = async (jobId) => {
  if (!currentUser) return;

  try {
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("job_id", jobId)
      .eq("receiver_id", currentUser.id)
      .eq("read", false);

    if (error) throw error;

    await fetchUnreadCounts(currentUser.id);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  if (selectedWorkspace?.id) {
    fetchMessages(selectedWorkspace.id);
    markMessagesAsRead(selectedWorkspace.id);
  }
}, [selectedWorkspace,currentUser]);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          status,
          jobs (
            *,
            client:profiles!jobs_client_id_fkey(
              id,
              full_name,
              company_name,
              avatar_url
            )
          )
        `)
        .eq("professional_id", user.id)
        .eq("status", "accepted");

      if (error) throw error;

      const jobs =
        data?.map((item) => ({
          ...item.jobs,
        })) || [];

   const jobsWithLastMessage = await Promise.all(
  jobs.map(async (job) => {
    const { data: lastMessageData } = await supabase
      .from("messages")
      .select("content, created_at")
      .eq("job_id", job.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
  ...job,
  lastMessage:
    lastMessageData?.content || "No messages yet",
  lastMessageAt:
    lastMessageData?.created_at || null,
};
  })
);


 jobsWithLastMessage.sort((a, b) => {
  if (!a.lastMessageAt) return 1;
  if (!b.lastMessageAt) return -1;

  return (
    new Date(b.lastMessageAt) -
    new Date(a.lastMessageAt)
  );
});

setWorkspaces(jobsWithLastMessage);

if (!selectedWorkspace && jobsWithLastMessage.length > 0) {
  setSelectedWorkspace(jobsWithLastMessage[0]);
}
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (jobId) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    setMessages(data || []);
  } catch (err) {
    console.error(err);
  }
};

const handleTyping = async (value) => {
  setMessageInput(value);

    console.log("typing...");


  if (!selectedWorkspace || !currentUser) return;

  const { data, error } = await supabase
  .from("typing_status")
  .upsert({
    workspace_id: selectedWorkspace.id,
    user_id: currentUser.id,
    is_typing: true,
    updated_at: new Date().toISOString(),
  })
  .select();

console.log("UPSERT RESULT:", JSON.stringify(data, null, 2));
console.log("UPSERT ERROR:", error);

  clearTimeout(typingTimeoutRef.current);

  typingTimeoutRef.current = setTimeout(async () => {
    await supabase
      .from("typing_status")
      .upsert({
        workspace_id: selectedWorkspace.id,
        user_id: currentUser.id,
        is_typing: false,
        updated_at: new Date().toISOString(),
      });
  }, 2000);
};


const handleSendMessage = async () => {
  if (
    !messageInput.trim() ||
    !selectedWorkspace ||
    !currentUser
  )
    return;

  try {
    const receiverId =
      selectedWorkspace.client?.id;

    const { error } = await supabase
      .from("messages")
      .insert({
        job_id: selectedWorkspace.id,
        sender_id: currentUser.id,
        receiver_id: receiverId,
        content: messageInput.trim(),
      });

    if (error) throw error;

    setMessageInput("");

    const { data } = await supabase
  .from("typing_status")
  .upsert({
    workspace_id: selectedWorkspace.id,
    user_id: currentUser.id,
    is_typing: true,
    updated_at: new Date().toISOString(),
  })
  .select();

console.log("typing true", data, error);

  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="bg-[#111116] border border-white/[0.06] rounded-xl overflow-hidden h-[650px] flex">

      {/* LEFT */}
      <div className="w-1/4 border-r border-white/[0.06]">
        <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Workspaces
          </h3>
        </div>

        <div className="overflow-y-auto">
          {workspaces.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedWorkspace(job)}
              className={`w-full text-left p-4 border-b border-white/[0.04]
              ${
                selectedWorkspace?.id === job.id
                  ? "bg-white/[0.04]"
                  : "hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-white font-medium">
                  {job.title}
                </p>

  {unreadCounts[job.id] > 0 && (
    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
      {unreadCounts[job.id]}
    </span>
  )}
</div>

              <p className="text-xs text-neutral-400 mt-1 truncate">
  {job.lastMessage}
</p>
            </button>
          ))}
        </div>
      </div>

      {/* MIDDLE */}
      <div className="flex-1 p-6">
        {selectedWorkspace ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-white">
                {selectedWorkspace.title}
              </h2>

              <p className="text-sm text-neutral-400 mt-1">
                Accepted Project Workspace
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-neutral-400">
                    Client
                  </span>
                </div>

                <p className="text-white">
                  {selectedWorkspace.client?.company_name ||
                    selectedWorkspace.client?.full_name}
                </p>
              </div>

              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-neutral-400">
                    Budget
                  </span>
                </div>

                <p className="text-white">
                  ₹{selectedWorkspace.budget_min} - ₹
                  {selectedWorkspace.budget_max}
                </p>
              </div>

              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-neutral-400">
                    Created
                  </span>
                </div>

                <p className="text-white">
                  {new Date(
                    selectedWorkspace.created_at
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-neutral-400">
                    Status
                  </span>
                </div>

                <p className="text-green-400">
                  {selectedWorkspace.status}
                </p>
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3">
                Project Description
              </h4>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {selectedWorkspace.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-neutral-500">
            No accepted projects yet
          </div>
        )}
      </div>

     {/* RIGHT */}
<div className="w-[380px] border-l border-white/[0.06] flex flex-col">
  <div className="p-4 border-b border-white/[0.06]">
    <h3 className="text-sm font-semibold text-white">
      Project Chat
    </h3>
  </div>

  <div className="flex-1 overflow-y-auto p-4">
  {messages.length === 0 ? (
    <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
      Start your conversation here
    </div>
  ) : (
<div className="space-y-3">
      {messages.map((msg) => {
      const isMine =
        msg.sender_id === currentUser?.id;

      return (
        <div
          key={msg.id}
          className={`flex ${
            isMine
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
    isMine
      ? "bg-indigo-600 text-white"
      : "bg-[#181822] text-neutral-200"
  }`}
>
  <div>{msg.content}</div>

  <div className="text-[10px] mt-1 opacity-70 flex items-center gap-1">
  <span>
    {new Date(msg.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </span>

 {isMine && (
  <span
    className={`text-[11px] font-semibold ${
      msg.read
        ? "text-sky-400"
        : "text-neutral-400"
    }`}
  >
    {msg.read ? "✓✓" : "✓"}
  </span>
)}
</div>
</div>
        </div>
      );
    })}
    {typingUser && (
  <div className="text-xs text-neutral-400 italic">
    {typingUser} is typing...
  </div>
)}

      <div ref={chatEndRef} />

  </div>
  )}
</div>

  

  <div className="p-3 border-t border-white/[0.06] flex gap-2">
    <input
      type="text"
      value={messageInput}
      onChange={(e) =>
  handleTyping(e.target.value)
      }
      onKeyDown={(e) =>
        e.key === "Enter" &&
        handleSendMessage()
      }
      placeholder="Type message..."
      className="flex-1 bg-[#181822] border border-white/[0.06] rounded px-3 text-sm text-white outline-none"
    />

    <button
      onClick={handleSendMessage}
      className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded text-white text-sm"
    >
      Send
    </button>
  </div>
</div>
    </div>
  );
}

export default ProfessionalWorkspaceView;