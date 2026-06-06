// ConnectionRequests.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Check, X, Users, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";

const ConnectionRequests = ({ onDataChange }) => {
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests"); // "requests" | "connections"
  const [requestSubTab, setRequestSubTab] = useState("received"); // "received" | "sent"

  const fetchRequests = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (requestSubTab === "received") {
        const { data, error } = await supabase
          .from("connection_requests")
          .select(`
            *,
            sender:profiles!connection_requests_sender_id_fkey (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq("receiver_id", user.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRequests(data || []);
      } else {
        const { data, error } = await supabase
          .from("connection_requests")
          .select(`
            *,
            receiver:profiles!connection_requests_receiver_id_fkey (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq("sender_id", user.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRequests(data || []);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  }, [requestSubTab]);

  const fetchConnections = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: connectionsData, error } = await supabase
        .from("connections")
        .select("*")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

      if (error) throw error;

      if (!connectionsData || connectionsData.length === 0) {
        setConnections([]);
        return;
      }

      const profiles = await Promise.all(
        connectionsData.map(async (connection) => {
          const otherUserId =
            connection.user_a === user.id
              ? connection.user_b
              : connection.user_a;

          const { data: profile } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .eq("id", otherUserId)
            .maybeSingle();

          return {
            ...connection,
            profile: profile || { id: otherUserId, full_name: "User", avatar_url: null },
          };
        })
      );

      setConnections(profiles);
    } catch (err) {
      console.error("Error fetching connections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "requests") {
      fetchRequests();
    } else {
      fetchConnections();
    }
  }, [activeTab, requestSubTab, fetchRequests, fetchConnections]);

  const handleActionComplete = () => {
    if (onDataChange) onDataChange();
  };

  const acceptRequest = async (request) => {
    try {
      const targetProfile = request.sender;
      if (!targetProfile) return;

      setRequests((prev) => prev.filter((item) => item.id !== request.id));
      
      const optimisticConnectionRow = {
        id: `temp-${Date.now()}`,
        user_a: request.sender_id,
        user_b: request.receiver_id,
        created_at: new Date().toISOString(),
        profile: {
          id: targetProfile.id,
          full_name: targetProfile.full_name,
          avatar_url: targetProfile.avatar_url
        }
      };
      
      setConnections((prev) => [optimisticConnectionRow, ...prev]);

      const { error: updateError } = await supabase
        .from("connection_requests")
        .update({ status: "accepted" })
        .eq("id", request.id);

      if (updateError) throw updateError;

      const { error: connectionError } = await supabase
        .from("connections")
        .insert({
          user_a: request.sender_id,
          user_b: request.receiver_id,
        });

      if (connectionError) throw connectionError;

      handleActionComplete();
      await fetchConnections(true);
    } catch (err) {
      console.error("Accept error:", err);
      fetchRequests();
      fetchConnections();
    }
  };

  // Completely deletes the row from connection_requests on rejection
  const rejectRequest = async (requestId) => {
    try {
      setRequests((prev) => prev.filter((item) => item.id !== requestId));
      
      const { error } = await supabase
        .from("connection_requests")
        .delete()
        .eq("id", requestId);

      if (error) throw error;
      handleActionComplete();
    } catch (err) {
      console.error("Reject error:", err);
      fetchRequests();
    }
  };

  const cancelSentRequest = async (requestId) => {
    try {
      setRequests((prev) => prev.filter((item) => item.id !== requestId));
      const { error } = await supabase
        .from("connection_requests")
        .delete()
        .eq("id", requestId);

      if (error) throw error;
      handleActionComplete();
    } catch (err) {
      console.error("Cancel error:", err);
      fetchRequests();
    }
  };

  const removeConnection = async (connection) => {
    try {
      setConnections((prev) => prev.filter((item) => item.id !== connection.id));

      const { error } = await supabase
        .from("connections")
        .delete()
        .or(`id.eq.${connection.id},and(user_a.eq.${connection.user_a},user_b.eq.${connection.user_b}),and(user_a.eq.${connection.user_b},user_b.eq.${connection.user_a})`);

      if (error) throw error;
      handleActionComplete();
    } catch (err) {
      console.error("Remove connection error:", err);
      fetchConnections();
    }
  };

  return (
    <div className="p-6 bg-zinc-900 border border-white/5 rounded-3xl space-y-6 text-left selection:bg-white selection:text-black">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
        <Users className="w-4 h-4 text-indigo-400" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-200">
          Network
        </h2>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
            activeTab === "requests"
              ? "bg-indigo-600 text-white"
              : "bg-white/[0.03] text-neutral-400 hover:text-white"
          }`}
        >
          Requests
        </button>

        <button
          onClick={() => setActiveTab("connections")}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
            activeTab === "connections"
              ? "bg-indigo-600 text-white"
              : "bg-white/[0.03] text-neutral-400 hover:text-white"
          }`}
        >
          My Connections ({connections.length})
        </button>
      </div>

      {/* Main Content Area */}
      {loading && requests.length === 0 && connections.length === 0 ? (
        <div className="p-12 bg-white/[0.02] border border-white/5 rounded-2xl text-xs text-neutral-400 text-center font-mono">
          Loading...
        </div>
      ) : activeTab === "requests" ? (
        <div className="space-y-4">
          {/* Sub-Tabs: Received vs Pending */}
          <div className="flex gap-4 border-b border-white/5 pb-2 text-xs">
            <button
              onClick={() => setRequestSubTab("received")}
              className={`pb-2 flex items-center gap-1.5 border-b-2 transition-all ${
                requestSubTab === "received"
                  ? "border-indigo-500 text-white font-medium"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <ArrowDownLeft className="w-3 h-3" /> Received
            </button>
            <button
              onClick={() => setRequestSubTab("sent")}
              className={`pb-2 flex items-center gap-1.5 border-b-2 transition-all ${
                requestSubTab === "sent"
                  ? "border-indigo-500 text-white font-medium"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <ArrowUpRight className="w-3 h-3" /> Pending
            </button>
          </div>

          {/* Requests List */}
          {requests.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-white/5 rounded-2xl bg-black/10">
              <p className="text-xs text-neutral-500">
                {requestSubTab === "received"
                  ? "No incoming requests."
                  : "No pending sent requests."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {requests.map((request) => {
                const profile = requestSubTab === "received" ? request.sender : request.receiver;
                return (
                  <div
                    key={request.id}
                    className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          profile?.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            profile?.full_name || "User"
                          )}`
                        }
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                      />

                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">
                          {profile?.full_name || "User"}
                        </h3>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {requestSubTab === "received"
                            ? "Wants to connect"
                            : "Waiting for reply"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {requestSubTab === "received" ? (
                        <>
                          <button
                            onClick={() => acceptRequest(request)}
                            className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => rejectRequest(request.id)}
                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center border border-white/5 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => cancelSentRequest(request.id)}
                          className="px-3 py-1.5 text-[11px] rounded-xl bg-zinc-800 hover:bg-rose-950/40 border border-white/5 hover:border-rose-900/50 text-neutral-400 hover:text-rose-400 transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* My Connections Tab */
        connections.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-white/5 rounded-2xl bg-black/10">
            <p className="text-xs text-neutral-500">
              No connections found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      connection.profile?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        connection.profile?.full_name || "User"
                      )}`
                    }
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                  />

                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">
                      {connection.profile?.full_name}
                    </h3>
                    <p className="text-[11px] text-emerald-400 tracking-wide">
                      ● Connected
                    </p>
                  </div>
                </div>

                {/* Remove Connection Button */}
                <button
                  onClick={() => removeConnection(connection)}
                  className="px-3 py-1.5 text-[11px] rounded-xl bg-zinc-800 hover:bg-rose-950/40 border border-white/5 hover:border-rose-900/50 text-neutral-400 hover:text-rose-400 transition-all shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ConnectionRequests;