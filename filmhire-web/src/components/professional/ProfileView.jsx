import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  MapPin,
  Plus,
  Film,
  X,
  Star,
  ArrowUpRight,
  Trash2,
  Pencil
} from "lucide-react";
import { supabase } from "../../lib/supabase";

function ProfileView({ profile = {}, setShowUploadModal, setCurrentTab }) {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const handleDeletePortfolio = async (item) => {
    try {
      const thumbnailPath = decodeURIComponent(
        item.thumbnail_url.split("/portfolio-thumbnails/")[1],
      );

      const videoPath = decodeURIComponent(
        item.video_url.split("/portfolio-videos/")[1],
      );

      await supabase.storage
        .from("portfolio-thumbnails")
        .remove([thumbnailPath]);

      await supabase.storage.from("portfolio-videos").remove([videoPath]);

      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      setPortfolioItems((prev) =>
        prev.filter((portfolio) => portfolio.id !== item.id),
      );
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpdatePortfolio = async () => {
  try {
    const { error } = await supabase
      .from("portfolio_items")
      .update({
        title: editTitle,
        category: editCategory,
      })
      .eq("id", editingPortfolio.id);

    if (error) throw error;

    setPortfolioItems((prev) =>
      prev.map((item) =>
        item.id === editingPortfolio.id
          ? {
              ...item,
              title: editTitle,
              category: editCategory,
            }
          : item
      )
    );

    setEditingPortfolio(null);
  } catch (err) {
    console.error(err);
  }
};
  const fetchPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("professional_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPortfolioItems(data || []);
    } catch (err) {
      console.error(err);
    }
  };



  useEffect(() => {
    if (profile?.id) {
      fetchPortfolioItems();
    }
  }, [profile?.id]);

    useEffect(() => {
  const handlePortfolioUpdate = () => {
    fetchPortfolioItems();
  };

  window.addEventListener(
    "portfolio-updated",
    handlePortfolioUpdate
  );

  return () => {
    window.removeEventListener(
      "portfolio-updated",
      handlePortfolioUpdate
    );
  };
}, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 antialiased font-sans selection:bg-white selection:text-black">
      {/* HERO BANNER SECTION */}
      <div className="relative h-[280px] w-full overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#09090b]" />
        {profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt=""
            className="w-full h-full object-cover blur-2xl opacity-20 scale-110 pointer-events-none"
          />
        )}
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 -mt-32 relative z-10 pb-24">
        {/* HEADER / IDENTITY */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl shrink-0">
              <img
                src={
                  profile.avatar_url ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
                }
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {profile.full_name || "Anonymous"}
                </h1>
                <CheckCircle className="w-5 h-5 text-neutral-400 fill-neutral-900" />
              </div>
              <p className="text-neutral-400 text-sm font-medium tracking-wide">
                {profile.specializations?.join(" — ") ||
                  "Creative Professional"}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 pt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {profile.city && profile.state
                    ? `${profile.city}, ${profile.state}`
                    : "Location Variable"}
                </span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => setShowUploadModal(true)}
              className="h-10 bg-white text-black font-semibold text-xs px-5 rounded-lg hover:bg-neutral-200 transition-all flex items-center gap-1.5 tracking-wide"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Upload Work
            </button>
            <button
              onClick={() => setCurrentTab("messaging")}
              className="h-10 border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-300 text-xs px-5 rounded-lg transition-all tracking-wide"
            >
              Message
            </button>
          </div>
        </header>

        {/* 2-COLUMN SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-10">
          {/* LEFT: BIO & WORK */}
          <div className="lg:col-span-8 space-y-12">
            {/* ABOUT */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                Biography
              </h3>
              <p className="text-neutral-300 text-base leading-relaxed max-w-2xl font-light">
                {profile.bio || "No description provided yet."}
              </p>
            </section>

            {/* PORTFOLIO GRID */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Selected Works
                </h3>
                <span className="text-[11px] text-neutral-600 font-mono">
                  ({portfolioItems.length})
                </span>
              </div>

              {portfolioItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  {portfolioItems.map((item) => (
                    <article
                      key={item.id}
                      onClick={() => setSelectedPortfolio(item)}
                      className="group cursor-pointer space-y-3"
                    >
                      <div className="relative overflow-hidden rounded-xl aspect-video bg-neutral-900 border border-neutral-800/40">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePortfolio(item);
                          }}
                          className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
  onClick={(e) => {
    e.stopPropagation();
    setEditingPortfolio(item);
setEditTitle(item.title);
setEditCategory(item.category || "");
  }}
  className="absolute top-2 right-12 z-10 bg-black/70 hover:bg-blue-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
>
  <Pencil className="w-4 h-4" />
</button>
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start justify-between px-0.5">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-500 font-medium">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-20 border border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center text-center">
                  <Film className="w-8 h-8 text-neutral-700 mb-3 font-light" />
                  <h4 className="text-sm font-medium text-neutral-400">
                    Index is empty
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 max-w-xs">
                    No portfolio showreels or items have been listed by this
                    user.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: METRICS & TAGS */}
          <aside className="lg:col-span-4 space-y-10 lg:border-l lg:border-neutral-800 lg:pl-10">
            {/* STATS */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                Overview
              </h3>
              <div className="divide-y divide-neutral-800/60 text-sm">
                <div className="flex justify-between py-3">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    Rating
                  </span>
                  <span className="text-white font-mono flex items-center gap-1 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current text-neutral-300" />
                    {Number(profile.avg_rating || 0).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-neutral-400">Reviews Received</span>
                  <span className="text-neutral-200 font-mono">
                    {profile.total_reviews || 0}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-neutral-400">Account Type</span>
                  <span className="text-neutral-200 uppercase text-xs tracking-wider font-semibold">
                    {profile.role || "Professional"}
                  </span>
                </div>
              </div>
            </section>

            {/* TAGS */}
            {profile.specializations?.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Focus Areas
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.specializations.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-medium tracking-wide"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>

      {/* FULL SCREEN LIGHTBOX MODAL */}
      {selectedPortfolio && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPortfolio(null)}
        >
          <div
            className="w-full max-w-4xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-neutral-400">
              <div className="text-xs tracking-wider font-mono uppercase text-neutral-500">
                {selectedPortfolio.category}
              </div>
              <button
                onClick={() => setSelectedPortfolio(null)}
                className="hover:text-white p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full rounded-xl overflow-hidden bg-black border border-neutral-800 aspect-video shadow-2xl">
              <video
                src={selectedPortfolio.video_url}
                controls
                autoPlay
                className="w-full h-full block object-contain"
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {selectedPortfolio.title}
              </h3>
            </div>
          </div>
        </div>
      )}
      {editingPortfolio && (
  <div
    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={() => setEditingPortfolio(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-md bg-[#111116] border border-white/10 rounded-xl p-5 space-y-4"
    >
      <h3 className="text-lg font-semibold text-white">
        Edit Portfolio
      </h3>

      <input
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        placeholder="Portfolio Title"
        className="w-full bg-[#181822] border border-white/10 rounded-lg px-3 h-10 text-white"
      />

      <input
        type="text"
        value={editCategory}
        onChange={(e) => setEditCategory(e.target.value)}
        placeholder="Category"
        className="w-full bg-[#181822] border border-white/10 rounded-lg px-3 h-10 text-white"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setEditingPortfolio(null)}
          className="px-4 h-10 border border-white/10 rounded-lg text-neutral-300"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdatePortfolio}
          className="px-4 h-10 bg-white text-black rounded-lg font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default ProfileView;
