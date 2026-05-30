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
      

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      

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
        

        await loadRole(session, "Initial");
      } else {
        
        dispatch(clearAuth());
        dispatch(setLoading(false));
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
     

      if (session) {
        dispatch(setSession(session));
        setTimeout(() => {
          loadRole(session, "Auth change");
        }, 0);
      } else {
        
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
