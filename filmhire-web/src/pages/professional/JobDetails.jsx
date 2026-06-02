import React, { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Wallet, Clock3, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  // Data States
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");
  
  // Status States
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchJobAndApplicationStatus();
  }, [jobId]);

  const fetchJobAndApplicationStatus = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Job Details
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      // 2. Check if Current User has already applied to this specific Job
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existingApp, error: appError } = await supabase
          .from("job_applications")
          .select("id")
          .eq("job_id", jobId)
          .eq("professional_id", user.id)
          .maybeSingle(); // Returns null safely instead of throwing if no row exists

        if (existingApp) {
          setHasApplied(true);
        }
      }

    } catch (error) {
      console.error("Data fetch exception:", error.message);
      setStatusMessage({ type: "error", text: "Failed to load operational environment." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quotedPrice || !coverLetter.trim()) {
      setStatusMessage({ type: "error", text: "Please populate all fields before sending." });
      return;
    }

    try {
      setIsApplying(true);
      setStatusMessage({ type: "", text: "" });

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Authentication required.");

      const { error } = await supabase
        .from("job_applications") 
        .insert([
          {
            job_id: jobId,
            professional_id: user.id,
            cover_letter: coverLetter,
            quoted_price: parseFloat(quotedPrice),
            status: "pending",
            created_at: new Date().toISOString()
          },
        ]);

      if (error) throw error;

      setHasApplied(true);
      setStatusMessage({ type: "success", text: "Proposal successfully archived. Redirecting..." });
      
      // Smooth programmatic delay before routing back to main dashboard stream
      setTimeout(() => {
        navigate(-1); // Or change explicitly to your path: navigate("/dashboard")
      }, 2500);

    } catch (error) {
      console.error("Submission error:", error.message);
      setStatusMessage({ type: "error", text: error.message || "Failed to transmit proposal." });
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#09090d] flex items-center justify-center font-sans text-xs tracking-[0.2em] text-[#646473]">LOADING TRACE...</div>;
  if (!job) return <div className="min-h-screen bg-[#09090d] flex items-center justify-center font-sans text-xs tracking-[0.2em] text-red-400">OPPORTUNITY NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-[#09090d] text-[#e2e2e9] font-sans px-8 py-16 selection:bg-white selection:text-[#09090d]">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-[#646473] hover:text-white transition-colors mb-20"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>

        {/* Content Matrix */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Brief Details */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-medium mb-4 block">Project Overview</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight">{job.title}</h1>
            </div>

            {/* Technical Metadata Rows */}
            <div className="border-t border-[#1c1c24] divide-y divide-[#1c1c24]">
              <div className="py-4 grid grid-cols-3 items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#646473]">Compensation</span>
                <span className="col-span-2 text-sm text-white font-medium flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#878794]" /> ₹{job.budget_min?.toLocaleString()}
                </span>
              </div>
              <div className="py-4 grid grid-cols-3 items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#646473]">Location</span>
                <span className="col-span-2 text-sm text-[#878794] flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {job.location_text}
                </span>
              </div>
              <div className="py-4 grid grid-cols-3 items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#646473]">Project Scope</span>
                <span className="col-span-2 text-sm text-[#878794] flex items-center gap-2">
                  <Clock3 className="w-4 h-4" /> {job.shoot_duration_hrs} Hours
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#646473]">Description</h2>
              <p className="text-[#a0a0b0] leading-relaxed font-light text-base">{job.description}</p>
            </div>
          </div>

          {/* Right Column: Interactive State Card */}
          <div className="lg:col-span-5 bg-[#111116] border border-[#1c1c24] rounded-xl p-8 shadow-2xl">
            {hasApplied ? (
              /* Success / Already Applied View - Stays completely clean & on-brand */
              <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
                <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight mb-2">Proposal Deposited</h3>
                  <p className="text-xs text-[#878794] max-w-[280px] leading-relaxed">
                    You have successfully applied to this project listing. Your parameters are under review.
                  </p>
                </div>
                {statusMessage.type === "success" && (
                  <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase animate-pulse">
                    Returning to Stream...
                  </span>
                )}
              </div>
            ) : (
              /* Input Core Form */
              <>
                <h3 className="text-sm font-semibold text-white tracking-tight mb-8">Propose Terms</h3>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="relative">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#646473] mb-2">Quote Amount (₹)</label>
                    <input
                      type="number"
                      value={quotedPrice}
                      onChange={(e) => setQuotedPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#09090d] border border-[#1c1c24] rounded-lg h-11 px-4 text-sm text-white placeholder-neutral-700 focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#646473] mb-2">Pitch / Cover Letter</label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Outline your approach or technical execution details..."
                      className="w-full h-40 bg-[#09090d] border border-[#1c1c24] rounded-lg p-4 text-sm text-white placeholder-neutral-700 focus:border-indigo-500 outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {statusMessage.text && (
                    <div className="text-xs tracking-wide p-3 rounded-lg border bg-rose-950/30 border-rose-500/30 text-rose-400">
                      {statusMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isApplying}
                    className="w-full h-12 bg-white text-[#09090d] text-xs uppercase tracking-[0.2em] font-bold rounded-lg hover:bg-neutral-200 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isApplying ? "Transmitting..." : "Submit Proposal"}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetails;