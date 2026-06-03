import { useEffect, useState } from "react";
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



useEffect(() => {
  getCurrentUser();
}, []);

const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  setCurrentUser(user);
};

useEffect(() => {
  if (selectedWorkspace?.id) {
    fetchMessages(selectedWorkspace.id);
  }
}, [selectedWorkspace]);

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

      setWorkspaces(jobs);

      if (jobs.length > 0) {
        setSelectedWorkspace(jobs[0]);
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

    fetchMessages(selectedWorkspace.id);
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
              <p className="text-sm text-white font-medium">
                {job.title}
              </p>

              <p className="text-xs text-neutral-400 mt-1">
                {job.client?.company_name ||
                  job.client?.full_name}
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

  <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
            {msg.content}
          </div>
        </div>
      );
    })}
  </div>

  <div className="p-3 border-t border-white/[0.06] flex gap-2">
    <input
      type="text"
      value={messageInput}
      onChange={(e) =>
        setMessageInput(e.target.value)
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