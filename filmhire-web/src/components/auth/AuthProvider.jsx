import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {supabase} from "../../lib/supabase"

import {
  setSession,
  setRole,
  clearAuth,
  setLoading,
} from "../../store/slice/authSlice";

const normalizeRole = (role) => role?.trim().toLowerCase() ?? null;

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadRole = async (session, source) => {
      console.log(`[AuthProvider] ${source} profile role fetch starting`, {
        userId: session.user.id,
      });

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error(`[AuthProvider] ${source} profile role fetch error`, error);
      }

      console.log(`[AuthProvider] ${source} role loaded`, {
        userId: session.user.id,
        rawRole: data?.role,
        normalizedRole: normalizeRole(data?.role),
      });

      dispatch(setRole(normalizeRole(data?.role)));
      dispatch(setLoading(false));
    };

    const getSession = async () => {
      dispatch(setLoading(true));

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        dispatch(setSession(session));
        console.log("[AuthProvider] Session loaded", {
          userId: session.user.id,
          email: session.user.email,
        });

        await loadRole(session, "Initial");
      } else {
        console.warn("[AuthProvider] No session found");
        dispatch(clearAuth());
        dispatch(setLoading(false));
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[AuthProvider] Auth state changed", {
        event: _event,
        userId: session?.user?.id,
        email: session?.user?.email,
      });

      if (session) {
        dispatch(setSession(session));
        setTimeout(() => {
          loadRole(session, "Auth change");
        }, 0);
      } else {
        console.warn("[AuthProvider] Auth state has no session");
        dispatch(clearAuth());
        dispatch(setLoading(false));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return children;
}

export default AuthProvider;
