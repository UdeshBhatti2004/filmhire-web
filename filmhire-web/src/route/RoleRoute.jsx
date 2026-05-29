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

        console.log("[RoleRoute] Checking access", {
          path: location.pathname,
          allowedRole,
        });

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[RoleRoute] getSession error", sessionError);
        }

        if (!session?.user) {
          console.warn("[RoleRoute] No authenticated session", {
            path: location.pathname,
            allowedRole,
          });
          if (!cancelled) {
            setAccess({ status: "logged-out", role: null });
          }
          return;
        }

        console.log("[RoleRoute] Profile fetch starting", {
          userId: session.user.id,
          path: location.pathname,
          allowedRole,
        });

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        console.log("[RoleRoute] Profile fetch finished", {
          userId: session.user.id,
          path: location.pathname,
          rawRole: profile?.role,
          error,
        });

        if (error) {
          console.error("[RoleRoute] Profile fetch error", {
            userId: session.user.id,
            path: location.pathname,
            allowedRole,
            error,
          });
          if (!cancelled) {
            setAccess({ status: "no-profile", role: null });
          }
          return;
        }

        const normalizedRole = normalizeRole(profile?.role);

        console.log("[RoleRoute] Profile role result", {
          userId: session.user.id,
          path: location.pathname,
          allowedRole,
          rawRole: profile?.role,
          normalizedRole,
          isAllowed: normalizedRole === allowedRole,
        });

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
      } catch (error) {
        console.error("[RoleRoute] Access check crashed", error);
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
    console.warn("[RoleRoute] Redirecting to login", {
      path: location.pathname,
      allowedRole,
    });
    return <Navigate to="/login" replace />;
  }

  if (access.status === "no-profile") {
    console.warn("[RoleRoute] Redirecting to role selection", {
      path: location.pathname,
      allowedRole,
    });
    return <Navigate to="/select-role" replace />;
  }

  if (access.status === "wrong-role") {
    console.warn("[RoleRoute] Redirecting wrong role", {
      path: location.pathname,
      allowedRole,
      actualRole: access.role,
      redirectTo: roleDashboardPaths[access.role] ?? "/dashboard",
    });
    return <Navigate to={roleDashboardPaths[access.role] ?? "/dashboard"} replace />;
  }

  console.log("[RoleRoute] Access allowed", {
    path: location.pathname,
    allowedRole,
    actualRole: access.role,
  });

  return children;
}

export default RoleRoute;
