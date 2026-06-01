
// src/components/client/views/ProfessionalDashboard.jsx

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import MessagingView from "../../components/professional/MessagingView";
import ProfileView from "../../components/professional/ProfileView";
import HomeView from "../../components/professional/HomeView";
import UploadPortfolioModal from "../../components/professional/UploadPortfolioModal";
import JobsView from "../../components/professional/JobsView";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  
  // Primary Context Tabs matching LinkedIn main navbar routing paths
  // Options: "home" (Feed), "jobs" (Job Board), "messaging" (Advanced Chat), "profile" (Detailed CV Hub)
  const [currentTab, setCurrentTab] = useState("home");
  
  // Internal view states for Jobs Sub-navigation
  const [jobsSubTab, setJobsSubTab] = useState("explore"); // "explore" | "applied" | "saved"
  const [selectedJobView, setSelectedJobView] = useState(null);

  /* ==========================================================================
     1. LINKEDIN-STYLE HOME SOCIAL FEED DATA MATRIX
     ========================================================================== */
  const [homePosts, setHomePosts] = useState([
    {
      id: "POST-101",
      author: {
        name: "Alex Rivers",
        title: "Lead Frontend Engineer & Digital Creator",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
      },
      time: "2 hours ago",
      content: "Just finalized the design tokens and fluid physics engine for the new KINETICA project interface system. Built with performance and pure brutalist aesthetic boundaries in mind. Let me know your thoughts on the typography layout!",
      media: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      techUsed: ["Photoshop", "Figma", "After Effects", "Tailwind CSS"],
      likes: 42,
      comments: 11,
      hasLiked: false
    },
    {
      id: "POST-102",
      author: {
        name: "Vanguard Cinema Group",
        title: "Enterprise Entertainment Studio",
        avatar: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=100&q=80",
        isCompany: true
      },
      time: "5 hours ago",
      content: "We are officially expanding our external network pipeline for digital layout creators. If you have deep specialization in After Effects composition structures, custom element trackers, and micro-interactions, explore our active roles in the Jobs tab.",
      techUsed: ["After Effects", "Cinema 4D", "Premiere Pro"],
      likes: 184,
      comments: 56,
      hasLiked: false
    }
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [newPostTools, setNewPostTools] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeJobCategory, setActiveJobCategory] = useState("all");
  const [savedJobIds, setSavedJobIds] = useState(["JOB-884"]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  
  const [jobsFeed, setJobsFeed] = useState([
    { 
      id: "JOB-902", 
      client: "Vanguard Cinema Group", 
      title: "Summer Fashion Show Video Shoot & Post-Production", 
      budget: "$8,500 - $11,000", 
      city: "Paris",
      state: "France",
      time: "14m ago",
      category: "video",
      verified: true,
      experienceLevel: "Senior / Director Tier",
      applicants: 14,
      employeeCount: "501-1,000 employees",
      description: "We are seeking an elite digital creator to handle both principal cinematography and complex post-production timelines for our upcoming high-end fashion catalog rollout. The final video outputs require seamless tracking layers, custom asset composition layout structures, and high-fidelity technical color grading matrices.",
      requiredTools: ["After Effects", "Premiere Pro", "DaVinci Resolve", "Photoshop"],
      tags: ["Video Production", "Color Grading", "Fashion Film"]
    },
    { 
      id: "JOB-884", 
      client: "Nexus Indie Labs", 
      title: "3D Fluid Simulation for Sci-Fi Title Sequence", 
      budget: "$4,500 Flat", 
      city: "Los Angeles",
      state: "California",
      time: "2h ago",
      category: "motion",
      verified: true,
      experienceLevel: "Mid-Senior Level",
      applicants: 8,
      employeeCount: "11-50 employees",
      description: "Looking for a seasoned 3D artist to create a smooth, abstract 45-second fluid animation for the opening titles of an upcoming independent feature film. Must understand custom visual effects and delivery specs for projection layers.",
      requiredTools: ["Cinema 4D", "Houdini", "After Effects"],
      tags: ["3D Animation", "VFX Distortion", "Title Sequence"]
    },
    { 
      id: "JOB-712", 
      client: "ShadowBox Media Corp", 
      title: "Premium Kinetic Typography Reel & Sound Syncing", 
      budget: "$1,200 Fixed", 
      city: "Detroit",
      state: "Michigan",
      time: "5h ago",
      category: "motion",
      verified: false,
      experienceLevel: "Intermediate Tier",
      applicants: 29,
      employeeCount: "1-10 employees",
      description: "Need an energetic, typography-focused motion designer to edit and treat a 60-second audio track with brutalist/minimal text animations for a street-culture apparel launch campaign.",
      requiredTools: ["After Effects", "Illustrator", "Photoshop"],
      tags: ["Kinetic Type", "Brutalist Design", "Audio Sync"]
    }
  ]);

  const [profile, setProfile] = useState({
    name: "Alex Rivers",
    title: "Lead Frontend Engineer & Digital Creator",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    bio: "Specialized in building high-end interactive interfaces, web graphics, and cinematic mobile experiences. Fusing strict technical engineering with premium, minimalist design aesthetics.",
    location: "Rajkot, Gujarat, India",
    connections: "1,420 connections",
    company: "Vertex Development",
    education: "Saurashtra University",
    mediaGrid: [
      { id: 1, type: "video", thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80", title: "StarLume Studios Portfolio Hub", views: "4.2K", techStack: ["React Three Fiber", "Tailwind CSS", "Blender"] },
      { id: 2, type: "image", thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80", title: "KINETICA Interface Design Specimen", views: "1.8K", techStack: ["Photoshop", "Figma", "Illustrator"] },
      { id: 3, type: "video", thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80", title: "Fuse Mobile App - Immersive Onboarding", views: "8.9K", techStack: ["React Native", "Framer Motion", "After Effects"] },
      { id: 4, type: "image", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80", title: "Hibernate Branding Guidelines v1.0", views: "920", techStack: ["Illustrator", "InDesign", "Photoshop"] }
    ]
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMediaTitle, setNewMediaTitle] = useState("");
  const [newMediaType, setNewMediaType] = useState("image");
  const [newMediaTech, setNewMediaTech] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [chatMessageInput, setChatMessageInput] = useState("");

  const [chatThreads, setChatThreads] = useState([
    {
      id: 1,
      clientName: "Marcus Vance (Vanguard Cinema)",
      logo: "VC",
      verified: true,
      titleRole: "Talent Acquisition Director",
      projectContext: "Summer Fashion Show Video Shoot",
      time: "14m ago",
      onlineStatus: "active",
      messages: [
        { id: 101, sender: "them", text: "Hi Alex, our creative board spent the morning looking over your StarLume Studios portfolio node. The visual pacing is top-tier.", timestamp: "10:24 AM" },
        { id: 102, sender: "them", text: "Are you available to travel to Europe for this shoot or handle the tracking overlays completely remotely from your current desk framework?", timestamp: "10:25 AM" }
      ]
    },
    {
      id: 2,
      clientName: "Sarah Finch (Nexus Indie Labs)",
      logo: "NX",
      verified: true,
      titleRole: "Lead Technical Producer",
      projectContext: "3D Fluid Simulation Project",
      time: "2h ago",
      onlineStatus: "away",
      messages: [
        { id: 201, sender: "me", text: "Hey Sarah, dropped over my updated pipeline tests generated out of Houdini and mapped onto standard React Three Fiber viewports. Let me know what your engineer group thinks.", timestamp: "Yesterday" },
        { id: 202, sender: "them", text: "Wow, the liquid distortion is smooth. Let's block out 15 minutes to talk architecture constraints on Thursday morning.", timestamp: "Yesterday" }
      ]
    }
  ]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatThreads, selectedChatId]);

  useEffect(() => {
    if (jobsFeed.length > 0 && !selectedJobView) {
      setSelectedJobView(jobsFeed[0]);
    }
  }, [jobsFeed, selectedJobView]);
  
  const handleLikePost = (postId) => {
    setHomePosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    }));
  };

  const handleCreateHomePost = () => {
    if (!newPostText.trim()) return;
    const toolsArray = newPostTools.split(",").map(t => t.trim()).filter(t => t.length > 0);
    
    const targetPost = {
      id: `POST-${Date.now()}`,
      author: {
        name: profile.name,
        title: profile.title,
        avatar: profile.avatar
      },
      time: "Just now",
      content: newPostText,
      techUsed: toolsArray.length > 0 ? toolsArray : [],
      likes: 0,
      comments: 0,
      hasLiked: false
    };

    setHomePosts([targetPost, ...homePosts]);
    setNewPostText("");
    setNewPostTools("");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith("video/")) setNewMediaType("video");
      else if (file.type.startsWith("image/")) setNewMediaType("image");
    }
  };

  const handleCreateMediaItem = async () => {
    if (!newMediaTitle.trim() || !selectedFile) return;

    try {
      setIsUploading(true);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets") 
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(filePath);

      const derivedUrl = newMediaType === "video" 
        ? "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80" 
        : publicUrl;

      const parsedTech = newMediaTech.split(",").map(t => t.trim()).filter(t => t.length > 0);

      setProfile(prev => ({
        ...prev,
        mediaGrid: [{ 
          id: Date.now(), 
          type: newMediaType, 
          thumbnail: derivedUrl, 
          title: newMediaTitle, 
          views: "10",
          techStack: parsedTech.length > 0 ? parsedTech : ["Asset Creation"]
        }, ...prev.mediaGrid]
      }));

      setNewMediaTitle("");
      setNewMediaTech("");
      setSelectedFile(null);
      setShowUploadModal(false);
    } catch (error) {
      console.error("Upload error caught: ", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessageInput.trim()) return;
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatThreads(prev => prev.map(thread => {
      if (thread.id === selectedChatId) {
        return {
          ...thread,
          lastMessage: chatMessageInput,
          time: "Just now",
          messages: [...thread.messages, { id: Date.now(), sender: "me", text: chatMessageInput, timestamp: formattedTime }]
        };
      }
      return thread;
    }));
    setChatMessageInput("");
  };

  const toggleSaveJob = (jobId, e) => {
    e.stopPropagation();
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(prev => prev.filter(id => id !== jobId));
    } else {
      setSavedJobIds(prev => [...prev, jobId]);
    }
  };

  const handleApplyJob = (jobId) => {
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds(prev => [...prev, jobId]);
      
      // Update applicant count inside view state automatically
      setJobsFeed(prev => prev.map(j => j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j));
      if (selectedJobView?.id === jobId) {
        setSelectedJobView(prev => ({ ...prev, applicants: prev.applicants + 1 }));
      }
    }
  };

  // Compute filtered jobs lists based on dynamic sub-tab filters
  const getFilteredJobs = () => {
    let list = jobsFeed;
    if (jobsSubTab === "saved") {
      list = jobsFeed.filter(j => savedJobIds.includes(j.id));
    } else if (jobsSubTab === "applied") {
      list = jobsFeed.filter(j => appliedJobIds.includes(j.id));
    }
    
    if (activeJobCategory !== "all") {
      list = list.filter(j => j.category === activeJobCategory);
    }

    return list.filter(j => 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.client.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const currentFilteredJobs = getFilteredJobs();
  const activeChatRoom = chatThreads.find(t => t.id === selectedChatId);

  return (
    <div className="min-h-screen bg-[#09090d] text-[#e2e2e9] antialiased flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #09090d; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* GLOBAL ENTERPRISE NAVBAR CONTAINER */}
      <ProfessionalNavbar
  currentTab={currentTab}
  setCurrentTab={setCurrentTab}
  chatThreads={chatThreads}
/>

      <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-6 pt-5 flex-1">
        
      {currentTab === "home" && (
  <HomeView
    profile={profile}
    homePosts={homePosts}
    newPostText={newPostText}
    setNewPostText={setNewPostText}
    newPostTools={newPostTools}
    setNewPostTools={setNewPostTools}
    handleCreateHomePost={handleCreateHomePost}
    handleLikePost={handleLikePost}
  />
)}


{currentTab === "jobs" && (
  <JobsView
  jobsFeed={jobsFeed}
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  jobsSubTab={jobsSubTab}
  setJobsSubTab={setJobsSubTab}
  selectedJobView={selectedJobView}
  setSelectedJobView={setSelectedJobView}
  savedJobIds={savedJobIds}
  appliedJobIds={appliedJobIds}
  toggleSaveJob={toggleSaveJob}
  handleApplyJob={handleApplyJob}
  currentFilteredJobs={currentFilteredJobs}
/>
)}

 {currentTab === "messaging" && (
  <MessagingView
  chatThreads={chatThreads}
  selectedChatId={selectedChatId}
  setSelectedChatId={setSelectedChatId}
  clientSearchQuery={clientSearchQuery}
  setClientSearchQuery={setClientSearchQuery}
  chatMessageInput={chatMessageInput}
  setChatMessageInput={setChatMessageInput}
  handleSendMessage={handleSendMessage}
  chatEndRef={chatEndRef}
  activeChatRoom={activeChatRoom}
/>
)}

 {currentTab === "profile" && (
  <ProfileView
    profile={profile}
    setShowUploadModal={setShowUploadModal}
    setCurrentTab={setCurrentTab}
    navigate={navigate}
  />
)}

      </div>

      {/* POPUP CONTAINER MODAL: APPEND PORTFOLIO INSTANCE LAYER */}
       <UploadPortfolioModal
  showUploadModal={showUploadModal}
  setShowUploadModal={setShowUploadModal}
  newMediaTitle={newMediaTitle}
  setNewMediaTitle={setNewMediaTitle}
  newMediaTech={newMediaTech}
  setNewMediaTech={setNewMediaTech}
  selectedFile={selectedFile}
  handleFileChange={handleFileChange}
  handleCreateMediaItem={handleCreateMediaItem}
  isUploading={isUploading}
/>

    </div>
  );
};

export default ProfessionalDashboard;