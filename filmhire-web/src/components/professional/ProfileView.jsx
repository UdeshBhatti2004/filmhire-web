import React from "react";
import { CheckCircle, MapPin, Plus, Film } from "lucide-react";

function ProfileView({
  profile,
  setShowUploadModal,
  setCurrentTab,
}) {
  return (
    <div>
      <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-left">

        {/* MAIN CONTENT */}
        <main className="lg:col-span-8 space-y-4">

          {/* PROFILE HEADER */}
          <div className="bg-[#111116] border border-white/[0.06] rounded-xl overflow-hidden relative shadow">
            
            {/* COVER */}
            <div className="h-36 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600" />

            <div className="px-6 pb-6 relative">
              
              {/* AVATAR */}
              <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-[#111116] bg-black absolute -top-10 left-6 shadow-md">
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="pt-12 flex flex-col gap-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-1.5">
                  {profile.full_name}
                  <CheckCircle className="w-4 h-4 text-indigo-400" />
                </h2>

                <p className="text-sm text-indigo-300">
                  {profile.specializations?.join(" • ")}
                </p>

                <p className="text-xs text-neutral-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.city}, {profile.state}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] flex flex-wrap gap-2">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-white text-black font-semibold text-xs px-4 py-2 rounded hover:bg-neutral-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Upload Portfolio
                </button>

                <button
                  onClick={() => setCurrentTab("messaging")}
                  className="border border-white/10 hover:bg-white/[0.02] text-neutral-300 text-xs px-4 py-2 rounded transition-colors"
                >
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* ABOUT */}
          <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              About
            </h4>

            <p className="text-sm text-neutral-300 leading-relaxed">
              {profile.bio || "No bio added yet."}
            </p>
          </div>

          {/* PORTFOLIO PLACEHOLDER */}
          <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-5">
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Portfolio
              </h4>

              <span className="text-[10px] text-neutral-500">
                Coming Soon
              </span>
            </div>

            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Film className="w-10 h-10 text-neutral-600 mb-3" />

              <h3 className="text-sm font-semibold text-neutral-300">
                No Portfolio Items Yet
              </h3>

              <p className="text-xs text-neutral-500 mt-2 max-w-xs">
                Upload your work to showcase your skills and attract clients.
              </p>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:col-span-4 space-y-4">

          <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wide mb-4">
              Specializations
            </h4>

            <div className="flex flex-wrap gap-2">
              {profile.specializations?.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#111116] border border-white/[0.06] rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wide mb-3">
              Stats
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Rating</span>
                <span className="text-white">
                  {profile.avg_rating || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Reviews</span>
                <span className="text-white">
                  {profile.total_reviews || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-neutral-500">Role</span>
                <span className="text-white capitalize">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}

export default ProfileView;