import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const normalizeRole = (role) => role?.trim().toLowerCase();

const DashboardRouter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      console.log("[DashboardRouter] Checking dashboard destination");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("[DashboardRouter] getUser error", userError);
      }

      if (!user) {
        console.warn("[DashboardRouter] No authenticated user, redirecting to login");
        navigate("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (error || !profile?.role) {
        console.warn("[DashboardRouter] Missing role, redirecting to role selection", {
          userId: user.id,
          rawRole: profile?.role,
          error,
        });
        navigate("/select-role", { replace: true });
        return;
      }

      const role = normalizeRole(profile.role);

      console.log("[DashboardRouter] Role destination result", {
        userId: user.id,
        rawRole: profile.role,
        normalizedRole: role,
      });

      if (role === "client") {
        navigate("/client/dashboard", { replace: true });
      } else if (role === "professional") {
        navigate("/professional/dashboard", { replace: true });
      } else {
        console.warn("[DashboardRouter] Unknown role, redirecting to role selection", {
          userId: user.id,
          rawRole: profile.role,
          normalizedRole: role,
        });
        navigate("/select-role", { replace: true });
      }
    };

    checkRole();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
      Loading...
    </div>
  );
};

export default DashboardRouter;
