import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

const roleDashboardPaths = {
  client: "/client/dashboard",
  professional: "/professional/dashboard",
};

const normalizeRole = (role) => role?.trim().toLowerCase();

function RoleRoute({ allowedRole, children }) {
  const [access, setAccess] = useState({
    status: "loading",
    role: null,
  });

  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const checkAccess = async () => {
      try {
        setAccess({ status: "loading", role: null });

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (!cancelled) {
            setAccess({ status: "logged-out", role: null });
          }
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          if (!cancelled) {
            setAccess({ status: "no-profile", role: null });
          }
          return;
        }

        const normalizedRole = normalizeRole(profile?.role);

        if (!normalizedRole) {
          if (!cancelled) {
            setAccess({ status: "no-profile", role: null });
          }
          return;
        }

        if (!cancelled) {
          setAccess({
            status: normalizedRole === allowedRole ? "allowed" : "wrong-role",
            role: normalizedRole,
          });
        }
      } catch {
        if (!cancelled) {
          setAccess({ status: "no-profile", role: null });
        }
      }
    };

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [allowedRole, location.pathname]);

  if (access.status === "loading") {
    return <h1>Loading...</h1>;
  }

  if (access.status === "logged-out") {
    return <Navigate to="/login" replace />;
  }

  if (access.status === "no-profile") {
    return <Navigate to="/select-role" replace />;
  }

  if (access.status === "wrong-role") {
    return (
      <Navigate
        to={roleDashboardPaths[access.role] ?? "/dashboard"}
        replace
      />
    );
  }

  return children;
}

export default RoleRoute;