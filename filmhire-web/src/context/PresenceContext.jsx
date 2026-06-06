import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const PresenceContext = createContext();

export function PresenceProvider({ children }) {
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    let channel;
      console.log("Presence Provider Mounted");

    const setupPresence = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      channel = supabase.channel("global-online-users", {
        config: {
          presence: {
            key: user.id,
          },
        },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState();

          const users = {};

          Object.keys(state).forEach((id) => {
            users[id] = true;
          });

          setOnlineUsers(users);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              online_at: new Date().toISOString(),
            });
          }
        });
    };

    setupPresence();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return (
    <PresenceContext.Provider
      value={{ onlineUsers }}
    >
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  return useContext(PresenceContext);
}