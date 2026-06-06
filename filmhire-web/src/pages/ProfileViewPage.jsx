// ProfileViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { 
  Grid, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  UserPlus, 
  UserCheck, 
  UserMinus,
  Play,
  FileText,
  ArrowUpRight,
  Award,
  Users
} from 'lucide-react';
import ClientNavbar from '../components/client/ClientNavbar';
import { supabase } from '../lib/supabase';

const ProfileViewPage = ({ professionalId }) => {
  const { id } = useParams();
  const targetId = professionalId || id;

  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connectionRowId, setConnectionRowId] = useState(null);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [connectionsCount, setConnectionsCount] = useState(0);

  const [profile, setProfile] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('portfolio');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch Profile Info
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", targetId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
        
        // 2. Fetch Check Pending Request Status
        const { data: requestData } = await supabase
          .from("connection_requests")
          .select("*")
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetId}),and(sender_id.eq.${targetId},receiver_id.eq.${user.id})`)
          .maybeSingle();

        if (requestData) {
          setConnectionStatus(requestData.status);
        } else {
          // 3. If no pending request row exists, check the actual accepted connections table
          const { data: activeConnection } = await supabase
            .from("connections")
            .select("id")
            .or(`and(user_a.eq.${user.id},user_b.eq.${targetId}),and(user_a.eq.${targetId},user_b.eq.${user.id})`)
            .maybeSingle();

          if (activeConnection) {
            setConnectionStatus("accepted");
            setConnectionRowId(activeConnection.id); 
          } else {
            setConnectionStatus(null);
          }
        }

        setCheckingConnection(false);

        // 4. Fetch total active connections count for this profile
        const { count, error: countError } = await supabase
          .from("connections")
          .select("*", { count: 'exact', head: true })
          .or(`user_a.eq.${targetId},user_b.eq.${targetId}`);

        if (!countError) {
          setConnectionsCount(count || 0);
        }

        // 5. Batch fetch content feeds
        const [portfolioRes, postsRes] = await Promise.all([
          supabase
            .from("portfolio_items")
            .select("*")
            .eq("professional_id", targetId)
            .order("display_order", { ascending: true }),
          supabase
            .from("professional_posts")
            .select("*")
            .eq("professional_id", targetId)
            .order("created_at", { ascending: false })
        ]);

        if (portfolioRes.error) throw portfolioRes.error;
        if (postsRes.error) throw postsRes.error;

        setPortfolioItems(portfolioRes.data || []);
        setPosts(postsRes.data || []);

      } catch (err) {
        console.error("Supabase Fetching Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (targetId) {
      fetchProfileData();
    }
  }, [targetId]);

  const sendConnectionRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("connection_requests")
        .insert({
          sender_id: user.id,
          receiver_id: targetId,
        });

      if (error) throw error;
      setConnectionStatus("pending");
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  const removeConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setConnectionStatus(null);
      setConnectionRowId(null);
      setConnectionsCount(prev => Math.max(0, prev - 1));

      const { error } = await supabase
        .from("connections")
        .delete()
        .or(`id.eq.${connectionRowId},and(user_a.eq.${user.id},user_b.eq.${targetId}),and(user_a.eq.${targetId},user_b.eq.${user.id})`);

      if (error) throw error;
    } catch (err) {
      console.error("Error breaking active connection:", err);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased animate-pulse">
        <ClientNavbar />
        <div className="h-56 md:h-72 w-full bg-zinc-900/50 relative" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-zinc-900 border-4 border-zinc-950 shadow-2xl" />
            <div className="flex gap-3 w-full sm:w-auto h-11">
              <div className="w-32 bg-zinc-900 rounded-xl" />
              <div className="w-32 bg-zinc-900 rounded-xl" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 bg-zinc-900 rounded-lg w-1/3" />
              <div className="h-4 bg-zinc-900 rounded-lg w-1/4" />
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-zinc-900 rounded w-full" />
                <div className="h-3 bg-zinc-900 rounded w-5/6" />
              </div>
            </div>
            <div className="h-28 bg-zinc-900/50 rounded-2xl border border-zinc-900" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center p-8 bg-zinc-900/30 backdrop-blur-xl border border-red-500/10 rounded-2xl shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-400 font-bold text-lg">!</div>
          <h3 className="text-zinc-200 font-semibold text-lg mb-1">Failed to load profile</h3>
          <p className="text-sm text-zinc-500 mb-4">{error || "The profile you are looking for does not exist."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/30"> 
      <ClientNavbar />
        
      {/* Cover Image Banner */}
      <div className="h-56 md:h-72 w-full bg-zinc-900 relative overflow-hidden">
        {profile.cover_url ? (
          <>
            <img 
              src={profile.cover_url} 
              alt="Profile Banner" 
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-zinc-950 to-zinc-950 relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800/60 to-transparent" />
      </div>

      {/* Main Profile Layout Wrapper */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-24">
        
        {/* Header Block: Avatar & Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="relative group self-start sm:self-auto">
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <img 
              src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}&background=18181b&color=a5b4fc`} 
              alt={profile.full_name} 
              className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover bg-zinc-900 border-4 border-zinc-950 shadow-2xl relative z-10 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          </div>
          
          {/* Action Buttons Panel */}
          {!checkingConnection && (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {!connectionStatus && (
                <button
                  onClick={sendConnectionRequest}
                  className="h-11 px-6 flex-1 sm:flex-none rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 border bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/10"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Connect</span>
                </button>
              )}

              {connectionStatus === "pending" && (
                <button
                  disabled
                  className="h-11 px-6 flex-1 sm:flex-none rounded-xl text-xs font-semibold tracking-wide border bg-zinc-900 border-zinc-800 text-zinc-400 cursor-not-allowed"
                >
                  Pending
                </button>
              )}

              {connectionStatus === "accepted" && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Connected Label Badge */}
                  <div className="h-11 px-5 rounded-xl text-xs font-semibold tracking-wide border bg-emerald-500/5 border-emerald-500/10 text-emerald-400 flex items-center justify-center gap-2 select-none">
                    <UserCheck className="w-4 h-4" />
                    <span>Connected</span>
                  </div>

                  {/* Clean Brutalist Disconnect Button */}
                  <button
                    onClick={removeConnection}
                    className="h-11 px-4 rounded-xl text-xs font-medium border border-white/5 bg-white/[0.02] text-neutral-400 hover:text-rose-400 hover:bg-rose-950/20 hover:border-rose-900/40 transition-all duration-200 flex items-center justify-center gap-1.5 group"
                    title="Remove Connection"
                  >
                    <UserMinus className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Core Biography & Details Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight">
                  {profile.full_name || "Creative Professional"}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Award className="w-3 h-3" /> Pro
                </span>
              </div>
              <p className="text-xs font-semibold text-indigo-400 tracking-widest mt-1.5 uppercase">
                {profile.specializations || "Media Creator"}
              </p>
            </div>

            {profile.bio ? (
              <p className="text-[14px] text-zinc-400 leading-relaxed max-w-2xl font-normal">
                {profile.bio}
              </p>
            ) : (
              <p className="text-xs text-zinc-600 italic">No biography provided yet.</p>
            )}

            {/* Micro Meta Badges */}
            <div className="flex flex-wrap gap-2 text-xs text-zinc-400 font-medium pt-2">
              {profile.location && (
                <div className="flex items-center gap-1.5 bg-zinc-900/30 px-3 py-1.5 rounded-xl border border-zinc-800/40 backdrop-blur-sm">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 bg-zinc-900/30 hover:bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-zinc-800/40 text-indigo-400 hover:text-indigo-300 transition-all group backdrop-blur-sm"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              )}
              <div className="flex items-center gap-1.5 bg-zinc-900/30 px-3 py-1.5 rounded-xl border border-zinc-800/40 backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>{profile.created_at ? `Joined ${new Date(profile.created_at).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}` : 'Member'}</span>
              </div>
            </div>
          </div>

          {/* Cleaned Metric Counter Card Side-panel (Works & Connection Count) */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-zinc-900/50 to-zinc-900/10 border border-zinc-900/80 backdrop-blur-xl grid grid-cols-2 md:grid-cols-1 gap-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Works</span>
              <span className="text-xl font-bold text-zinc-100 font-mono tracking-tight">{portfolioItems.length}</span>
            </div>
            <div className="h-[1px] bg-zinc-800/40 hidden md:block" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Connections</span>
              <span className="text-xl font-bold text-zinc-100 font-mono tracking-tight">{connectionsCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Two-Tab Navigation Bar */}
        <div className="mt-16 border-b border-zinc-900 flex items-center gap-6 relative">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-4 text-sm font-semibold tracking-wide transition-all relative flex items-center gap-2 ${
              activeTab === 'portfolio' ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Grid className={`w-4 h-4 transition-colors ${activeTab === 'portfolio' ? "text-indigo-400" : "text-zinc-500"}`} />
            <span>Portfolio Grid</span>
            {activeTab === 'portfolio' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-4 text-sm font-semibold tracking-wide transition-all relative flex items-center gap-2 ${
              activeTab === 'posts' ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <FileText className={`w-4 h-4 transition-colors ${activeTab === 'posts' ? "text-indigo-400" : "text-zinc-500"}`} />
            <span>Updates & Posts</span>
            {activeTab === 'posts' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] rounded-full" />
            )}
          </button>
        </div>

        {/* Content Render Logic Switcher */}
        <div className="mt-8">
          {activeTab === 'portfolio' ? (
            portfolioItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {portfolioItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative aspect-[4/3] rounded-2xl bg-zinc-900 border border-zinc-900/80 overflow-hidden cursor-pointer hover:border-zinc-700/50 transition-all duration-500 shadow-md hover:shadow-xl"
                    onClick={() => item.video_url && window.open(item.video_url, '_blank')}
                  >
                    <img 
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    
                    {item.video_url && (
                      <div className="absolute top-4 right-4 p-2.5 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/40 rounded-xl opacity-90 group-hover:opacity-100 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300 shadow-lg">
                        <Play className="w-3.5 h-3.5 fill-current text-white" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        <p className="text-sm font-semibold text-white truncate w-full">
                          {item.title}
                        </p>
                        {item.category && (
                          <span className="inline-block text-[10px] uppercase tracking-wider text-indigo-400 font-bold mt-1">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-zinc-800/80 rounded-2xl bg-zinc-900/10 backdrop-blur-sm max-w-md mx-auto">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800/60 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Grid className="w-5 h-5 text-zinc-500" />
                </div>
                <h4 className="text-zinc-300 font-medium text-sm">No portfolio pieces yet</h4>
                <p className="text-xs text-zinc-500 mt-1">This user hasn't uploaded items to their gallery.</p>
              </div>
            )
          ) : (
            posts.length > 0 ? (
              <div className="max-w-2xl mx-auto space-y-6">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="p-6 bg-zinc-900/20 border border-zinc-900/60 backdrop-blur-xl rounded-2xl space-y-4 hover:border-zinc-800/80 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-zinc-100 leading-snug">{post.title || "Untitled Update"}</h3>
                        {post.role && (
                          <span className="inline-flex items-center text-[10px] font-semibold tracking-wide text-zinc-400 bg-zinc-900/80 px-2.5 py-0.5 rounded-md border border-zinc-800 uppercase">
                            {post.role}
                          </span>
                        )}
                      </div>
                      {post.created_at && (
                        <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase bg-zinc-900/50 px-2.5 py-1 rounded-md border border-zinc-800/40 shrink-0">
                          {new Date(post.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>

                    {post.media_url && (
                      <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-zinc-900 bg-zinc-950 relative group shadow-inner">
                        <img 
                          src={post.media_url} 
                          alt="Post attachment" 
                          className="w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-[1.01]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-zinc-800/80 rounded-2xl bg-zinc-900/10 backdrop-blur-sm max-w-md mx-auto">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800/60 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <FileText className="w-5 h-5 text-zinc-500" />
                </div>
                <h4 className="text-zinc-300 font-medium text-sm">Quiet for now</h4>
                <p className="text-xs text-zinc-500 mt-1">This provider hasn't posted any recent updates.</p>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfileViewPage;