import React from "react";

const HomeSkeleton = () => {
  // Array helpers to render repeated placeholder blocks
  const skeletonPosts = [];
  const skeletonJobs = [];

  return (
    /* Changed animate-pulse to our custom ultra-soft shimmer */
    <div className="w-full bg-[#09090b] text-neutral-200 min-h-screen antialiased flex justify-center animate-subtle-shimmer">
      
      {/* GLOBAL FLUID CANVAS WRAPPER */}
      <div className="w-full max-w-full grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* ================= LEFT CONTROLLER COLUMN SKELETON ================= */}
        <aside className="lg:col-span-3 bg-[#0d0d0f] border-r border-neutral-900/60 p-6 xl:p-8 space-y-6 hidden lg:block sticky top-0 h-screen overflow-y-auto">
          
          {/* PROFILE SUMMARY HUB SKELETON */}
          <div className="bg-[#121214] border border-neutral-800/40 rounded-2xl overflow-hidden shadow-xl">
            {/* Header pattern replacement */}
            <div className="h-20 bg-neutral-900/30 relative" />

            <div className="px-5 pb-6 relative">
              {/* Profile Avatar placeholder */}
              <div className="w-16 h-16 rounded-xl bg-[#18181b] border-4 border-[#121214] absolute -top-8 left-5 shadow-2xl" />

              {/* Identity rows placeholders */}
              <div className="pt-11 space-y-2">
                <div className="h-3.5 bg-neutral-900/50 rounded-md w-3/4" />
                <div className="h-2.5 bg-neutral-900/40 rounded-md w-1/2" />
              </div>

              {/* METRICS SHEET SKELETON */}
              <div className="mt-5 pt-4 border-t border-neutral-900/60 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-2.5 bg-neutral-900/40 rounded-md w-1/3" />
                  <div className="h-4 bg-neutral-900/30 rounded-md w-1/4" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-2.5 bg-neutral-900/40 rounded-md w-1/4" />
                  <div className="h-2.5 bg-neutral-900/40 rounded-md w-1/3" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-2.5 bg-neutral-900/40 rounded-md w-1/3" />
                  <div className="h-4 bg-neutral-900/30 rounded-md w-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer branding line placeholder */}
          <div className="pt-2 space-y-1.5 opacity-40">
            <div className="h-2 bg-neutral-900 rounded w-full" />
            <div className="h-2 bg-neutral-900 rounded w-2/3" />
          </div>
        </aside>

        {/* ================= CENTER STREAM STREAM FEED SKELETON ================= */}
        <main className="col-span-1 lg:col-span-6 px-4 py-6 md:p-8 space-y-6 lg:h-screen lg:overflow-y-auto scrollbar-none">
          
          {/* COMPOSER / POST EDITOR INTERFACE SKELETON */}
          <div className="bg-[#121214] border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex gap-4 items-start">
              {/* Avatar placeholder */}
              <div className="w-10 h-10 rounded-xl bg-neutral-900/60 shrink-0" />

              {/* Inputs block placeholders */}
              <div className="flex-1 space-y-3">
                <div className="w-full bg-neutral-900/20 rounded-xl h-24 border border-neutral-900/60" />
                <div className="w-full bg-neutral-900/20 rounded-xl h-9 border border-neutral-900/60" />
              </div>
            </div>

            {/* Actions strip */}
            <div className="flex justify-between items-center pt-3 border-t border-neutral-900/60">
              <div className="h-9 w-28 rounded-xl bg-neutral-900/30 border border-neutral-900/60" />
              <div className="h-9 w-24 rounded-xl bg-neutral-900/50" />
            </div>
          </div>

          {/* TIMELINE TIMELINE STACK CONTAINER SKELETON */}
          <div className="space-y-5">
            {skeletonPosts.map((idx) => (
              <div
                key={idx}
                className="bg-[#121214] border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-lg"
              >
                {/* POST HEADER METADATA */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 w-full">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900/60 shrink-0" />
                    <div className="space-y-2 w-1/2">
                      <div className="h-3 bg-neutral-900/60 rounded-md w-3/4" />
                      <div className="h-2.5 bg-neutral-900/40 rounded-md w-1/2" />
                      <div className="h-2 bg-neutral-900/30 rounded-md w-1/3" />
                    </div>
                  </div>
                  <div className="h-7 w-7 bg-neutral-900/40 rounded-xl" />
                </div>

                {/* POST BODY DESCRIPTION PLACEHOLDERS */}
                <div className="space-y-2 py-1">
                  <div className="h-2.5 bg-neutral-900/50 rounded-md w-full" />
                  <div className="h-2.5 bg-neutral-900/50 rounded-md w-full" />
                  <div className="h-2.5 bg-neutral-900/40 rounded-md w-4/5" />
                </div>

                {/* ATTACHED MEDIA PREVIEW IMAGE PLACEHOLDER */}
                <div className="rounded-xl border border-neutral-900 bg-neutral-950/40 h-[260px]" />

                {/* TIMELINE CONTROLLERS PERFORMANCE BAR */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-900/60">
                  <div className="flex gap-4">
                    <div className="h-7 w-20 bg-neutral-900/30 rounded-xl" />
                    <div className="h-7 w-24 bg-neutral-900/30 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* ================= RIGHT MARKET OPPORTUNITIES PANEL SKELETON ================= */}
        <aside className="lg:col-span-3 bg-[#0d0d0f] border-l border-neutral-900/60 p-6 xl:p-8 space-y-4 hidden lg:block sticky top-0 h-screen overflow-y-auto">
          <div className="bg-[#121214] border border-neutral-900 rounded-2xl p-5 shadow-xl space-y-4">
            {/* Header Text placeholder */}
            <div className="h-2.5 bg-neutral-900/50 rounded-md w-1/2" />

            {/* List entries */}
            <div className="space-y-3.5 divide-y divide-neutral-900/60">
              {skeletonJobs.map((idx) => (
                <div key={idx} className="pt-3.5 first:pt-0 space-y-2">
                  <div className="h-2.5 bg-neutral-900/50 rounded-md w-11/12" />
                  <div className="h-2.5 bg-neutral-900/40 rounded-md w-1/2" />
                  <div className="h-4.5 bg-neutral-900/20 rounded-md w-24 mt-1.5 h-5" />
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default HomeSkeleton;