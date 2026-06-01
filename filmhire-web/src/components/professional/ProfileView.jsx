import React from 'react'
import {Briefcase, CheckCircle, Film, Layers, MapPin, Plus,ImageIcon } from "lucide-react";

function ProfileView({
  profile,
  setShowUploadModal,
  setCurrentTab,
  navigate,
}) {
  return (
    <div>
      <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-left">

        {/* MAIN COMPREHENSIVE DOSSIER BLOCK */}
        <main className="lg:col-span-8 space-y-4">

          {/* LINKEDIN CUSTOM COVER + AVATAR GRID HEADER */}
          <div className="bg-[#111116] border border-white/[0.06] rounded-xl overflow-hidden relative shadow">
            <div className="h-36 w-full bg-neutral-900 relative">
              <img src={profile.coverImage} alt="Cover Banner" className="w-full h-full object-cover opacity-75" />
            </div>
            <div className="px-6 pb-6 relative">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-[#111116] bg-black absolute -top-10 left-6 shadow-md">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              </div>

              <div className="pt-12 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white flex items-center gap-1.5">
                    {profile.name} <CheckCircle className="w-4 h-4 text-indigo-400 fill-indigo-400/5" />
                  </h2>
                  <p className="text-xs text-indigo-300 font-medium">{profile.title}</p>
                  <p className="text-[11px] text-neutral-500 flex items-center gap-1 pt-1"><MapPin className="w-3.5 h-3.5" /> {profile.location} • <span className="text-indigo-400 font-medium cursor-pointer">{profile.connections}</span></p>
                </div>

                <div className="text-[11px] space-y-1.5 text-neutral-400 border-l border-white/[0.05] pl-4 flex-shrink-0">
                  <div className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-neutral-500" /> <span>Current: <strong>{profile.company}</strong></span></div>
                  <div className="flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-neutral-500" /> <span>Edu: <strong>{profile.education}</strong></span></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] flex flex-wrap gap-2">
                <button onClick={() => setShowUploadModal(true)} className="bg-white text-black font-bold text-xs h-7 px-4 rounded hover:bg-neutral-200 transition-colors flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Append Project Matrix</button>
                <button onClick={() => setCurrentTab("messaging")} className="border border-white/10 hover:bg-white/[0.02] text-neutral-300 font-medium text-xs h-7 px-4 rounded transition-colors">Contact Log</button>
              </div>
            </div>
          </div>

          {/* BIO STATEMENT BOX */}
          <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Executive Summary</h4>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">{profile.bio}</p>
          </div>

          {/* DEEPLY EXTENDED DEPLOYED PORTFOLIO SPECIFICATIONS GRID */}
          <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Published Project Node Implementations</h4>
              <span className="text-[10px] text-neutral-500 font-mono">{profile.mediaGrid.length} Nodes Registered</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.mediaGrid.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/profile/post/${item.id}`)}
                  className="bg-[#181822] border border-white/[0.05] hover:border-white/[0.12] rounded-xl overflow-hidden flex flex-col group cursor-pointer transition-all"
                >
                  <div className="relative aspect-video w-full bg-black overflow-hidden border-b border-white/[0.03]">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" />
                    <span className="absolute top-2 right-2 p-1 rounded bg-black/70 text-neutral-400 text-[10px]">
                      {item.type === "video" ? <Film className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h5 className="text-xs font-bold text-neutral-200 line-clamp-1 group-hover:text-indigo-400 transition-colors">{item.title}</h5>
                      <span className="text-[9px] font-mono text-neutral-500">{item.views} System Tracks</span>
                    </div>

                    {/* EXPLICIT INTERFACE LABELS REDIRECTING PLATFORM ARCHITECTURE */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Software Infrastructure:</span>
                      <div className="flex flex-wrap gap-1">
                        {item.techStack.map((tech, idx) => (
                          <span key={idx} className="text-[10px] bg-black/40 text-neutral-300 border border-white/[0.04] px-1.5 py-0.5 rounded font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* RIGHT COLUMN COMPLEMENTARY METRICS */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wide">Core Utility Mastery</h4>
            <div className="space-y-2.5 text-xs">
              {[
                { name: "After Effects", description: "Complex dynamic layouts & custom element tracking loops." },
                { name: "Photoshop", description: "High-contrast digital texture design matrices." },
                { name: "Figma", description: "Premium, interaction-ready system wireframes." },
                { name: "Tailwind CSS", description: "Highly modular layout structures & token trees." }
              ].map((skill, idx) => (
                <div key={idx} className="p-2.5 bg-black/20 border border-white/[0.03] rounded-md">
                  <p className="font-bold text-neutral-200">{skill.name}</p>
                  <p className="text-[11px] text-neutral-400 font-light mt-0.5 leading-snug">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

export default ProfileView
