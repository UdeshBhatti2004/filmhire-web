import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import MessagingView from "../../components/professional/MessagingView";
import ProfileView from "../../components/professional/ProfileView";
import HomeView from "../../components/professional/HomeView";
import UploadPortfolioModal from "../../components/professional/UploadPortfolioModal";
import JobsView from "../../components/professional/JobsView";
import ProfessionalNavbar from "../../components/professional/ProfessionalNavbar";
import ProfessionalWorkspaceView from "../../components/professional/ProfessionalWorkspaceView";


const ProfessionalDashboard = () => {
  const navigate = useNavigate();
 
  const [feedJobs, setFeedJobs] = useState([]);
  const [applicationStatuses, setApplicationStatuses] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]); 

    const [currentTab, setCurrentTab] = useState("home");
  const [jobsSubTab, setJobsSubTab] = useState("explore"); 
  const [selectedJobView, setSelectedJobView] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const [profile, setProfile] = useState(null);
  

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMediaTitle, setNewMediaTitle] = useState("");
  const [newMediaType, setNewMediaType] = useState("image");
  const [newMediaTech, setNewMediaTech] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


  const fetchFeedJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select(
        `
        *,
        client:profiles!jobs_client_id_fkey(
          id,
          full_name,
          avatar_url,
          company_name
        )
      `,
      )
      .eq("status", "open")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }

    setFeedJobs(data || []);
  };

  const fetchAppliedJobs = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("job_applications")
        .select("job_id, status")
        .eq("professional_id", user.id);

      if (error) throw error;

      const statusMap = {};
      const appliedIds = [];

      if (data) {
        data.forEach((item) => {
          statusMap[item.job_id] = item.status || "pending";
          appliedIds.push(item.job_id);
        });
      }

      setApplicationStatuses(statusMap);
      setAppliedJobIds(appliedIds);
    } catch (err) {
      console.error("Applied jobs error tracking trace:", err);
    }
  };

  

useEffect(() => {
  if (feedJobs.length > 0 && !selectedJobView) {
    setSelectedJobView(feedJobs[0]);
  }
}, [feedJobs]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files?.[0];
setSelectedFile(file);
      if (file.type.startsWith("video/")) setNewMediaType("video");
      else if (file.type.startsWith("image/")) setNewMediaType("image");
    }
  };

  const handleCreateMediaItem = async () => {
    if (!newMediaTitle.trim() || !selectedFile) return;

    try {
      setIsUploading(true);
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio-assets").getPublicUrl(filePath);

      const derivedUrl =
        newMediaType === "video"
          ? "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80"
          : publicUrl;

      const parsedTech = newMediaTech
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      setProfile((prev) => ({
        ...prev,
        mediaGrid: [
          {
            id: Date.now(),
            type: newMediaType,
            thumbnail: derivedUrl,
            title: newMediaTitle,
            views: "10",
            techStack: parsedTech.length > 0 ? parsedTech : ["Asset Creation"],
          },
          ...prev.mediaGrid,
        ],
      }));

      // FIXED: Cleared out syntax crashes here
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

  const toggleSaveJob = (jobId, e) => {
    e.stopPropagation();
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
    } else {
      setSavedJobIds((prev) => [...prev, jobId]);
    }
  };

 const refreshApplications = async () => {
  await fetchAppliedJobs();
  await fetchAppliedJobsData();
};

  const getFilteredJobs = () => {
  let list = feedJobs;

  if (jobsSubTab === "saved") {
    list = feedJobs.filter((j) => savedJobIds.includes(j.id));
  } else if (jobsSubTab === "applied") {
    list = appliedJobs;
  }


    return list.filter(
      (j) =>
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.client?.company_name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  };

  const fetchAppliedJobsData = async () => {
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
            avatar_url,
            company_name
          )
        )
      `)
      .eq("professional_id", user.id);

    if (error) throw error;

    const jobs =
      data?.map((item) => ({
        ...item.jobs,
        applicationStatus: item.status,
      })) || [];

    setAppliedJobs(jobs);
  } catch (err) {
    console.error(err);
  }
};
  const currentFilteredJobs = getFilteredJobs();

  useEffect(() => {
  fetchFeedJobs();
  fetchAppliedJobs();
  fetchAppliedJobsData();
}, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090d] text-[#e2e2e9] antialiased flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #09090d; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <ProfessionalNavbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        
      />

      <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-6 pt-5 flex-1">
        {currentTab === "home" && (
          <HomeView
  profile={profile}
  feedJobs={feedJobs}
  setCurrentTab={setCurrentTab}
/>
        )}

        {currentTab === "jobs" && (
          <JobsView
            jobsFeed={feedJobs}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            jobsSubTab={jobsSubTab}
            setJobsSubTab={setJobsSubTab}
            selectedJobView={selectedJobView}
            setSelectedJobView={setSelectedJobView}
            savedJobIds={savedJobIds}
            appliedJobIds={appliedJobIds}
            applicationStatuses={applicationStatuses}
            toggleSaveJob={toggleSaveJob}
            handleApplyJob={refreshApplications}
            currentFilteredJobs={currentFilteredJobs}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === "workspaces" && (
  <ProfessionalWorkspaceView />
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