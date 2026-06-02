import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; 
import { MapPin, MessageSquare, UserCheck, XCircle, Loader2 } from "lucide-react";

const Applicants = ({ handleDirectRouteToChat }) => {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null); // Keep null initially for a gorgeous cinematic landing
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);

        const { data, error: fetchError } = await supabase
          .from("job_applications")
          .select(`
            id,
            status,
            quoted_price,
            cover_letter,
            created_at,
            profiles:professional_id (
              full_name,
              avatar_url,
              role,
              specializations,
              city,
              state
            ),
            jobs:job_id (
              title
            )
          `)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        const formattedApplicants = data.map((app) => ({
          id: app.id,
          name: app.profiles?.full_name || "Unknown Candidate",
          avatar: app.profiles?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
          role: app.profiles?.role || "Professional Spec",
          specializations: app.profiles?.specializations || [],
          location: app.profiles?.city && app.profiles?.state ? `${app.profiles.city}, ${app.profiles.state}` : "Remote Base",
          jobTitle: app.jobs?.title || "Position",
          matchScore: app.quoted_price ? `₹${app.quoted_price}` : "Pending Quote",
          status: app.status || "pending",
          coverLetter: app.cover_letter || "No custom pipeline proposal parameters written by applicant.",
          timestamp: app.created_at ? new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
        }));

        setApplicants(formattedApplicants);
        
        // FIX #1: Keep it null initially so the empty telemetry layout builds your preview aesthetic flawlessly.
        setSelectedApplicant(null);

      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const { error: updateError } = await supabase
        .from("job_applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (updateError) throw updateError;

      setApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
      
      setSelectedApplicant((prev) =>
        prev && prev.id === applicationId ? { ...prev, status: newStatus } : prev
      );
    } catch (err) {
      console.error("Status update error:", err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-neutral-500 font-mono text-[10px] tracking-widest gap-3 bg-[#07070a]/50">
        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
        RESOLVING LIVE INBOUND CHANNELS...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-xs text-red-400 font-mono bg-red-950/10 border border-red-500/10 rounded-xl m-4">
        &gt; Fault Encountered: {error}
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="p-12 text-center text-neutral-500 font-mono text-[11px] tracking-tight bg-[#07070a]/30">
        No active applicant records matching database indexes found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px] bg-[#07070a] divide-y lg:divide-y-0 lg:divide-x divide-white/5 border-t border-white/5">
      
      {/* Left List Column Panel */}
      <div className="lg:col-span-5 flex flex-col h-[620px] overflow-y-auto bg-black/20 custom-scrollbar">
        <div className="divide-y divide-white/[0.03]">
          {applicants.map((applicant) => {
            const isSelected = selectedApplicant?.id === applicant.id;
            return (
              <button
                key={applicant.id}
                onClick={() => setSelectedApplicant(applicant)}
                className={`w-full p-4 flex items-center gap-4 text-left transition-all duration-200 relative group ${
                  isSelected 
                    ? "bg-white/[0.03] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-indigo-500" 
                    : "hover:bg-white/[0.01]"
                }`}
              >
                <img
                  src={applicant.avatar}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover bg-neutral-900 border border-white/10 shadow-md group-hover:border-white/20 transition-colors flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className={`text-xs font-medium truncate tracking-tight transition-colors ${isSelected ? "text-white font-semibold" : "text-neutral-300"}`}>
                      {applicant.name}
                    </h4>
                    <span className="text-[9px] text-neutral-600 font-mono flex-shrink-0">
                      {applicant.timestamp}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5 font-light tracking-wide">
                    {applicant.jobTitle}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                    {applicant.matchScore}
                  </span>
                  <span className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded font-bold ${
                    applicant.status === "shortlisted" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    applicant.status === "rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                    "bg-white/5 text-neutral-400 border border-white/10"
                  }`}>
                    {applicant.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Detailed Workspace View Panel */}
      <div className="lg:col-span-7 bg-gradient-to-b from-white/[0.01] to-transparent h-[620px] overflow-y-auto custom-scrollbar relative flex flex-col justify-between">
        
        {/* CSS Keyframe Animation injected cleanly inside an inline style to guarantee fluid hardware acceleration without breaking config */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes cinematicEntrance {
            from { opacity: 0; transform: translateY(6px); filter: blur(4px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          .animate-cinematic {
            animation: cinematicEntrance 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
        `}} />

        {selectedApplicant ? (
          <div 
            key={selectedApplicant.id} 
            className="p-6 lg:p-8 flex flex-col justify-between h-full min-h-full animate-cinematic"
          >
            <div className="space-y-6 text-left">
              
              {/* Profile Card Header Layout */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative group flex-shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-100 transition duration-500" />
                    <img
                      src={selectedApplicant.avatar}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover bg-neutral-900 border border-white/10 shadow-2xl relative"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-white tracking-tight truncate">
                      {selectedApplicant.name}
                    </h2>
                    <p className="text-indigo-400 text-[11px] font-mono font-medium mt-0.5 truncate">
                      {selectedApplicant.role}
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono mt-1.5 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
                      Target Position: <span className="text-neutral-300 font-sans truncate">{selectedApplicant.jobTitle}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-950 px-4 py-2 rounded-xl border border-white/5 text-left sm:text-right shadow-xl self-start">
                  <span className="text-[9px] font-mono uppercase text-neutral-500 tracking-wider block">Quote Offer</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">{selectedApplicant.matchScore}</span>
                </div>
              </div>

              {/* Meta Grid Matrix */}
              <div className="grid grid-cols-2 gap-6 border-t border-b border-white/5 py-4 text-[11px] font-mono">
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-500 uppercase tracking-wider block">Operational Base</span>
                  <span className="text-neutral-300 font-sans font-medium flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-neutral-500 flex-shrink-0" /> {selectedApplicant.location}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-neutral-500 uppercase tracking-wider block">Expertise Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedApplicant?.specializations?.length > 0 ? (
                      selectedApplicant.specializations.map((spec, i) => (
                        <span key={i} className="text-[9px] bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-neutral-400 font-sans tracking-wide hover:bg-white/10 transition-colors">
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-neutral-600 italic text-[10px]">No custom tags flagged</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Interactive Pitch Segment */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">Cover Letter Pitch</span>
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 text-xs text-neutral-300 leading-relaxed font-light shadow-inner min-h-[140px] select-text selection:bg-indigo-500/30 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-[1px] h-0 bg-indigo-500/30 group-hover:h-full transition-all duration-700" />
                  <p className="relative z-10 font-sans">“ {selectedApplicant.coverLetter} ”</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions Matrix Grid Panel */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4 bg-[#07070a]/40 backdrop-blur-md sticky bottom-0">
              <button
                onClick={() => handleDirectRouteToChat(selectedApplicant.name, selectedApplicant.avatar)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white rounded-lg text-xs font-medium transition-all duration-300 shadow-lg shadow-indigo-600/10 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Message Candidate
              </button>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleUpdateStatus(selectedApplicant.id, "shortlisted")}
                  disabled={selectedApplicant.status === "shortlisted"}
                  className="px-3 py-2 bg-emerald-500/5 hover:bg-emerald-600 border border-emerald-500/10 hover:border-transparent text-emerald-400 hover:text-white rounded-lg text-xs font-medium transition-all duration-300 disabled:opacity-25 disabled:pointer-events-none flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Shortlist
                </button>

                <button 
                  onClick={() => handleUpdateStatus(selectedApplicant.id, "rejected")}
                  disabled={selectedApplicant.status === "rejected"}
                  className="px-3 py-2 bg-red-500/5 hover:bg-red-600 border border-red-500/10 hover:border-transparent text-red-400 hover:text-white rounded-lg text-xs font-medium transition-all duration-300 disabled:opacity-25 disabled:pointer-events-none flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* The Cinematic Empty Preview State */
          <div className="m-auto flex flex-col items-center justify-center p-8 text-center select-none animate-cinematic">
            {/* Brutalist Glowing Target Reticle Graphic */}
            <div className="relative w-16 h-16 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-12 h-12 rounded-full border border-white/5 bg-white/[0.01] animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_12px_#6366f1]" />
            </div>

            {/* Meta Text Typography */}
            <h3 className="text-white text-[10px] font-mono tracking-[0.25em] uppercase font-bold mb-2">
              Awaiting Profile Selection
            </h3>
            <p className="text-neutral-500 text-[10px] font-mono max-w-[280px] leading-relaxed tracking-wide">
              Select a pipeline node from the live applicant queue to display contextual telemetry and cover parameters.
            </p>

            {/* Minimal Accent Frame Marks */}
            <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/10 pointer-events-none" />
            <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/10 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/10 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/10 pointer-events-none" />
          </div>
        )}
      </div>

    </div>
  );
};

export default Applicants;