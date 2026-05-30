import { useEffect, useState } from "react";
import {
  Compass,
  Briefcase,
  Users,
  PlusCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Search,
  Bell,
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  Activity,
  ChevronRight,
  Terminal,
  Send,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import ClientHeader from "../../components/client/ClientHeader";
import ClientSidebar from "../../components/client/ClientSidebar";
import ClientDock from "../../components/client/ClientDock";
import TalentFeed from "../../components/client/TalentFeed";
import Messages from "../../components/client/Messages";
import CreateJob from "../../components/client/CreateJob";
import ManageJobs from "../../components/client/ManageJobs";
import Applicants from "../../components/client/Applicants";
import ClientActivityPanel from "../../components/client/ClientActivityPanel";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("talent-feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("All");
  const [activeChatId, setActiveChatId] = useState("chat-1");
  const [typedMessage, setTypedMessage] = useState("");
  const [job, setJob] = useState(null);




  const [conversations, setConversations] = useState([
    {
      id: "chat-1",
      name: "Devon Lane",
      role: "3D Environment Artist",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      messages: [
        {
          id: 1,
          sender: "them",
          text: "Hey Marcus, checked out the design specs for the virtual production set.",
          time: "10:14 AM",
        },
        {
          id: 2,
          sender: "me",
          text: "Awesome! What do you think about the wet asphalt shader approach?",
          time: "10:16 AM",
        },
        {
          id: 3,
          sender: "them",
          text: "Shader optimizations are complete. Custom sub-surface scattering matrices look extremely clean under neon arrays.",
          time: "14m ago",
        },
      ],
    },
    {
      id: "chat-2",
      name: "Marcus Vane",
      role: "Senior Colorist",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
      messages: [
        {
          id: 1,
          sender: "me",
          text: "Hi Marcus, can you supply your recent workflow file for the ACES lookup matrices?",
          time: "Yesterday",
        },
        {
          id: 2,
          sender: "them",
          text: "Attaching updated showreel file...",
          time: "2h ago",
        },
      ],
    },
    {
      id: "chat-3",
      name: "Elena Rostova",
      role: "Senior Colorist",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
      messages: [
        {
          id: 1,
          sender: "me",
          text: "Welcome to Hibernate Studios, Elena! Let's schedule an initial onboarding call soon.",
          time: "3 days ago",
        },
      ],
    },
  ]);

  const activeChat =
    conversations.find((c) => c.id === activeChatId) || conversations;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: Date.now(),
                sender: "me",
                text: typedMessage.trim(),
                time: "Just now",
              },
            ],
          };
        }
        return chat;
      }),
    );
    setTypedMessage("");
  };

  const handleDirectRouteToChat = (candidateName, candidateAvatar) => {
    const existingChat = conversations.find(
      (c) => c.name.toLowerCase() === candidateName.toLowerCase(),
    );

    if (existingChat) {
      setActiveChatId(existingChat.id);
    } else {
      const newId = `chat-${Date.now()}`;
      const newChat = {
        id: newId,
        name: candidateName,
        role: "Professional",
        avatar: candidateAvatar,
        messages: [
          {
            id: 1,
            sender: "me",
            text: "Hi! Let's discuss your application profile.",
            time: "Just now",
          },
        ],
      };
      setConversations([newChat, ...conversations]);
      setActiveChatId(newId);
    }
    setActiveView("messages");
  };

  // Authentication Gate
  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "client") {
        navigate("/professional/dashboard");
      }
    };
    checkAccess();
  }, [navigate]);

  // ==========================================
  // REALISTIC DASHBOARD DATASETS
  // ==========================================
  const [talentFeed] = useState([
    {
      id: "TALENT-771",
      artist: "Devon Lane",
      role: "3D Environment Artist",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      rate: "$95/hr",
      experience: "Senior (6+ Yrs)",
      title: "Cyberpunk Alleyway - Realtime UE5 Render",
      image:
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop",
      description:
        "Finished optimization framework for a cinematic virtual production environment. Implemented custom sub-surface scattering shaders for wet asphalt textures under neon load arrays.",
      software: ["Unreal Engine 5", "Houdini", "Substance"],
      match: "98% Match",
    },
    {
      id: "TALENT-769",
      artist: "Elena Rostova",
      role: "Senior Colorist",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
      rate: "$120/hr",
      experience: "Lead / Supervisor",
      title: "Commercial Film Grade - ACES Pipeline Workflow",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
      description:
        "Color timing breakdown for an upcoming high-fashion lifestyle brand campaign. Emphasized rich filmic skin tones, deep organic shadows, and dynamic green channel isolation matrices.",
      software: ["DaVinci Resolve", "Nuke", "Lattice"],
      match: "94% Match",
    },
  ]);

  const [myJobs] = useState([
    {
      id: "JOB-101",
      title: "Lead Colorist (ACES)",
      applications: 24,
      accepted: 2,
      reviewing: 14,
      status: "Open",
      budget: "$4,500",
      speed: "Urgent",
    },
    {
      id: "JOB-102",
      title: "UE5 Technical Generalist",
      applications: 42,
      accepted: 1,
      reviewing: 31,
      status: "Open",
      budget: "$8,000",
      speed: "Normal",
    },
    {
      id: "JOB-103",
      title: "High-Fashion Cinematographer",
      applications: 18,
      accepted: 0,
      reviewing: 8,
      status: "Draft",
      budget: "$6,000",
      speed: "Flexible",
    },
  ]);

  const [applicants] = useState([
    {
      id: "APP-01",
      name: "Marcus Vane",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
      jobTitle: "Lead Colorist (ACES)",
      role: "Senior Colorist",
      matchScore: "96%",
      status: "Reviewing",
    },
    {
      id: "APP-02",
      name: "Sasha Grey",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
      jobTitle: "UE5 Technical Generalist",
      role: "Technical Artist",
      matchScore: "91%",
      status: "Hired",
    },
    {
      id: "APP-03",
      name: "Amara Singh",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop",
      jobTitle: "Lead Colorist (ACES)",
      role: "Finishing Artist",
      matchScore: "84%",
      status: "Pending",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#040408] text-slate-200 flex flex-col antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=400;500;600;700;800&family=JetBrains+Mono:wght=400;500;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #040408; }
        .font-mono { font-family: 'JetBrains Mono', sans-serif; }
        
        .border-premium { border-color: rgba(255, 255, 255, 0.04); }
        .panel-solid { background-color: #09090F; border: 1px solid rgba(255, 255, 255, 0.04); }
        .input-solid { background-color: #06060A; border: 1px solid rgba(255, 255, 255, 0.06); }
        .input-solid:focus { border-color: #06B6D4; outline: none; box-shadow: 0 0 12px rgba(6, 182, 212, 0.15); }
        
        .dock-blur {
          background: rgba(9, 9, 15, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 24px 60px -12px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05);
        }
      `}</style>

      {/* Top Main Navigation Header */}
      <ClientHeader />

      {/* Main Workspace Frame container */}
      <div className="flex-1 w-full max-w-[1700px] mx-auto px-4 lg:px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5 pb-24">
        {/* LEFT COLUMN: NAVIGATION & FILTER MENUS (3 Cols) */}
        <ClientSidebar
          activeView={activeView}
          setActiveView={setActiveView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTier={selectedTier}
          setSelectedTier={setSelectedTier}
          talentCount={talentFeed.length}
          jobsCount={myJobs.length}
          applicantsCount={applicants.length}
          conversationsCount={conversations.length}
        />

        {/* CENTER COLUMN / FULL CHAT WORKSPACE CONTEXT */}
        <main
          className={`${activeView === "messages" ? "lg:col-span-10 grid grid-cols-1 md:grid-cols-12 border border-premium bg-[#09090F] rounded-lg overflow-hidden min-h-[75vh]" : "lg:col-span-6 space-y-4"}`}
        >
          {/* ==========================================
              NEW: FULL INSTAGRAM-STYLE CHAT INTERFACE
              ========================================== */}
          {activeView === "messages" && (
  <Messages
    conversations={conversations}
    activeChatId={activeChatId}
    setActiveChatId={setActiveChatId}
    activeChat={activeChat}
    typedMessage={typedMessage}
    setTypedMessage={setTypedMessage}
    handleSendMessage={handleSendMessage}
  />
)}

          {/* CARD STREAM VIEW: TALENT DIRECTORY */}
          {activeView === "talent-feed" && (
  <TalentFeed
    talentFeed={talentFeed}
    handleDirectRouteToChat={handleDirectRouteToChat}
  />
)}

          {/* SIMPLIFIED FORM VIEW: CREATE A JOB POST */}
          {activeView === "create-job" && <CreateJob />}

          {/* DATA LOG LIST VIEW: MANAGE CURRENT LISTINGS */}
          {activeView === "manage-jobs" && (
  <ManageJobs  />
)}

          {/* TABLE MATRIX VIEW: REVIEW APPLICANTS */}
          {activeView === "applicants" && (
  <Applicants
    applicants={applicants}
    handleDirectRouteToChat={handleDirectRouteToChat}
  />
)}
        </main>

        {/* RIGHT COLUMN: METRICS & SYSTEM OUTLOOK (Hidden when full layout chat is engaged to keep space clean) */}
       <ClientActivityPanel
  activeView={activeView}
  conversations={conversations}
  setActiveChatId={setActiveChatId}
  setActiveView={setActiveView}
/>
      </div>

      {/* Persistent Floating Bottom Dock Navigation */}
      <ClientDock activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default ClientDashboard;
