import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {supabase} from "../../lib/supabase"

import {
  setSession,
  setRole,
  clearAuth,
  setLoading,
} from "../../store/slice/authSlice";

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        dispatch(setSession(session));

        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        dispatch(setRole(data?.role));
      } else {
        dispatch(clearAuth());
      }

      dispatch(setLoading(false));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getSession = async () => {
    dispatch(setLoading(true));

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      dispatch(setSession(session));

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      dispatch(setRole(data?.role));
    } else {
      dispatch(clearAuth());
    }

    dispatch(setLoading(false));
  };

  return children;
}

export default AuthProvider;