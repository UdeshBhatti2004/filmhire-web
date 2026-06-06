// ConnectionsPage.jsx
import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  UserMinus, 
  ArrowUpRight, 
  Loader2,
  Inbox
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import ConnectionRequests from "./ConnectionRequests";

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [droppingId, setDroppingId] = useState(null);

  const fetchNetwork = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: rawConnections, error: connError } = await supabase
        .from("connections")
        .select("id, created_at, user_a, user_b")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (connError) throw connError;
      if (!rawConnections || rawConnections.length === 0) {
        setConnections([]);
        return;
      }

      const targetUserIds = rawConnections.map(row => 
        row.user_a === user.id ? row.user_b : row.user_a
      );

      const { data: targetProfiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", targetUserIds);

      if (profileError) throw profileError;

      const formattedConnections = rawConnections.map(row => {
        const targetId = row.user_a === user.id ? row.user_b : row.user_a;
        const profileMatch = targetProfiles?.find(p => p.id === targetId);

        return {
          connectionRowId: row.id,
          connectedAt: row.created_at,
          ...profileMatch
        };
      }).filter(item => item.id);

      setConnections(formattedConnections);
    } catch (err) {
      console.error("Network interface error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetwork();
  }, []);

  const handleDisconnect = async (connectionRowId) => {
    try {
      setDroppingId(connectionRowId);
      const { error } = await supabase
        .from("connections")
        .delete()
        .eq("id", connectionRowId);

      if (error) throw error;

      setConnections((prev) =>
        prev.filter((item) => item.connectionRowId !== connectionRowId)
      );
    } catch (err) {
      console.error("Failed to terminate connection mapping:", err);
    } finally {
      setDroppingId(null);
    }
  };

  const filteredConnections = connections.filter((item) => {
    const searchTarget = `${item.full_name || ""} ${item.specializations || ""}`.toLowerCase();
    return searchTarget.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-200 antialiased pl-16 selection:bg-white/10 selection:text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        
        {/* HEADER SECTION */}
        <div className="border-b border-neutral-900 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neutral-500">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono tracking-widest uppercase font-medium">
                Network Directory
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-100">
              My Network
            </h1>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
            <input 
              type="text"
              placeholder="Filter by name or toolset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 bg-neutral-900/40 border border-neutral-900 focus:border-neutral-800 rounded-lg text-[11px] placeholder:text-neutral-600 focus:outline-none transition-all duration-150"
            />
          </div>
        </div>

        {/* SECTION 1: MINIMAL PENDING INVITES ROW */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between border-b border-neutral-900/50 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
              <h3 className="text-[10px] font-mono font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Inbox className="w-3 h-3 text-neutral-500" />
                Pending Invites
              </h3>
            </div>
          </div>
          <div className="bg-neutral-900/10 border border-neutral-900/40 rounded-xl p-1.5 backdrop-blur-sm">
            <ConnectionRequests onDataChange={fetchNetwork} />
          </div>
        </div>

        {/* SECTION 2: THE ACTIVE DIRECTORY */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-mono font-medium text-neutral-500 uppercase tracking-wider">
              Connected Directory ({filteredConnections.length})
            </h3>
          </div>

          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-neutral-500 animate-spin" />
            </div>
          ) : filteredConnections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredConnections.map((peer) => (
                <div 
                  key={peer.id}
                  className="group relative rounded-xl bg-neutral-900/10 border border-neutral-900 p-4 flex flex-col justify-between hover:border-neutral-800/60 hover:bg-neutral-900/20 transition-all duration-200"
                >
                  <div className="flex gap-3 items-start">
                    <div className="relative shrink-0">
                      <img 
                        src={peer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(peer.full_name || "U")}&background=0a0a0a&color=737373`}
                        alt={peer.full_name} 
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-950 border border-neutral-900"
                      />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-neutral-200 truncate transition-colors">
                        {peer.full_name || "Creative Professional"}
                      </h4>
                      <p className="text-[9px] text-neutral-400 font-mono tracking-wide uppercase truncate">
                        {peer.specializations || "Media Architect"}
                      </p>
                      {peer.location && (
                        <p className="text-[10px] text-neutral-500 truncate pt-0.5">
                          {peer.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center gap-1.5">
                    <a 
                      href={`/profile/${peer.id}`}
                      className="h-7 px-2.5 flex-1 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-900 text-neutral-400 hover:text-neutral-200 rounded-lg text-[10px] font-medium transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
                    >
                      <span>View Profile</span>
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                    
                    <button
                      onClick={() => handleDisconnect(peer.connectionRowId)}
                      disabled={droppingId === peer.connectionRowId}
                      className="h-7 w-7 bg-transparent hover:bg-rose-950/10 text-neutral-600 hover:text-rose-400 border border-transparent hover:border-rose-900/20 rounded-lg flex items-center justify-center transition-all active:scale-95"
                      title="Remove Connection"
                    >
                      {droppingId === peer.connectionRowId ? (
                        <Loader2 className="w-3 h-3 animate-spin text-rose-400" />
                      ) : (
                        <UserMinus className="w-3 h-3 opacity-60" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-neutral-900 rounded-xl max-w-sm mx-auto bg-neutral-900/5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800/60 flex items-center justify-center mx-auto mb-2">
                <Users className="w-3.5 h-3.5 text-neutral-600" />
              </div>
              <h4 className="text-neutral-400 font-medium text-[11px]">No Active Connections</h4>
              <p className="text-[10px] text-neutral-600 mt-0.5 max-w-[200px] mx-auto leading-relaxed">
                {searchQuery ? "No matches found for that criteria." : "Your network directory is empty."}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ConnectionsPage;