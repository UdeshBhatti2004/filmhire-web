import React, { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  CheckCircle,
  Search,
  ShieldCheck,
  Clock,
  Calendar,
  MapPin,
  Filter,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function JobView({
  jobsFeed = [],
  searchQuery = "",
  setSearchQuery = () => {},
  jobsSubTab = "explore",
  setJobsSubTab = () => {},
  selectedJobView = null,
  setSelectedJobView = () => {},
  savedJobIds = [],
  appliedJobIds = [],
  applicationStatuses = {}, 
  toggleSaveJob = () => {},
  handleApplyJob = () => {},
  currentFilteredJobs = [],
  locationFilter,
  setLocationFilter,
  // ADD THE SUB-ROUTINE PARENT HOOKS HERE
  setCurrentTab = () => {},
  setActiveJobChatTarget = () => {}
}) {
  const [localLocation, setLocalLocation] = useState("");
  const activeLocation =
    locationFilter !== undefined ? locationFilter : localLocation;
  const setActiveLocation =
    setLocationFilter !== undefined ? setLocationFilter : setLocalLocation;
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        console.log("USER:", user.id);
      }
      if (error) {
        console.log("ERROR:", error);
      }
    };

    getCurrentUser();
  }, []);

  const uniqueLocations = useMemo(() => {
    if (!Array.isArray(jobsFeed)) return [];
    const locations = jobsFeed
      .map((job) => job?.location_text)
      .filter((loc) => loc && loc.trim() !== "");
    return [...new Set(locations)].sort();
  }, [jobsFeed]);

  const fullyFilteredJobs = useMemo(() => {
    if (!Array.isArray(currentFilteredJobs)) return [];
    return currentFilteredJobs.filter((job) => {
      if (!activeLocation) return true;
      return job?.location_text === activeLocation;
    });
  }, [currentFilteredJobs, activeLocation]);

  useEffect(() => {
    if (fullyFilteredJobs.length > 0) {
      const isStillAvailable = fullyFilteredJobs.some(
        (job) => job.id === selectedJobView?.id,
      );
      if (!isStillAvailable) {
        setSelectedJobView(fullyFilteredJobs[0]);
      }
    } else {
      setSelectedJobView(null);
    }
  }, [fullyFilteredJobs, selectedJobView, setSelectedJobView]);

  return (
    <div>
      <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT FILTER MANAGEMENT COLUMN */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="bg-[#111116] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="p-3 bg-black/20 border-b border-white/[0.04]">
              <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
                Job Management
              </span>
            </div>
            <div className="flex flex-col text-xs">
              {[
                {
                  id: "explore",
                  label: "Explore Roles",
                  count: jobsFeed.length,
                },
                {
                  id: "saved",
                  label: "Saved Listings",
                  count: savedJobIds.length,
                },
                {
                  id: "applied",
                  label: "My Applications",
                  count: appliedJobIds.length,
                },
              ].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => {
                    setJobsSubTab(subTab.id);
                  }}
                  className={`flex justify-between items-center px-4 py-3 text-left border-b border-white/[0.02] last:border-0 ${
                    jobsSubTab === subTab.id
                      ? "bg-white/[0.03] font-bold text-white border-r-2 border-indigo-500"
                      : "text-neutral-400 hover:bg-white/[0.01]"
                  }`}
                >
                  <span>{subTab.label}</span>
                  <span className="font-mono bg-neutral-800 text-[10px] px-1.5 py-0.2 rounded text-neutral-400">
                    {subTab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC SEARCH & SELECTION TOOLKIT CONTROL HOUSING */}
          <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-4 space-y-4">
            <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block">
              Search & Filter
            </span>

            {/* TEXT KEYWORD INPUT FIELD */}
            <div className="space-y-1.5">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5" />
                <input
                  type="text"
                  placeholder="Filter current board views..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181822] border border-white/[0.06] h-8 rounded pl-8 pr-3 text-xs text-neutral-200 outline-none focus:border-indigo-500/40 placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* LIVE REFLECTIVE LOCATION DROPDOWN SELECTION */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
                <Filter className="w-2.5 h-2.5 text-indigo-400" /> Filter by
                Location
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 pointer-events-none" />
                <select
                  value={activeLocation}
                  onChange={(e) => setActiveLocation(e.target.value)}
                  className="w-full bg-[#181822] border border-white/[0.06] h-8 rounded pl-8 pr-8 text-xs text-neutral-200 outline-none focus:border-indigo-500/40 appearance-none cursor-pointer font-medium"
                >
                  <option value="">All Locations (Global / Remote)</option>
                  {uniqueLocations.map((loc, idx) => (
                    <option
                      key={idx}
                      value={loc}
                      className="bg-[#181822] text-neutral-200"
                    >
                      {loc}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 pointer-events-none border-l border-neutral-800 pl-1.5 text-[8px] font-mono text-neutral-500">
                  ▼
                </div>
              </div>
            </div>

            {/* DYNAMIC CLEAN UP RESET INTERFACE BUTTON */}
            {(searchQuery || activeLocation) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveLocation("");
                }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono underline block pt-1 transition-colors"
              >
                Reset active filters
              </button>
            )}
          </div>
        </aside>

        {/* DEEP TWO-PANE DOCK INTERACTION INTERFACE */}
        <main className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 bg-[#111116] border border-white/[0.06] rounded-xl overflow-hidden h-[620px] shadow-2xl">
          {/* SPLIT SUB-LEFT: ROLES REGISTRY TREE */}
          <div className="md:col-span-5 border-r border-white/[0.06] flex flex-col h-full bg-black/10 overflow-y-auto hide-scrollbar">
            {fullyFilteredJobs.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No matching job records available under this selection layer.
              </div>
            ) : (
              fullyFilteredJobs.map((job) => {
                const isSelected = selectedJobView?.id === job.id;
                const status = applicationStatuses[job.id]; 

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobView(job)}
                    className={`p-4 border-b border-white/[0.04] cursor-pointer transition-colors text-left relative ${
                      isSelected ? "bg-white/[0.03]" : "hover:bg-white/[0.01]"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-neutral-100 line-clamp-1 hover:text-indigo-400">
                        {job.title}
                      </h4>
                      <button
                        onClick={(e) => toggleSaveJob(job.id, e)}
                        className="text-neutral-500 hover:text-white flex-shrink-0"
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${savedJobIds.includes(job.id) ? "fill-indigo-400 text-indigo-400" : ""}`}
                        />
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-300 font-medium mt-0.5">
                      {job.client?.company_name}
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                      <span className="line-clamp-1">{job.location_text}</span>
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-indigo-500/5 text-indigo-300 border border-indigo-500/10 px-1.5 py-0.5 rounded font-mono tracking-wide uppercase">
                          {job.category}
                        </span>

                        {/* HIGH-END INTERFACE STATUS LABELS */}
                        {status === "pending" && (
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-medium">
                            Pending
                          </span>
                        )}
                        {(status === "accepted" || status === "shortlisted") && (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-medium">
                            Accepted
                          </span>
                        )}
                        {status === "rejected" && (
                          <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-medium">
                            Rejected
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-neutral-600 font-mono">
                        {job.time}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* SPLIT SUB-RIGHT: DRILLDOWN TELEMETRY READOUT DISPLAY */}
          <div className="md:col-span-7 flex flex-col h-full overflow-y-auto p-5 space-y-5 bg-[#0b0b0f] text-left hide-scrollbar">
            {selectedJobView ? (
              <>
                <div className="border-b border-white/[0.05] pb-4 space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {selectedJobView.title}
                    </h2>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/[0.03] border border-emerald-500/15 px-2 py-0.5 rounded flex-shrink-0">
                      ${selectedJobView.budget_min} - $
                      {selectedJobView.budget_max}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                      {selectedJobView.client?.company_name}{" "}
                      {selectedJobView.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500 mt-2">
                      <span className="flex items-center gap-1 text-neutral-300">
                        <MapPin className="w-3 h-3 text-indigo-400" />
                        {selectedJobView.location_text}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-600" />
                        {selectedJobView.shoot_duration_hrs} Hrs Shoot
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-600" />
                        {selectedJobView.shoot_date}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2">
                    {/* DYNAMIC ACTION BUTTON RENDERING MATRIX */}
                    {appliedJobIds.includes(selectedJobView.id) ? (
                      (() => {
                        const activeStatus = applicationStatuses[selectedJobView.id];
                        
                        // CATCH EITHER POPULATED BACKEND PHRASE
                        if (activeStatus === "accepted" || activeStatus === "shortlisted") {
                          return (
                            <>
                              <button
                                disabled
                                className="h-8 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs px-4 rounded cursor-not-allowed flex items-center gap-1.5"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />{" "}
                                Position Secured
                              </button>
                              <button
                                onClick={async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from("messages")
      .select("id")
      .eq("job_id", selectedJobView.id)
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${selectedJobView.client.id}),and(sender_id.eq.${selectedJobView.client.id},receiver_id.eq.${user.id})`
      )
      .limit(1);

    // Create starter message only if none exists
    if (!existing || existing.length === 0) {
      await supabase.from("messages").insert({
        job_id: selectedJobView.id,
        sender_id: user.id,
        receiver_id: selectedJobView.client.id,
        content: "Conversation started",
      });
    }

    setActiveJobChatTarget({
      job_id: selectedJobView.id,
      counterpart_id: selectedJobView.client.id,
      displayName:
        selectedJobView.client.company_name ||
        selectedJobView.client.full_name ||
        "Production Client",
      projectTitle: selectedJobView.title,
    });

    setCurrentTab("messaging");
  } catch (err) {
    console.error("Chat initialization error:", err);
  }
}}
                                className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 rounded flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />{" "}
                                Chat with Client
                              </button>
                            </>
                          );
                        }
                        if (activeStatus === "rejected") {
                          return (
                            <button
                              disabled
                              className="h-8 bg-red-950/20 text-red-400/60 border border-red-500/10 font-bold text-xs px-5 rounded cursor-not-allowed flex items-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Application
                              Rejected
                            </button>
                          );
                        }
                        return (
                          <button
                            disabled
                            className="h-8 bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-xs px-5 rounded cursor-not-allowed flex items-center gap-1.5"
                          >
                            <AlertCircle className="w-3.5 h-3.5 animate-pulse" />{" "}
                            Application Pending
                          </button>
                        );
                      })()
                    ) : (
                      <button
                        onClick={() =>
                          navigate(`/professional/jobs/${selectedJobView.id}`)
                        }
                        className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 rounded transition-all"
                      >
                        Easy Apply
                      </button>
                    )}
                    <button
                      onClick={(e) => toggleSaveJob(selectedJobView.id, e)}
                      className="h-8 border border-white/10 hover:bg-white/[0.02] text-neutral-300 px-3 rounded text-xs transition-colors"
                    >
                      {savedJobIds.includes(selectedJobView.id)
                        ? "Saved"
                        : "Save Role"}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Position Framework Description
                  </h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed whitespace-pre-line">
                    {selectedJobView.description}
                  </p>
                </div>

                {/* ADDITIONAL METADATA WORKFLOW DETAILS */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.04]">
                  <div className="bg-white/[0.01] border border-white/[0.03] p-2.5 rounded-lg">
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold block tracking-wider">
                      Production Category
                    </span>
                    <span className="text-xs text-neutral-300 font-mono mt-0.5 inline-block capitalize">
                      {selectedJobView.category}
                    </span>
                  </div>
                  <div className="bg-white/[0.01] border border-white/[0.03] p-2.5 rounded-lg">
                    <span className="text-[10px] uppercase text-neutral-500 font-semibold block tracking-wider">
                      Metrics Monitoring
                    </span>
                    <span className="text-xs text-neutral-400 font-mono mt-0.5 inline-block">
                      <strong className="text-neutral-200">
                        {selectedJobView.applicants || 0}
                      </strong>{" "}
                      candidates tracking
                    </span>
                  </div>
                </div>

                {selectedJobView.tags?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Classification Tags
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedJobView.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded border border-white/[0.02]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-neutral-500 text-xs">
                Select an active job file from the registry stack to trace
                details.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default JobView;