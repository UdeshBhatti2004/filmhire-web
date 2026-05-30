import React, { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return;
    }

    navigate("/login");
  };
  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "professional") {
        navigate("/client/dashboard");
        return;
      }
    };

    checkAccess();
  }, []);

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfessionalDashboard;
