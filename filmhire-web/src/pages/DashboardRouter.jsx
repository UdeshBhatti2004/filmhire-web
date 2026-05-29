import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const DashboardRouter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        navigate("/select-role");
        return;
      }

      if (profile.role === "client") {
        navigate("/client/dashboard");
      } else if (profile.role === "professional") {
        navigate("/professional/dashboard");
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