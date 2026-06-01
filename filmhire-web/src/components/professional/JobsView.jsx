import React from 'react'
import {Bookmark, CheckCircle ,Search,ShieldCheck} from "lucide-react";

function JobView({
  jobsFeed,
  searchQuery,
  setSearchQuery,
  jobsSubTab,
  setJobsSubTab,
  selectedJobView,
  setSelectedJobView,
  savedJobIds,
  appliedJobIds,
  toggleSaveJob,
  handleApplyJob,
  currentFilteredJobs,
}) {
  return (
    <div>

      <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* LEFT FILTER MANAGEMENT COLUMN */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="bg-[#111116] border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="p-3 bg-black/20 border-b border-white/[0.04]">
              <span className="text-xs font-bold uppercase text-neutral-400 tracking-wider">Job Management</span>
            </div>
            <div className="flex flex-col text-xs">
              {[
                { id: "explore", label: "Explore Roles", count: jobsFeed.length },
                { id: "saved", label: "Saved Listings", count: savedJobIds.length },
                { id: "applied", label: "My Applications", count: appliedJobIds.length }
              ].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => { setJobsSubTab(subTab.id); }}
                  className={`flex justify-between items-center px-4 py-3 text-left border-b border-white/[0.02] last:border-0 ${jobsSubTab === subTab.id ? "bg-white/[0.03] font-bold text-white border-r-2 border-indigo-500" : "text-neutral-400 hover:bg-white/[0.01]"}`}
                >
                  <span>{subTab.label}</span>
                  <span className="font-mono bg-neutral-800 text-[10px] px-1.5 py-0.2 rounded text-neutral-400">{subTab.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-4 space-y-3">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5" />
              <input
                type="text"
                placeholder="Filter current board views..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181822] border border-white/[0.06] h-8 rounded pl-8 pr-3 text-xs outline-none focus:border-indigo-500/40"
              />
            </div>
          </div>
        </aside>

        {/* DEEP TWO-PANE DOCK INTERACTION INTERFACE */}
        <main className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 bg-[#111116] border border-white/[0.06] rounded-xl overflow-hidden h-[620px] shadow-2xl">

          {/* SPLIT SUB-LEFT: ROLES REGISTRY TREE */}
          <div className="md:col-span-5 border-r border-white/[0.06] flex flex-col h-full bg-black/10 overflow-y-auto hide-scrollbar">
            {currentFilteredJobs.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">No matching job records available under this filter.</div>
            ) : (
              currentFilteredJobs.map((job) => {
                const isSelected = selectedJobView?.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobView(job)}
                    className={`p-4 border-b border-white/[0.04] cursor-pointer transition-colors text-left relative ${isSelected ? "bg-white/[0.03]" : "hover:bg-white/[0.01]"}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-neutral-100 line-clamp-1 hover:text-indigo-400">{job.title}</h4>
                      <button onClick={(e) => toggleSaveJob(job.id, e)} className="text-neutral-500 hover:text-white flex-shrink-0">
                        <Bookmark className={`w-3.5 h-3.5 ${savedJobIds.includes(job.id) ? "fill-indigo-400 text-indigo-400" : ""}`} />
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-300 font-medium mt-0.5">{job.client}</p>
                    <p className="text-[10px] text-neutral-500 mt-1">{job.city}, {job.state} ({job.experienceLevel})</p>

                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {job.requiredTools.slice(0, 3).map((tool, idx) => (
                        <span key={idx} className="text-[9px] bg-indigo-500/5 text-indigo-300 border border-indigo-500/10 px-1 py-0.2 rounded font-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                    <span className="text-[9px] text-neutral-600 block text-right font-mono mt-2">{job.time}</span>
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
                    <h2 className="text-base font-bold text-white tracking-tight">{selectedJobView.title}</h2>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/[0.03] border border-emerald-500/15 px-2 py-0.5 rounded">{selectedJobView.budget}</span>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-400 font-medium flex items-center gap-1">{selectedJobView.client} {selectedJobView.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-neutral-500 mt-1">
                      <span>{selectedJobView.city}, {selectedJobView.state}</span>
                      <span>•</span>
                      <span>{selectedJobView.employeeCount}</span>
                      <span>•</span>
                      <span className="text-neutral-400 font-mono font-bold">{selectedJobView.applicants} applicants</span>
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2">
                    {appliedJobIds.includes(selectedJobView.id) ? (
                      <div className="h-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded px-4 text-xs font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Application Forwarded</div>
                    ) : (
                      <button
                        onClick={() => handleApplyJob(selectedJobView.id)}
                        className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 rounded transition-all"
                      >
                        Easy Apply
                      </button>
                    )}
                    <button
                      onClick={(e) => toggleSaveJob(selectedJobView.id, e)}
                      className="h-8 border border-white/10 hover:bg-white/[0.02] text-neutral-300 px-3 rounded text-xs transition-colors"
                    >
                      {savedJobIds.includes(selectedJobView.id) ? "Saved" : "Save Role"}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Position Framework Description</h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">{selectedJobView.description}</p>
                </div>

                {/* TARGET REQUIRED TOOLS FRAMEWORK DETAILS */}
                <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Mandatory Application Tooling Stack</h4>
                  <p className="text-[11px] text-neutral-500">Every selected asset output generated by candidates must track files through these compilation utilities:</p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {selectedJobView.requiredTools.map((tool, idx) => (
                      <span key={idx} className="text-xs bg-white/[0.02] border border-white/[0.06] px-2.5 py-1 rounded text-neutral-300 font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Classification Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedJobView.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded border border-white/[0.02]">{tag}</span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-neutral-500 text-xs">Select an active job file from the registry stack to trace details.</div>
            )}
          </div>

        </main>
      </div>

    </div>
  )
}

export default JobView
