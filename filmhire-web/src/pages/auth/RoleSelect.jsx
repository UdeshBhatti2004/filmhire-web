import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Briefcase, UserCheck } from "lucide-react";

const RoleSelect = () => {
  const navigate = useNavigate();

  // GET LOGGED IN USER
  const user = useSelector((state) => state.auth.user);


  // UI Interactive States
  const [loading, setLoading] = useState(false);



  // =========================
  // HANDLE ROLE SELECTION
  // =========================
  const handleSelectRole = async (role) => {

        const {
  data: { user: authUser },
} = await supabase.auth.getUser();

console.log(authUser);

    try {
      setLoading(true);
      // SAFETY CHECK
      if (!user) {
        alert("No user found");
        return;
      }

      // CREATE PROFILE
      const { error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "User",
          role,
        });

      if (error) {
        alert(error.message);
        return;
      }

        navigate("/complete-profile");

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col antialiased selection:bg-neutral-800 selection:text-white font-poppins relative overflow-x-hidden p-6 md:p-12">
      
      {/* Injecting Poppins and Alex Brush Cursive Typefaces */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .font-cursive { font-family: 'Alex Brush', cursive; }
      `}</style>

      {/* Ambient background glow behind the form container */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.07] bg-violet-500 pointer-events-none" />

      {/* Brand / Logo - Pinned to the Top Left */}
      <div className="relative z-10 flex items-center gap-3 self-start select-none mb-12 md:mb-0">
        <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm tracking-tight shadow-lg shadow-white/5">
          FH
        </div>
        <span className="font-medium tracking-tight text-sm text-neutral-400">FutureHub</span>
      </div>

      {/* Center Interface Platform Container */}
      <div className="flex-1 flex items-center justify-center relative z-10 w-full">
        <div className="w-full max-w-[560px] space-y-10">
          
          {/* Section Introduction */}
          <div className="space-y-2 border-b border-neutral-800 pb-6">
            <h2 className="text-2xl font-medium tracking-tight text-neutral-100">Select Profile Path</h2>
            <p className="text-sm text-neutral-400">Step 02 / Configure account operational environment</p>
          </div>

          {/* Dual Selection Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* CLIENT ACCESS BUTTON CARD */}
            <div className="group relative bg-neutral-900/40 border border-neutral-800 hover:border-violet-500/40 rounded-xl p-6 flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-violet-400 transition-colors duration-300 mb-4">
                  <UserCheck className="w-5 h-5" />
                </div>
                
                <h3 className="text-lg font-medium text-neutral-100 tracking-tight">
                  Hire Talent
                </h3>
                
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-light">
                  Find premium videographers, editors, and vetted visual creators for your productions.
                </p>
              </div>

              <button
                disabled={loading}
                onClick={() => handleSelectRole("client")}
                className="mt-8 w-full h-11 bg-neutral-900 group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 rounded-xl font-medium text-xs tracking-wide uppercase text-neutral-300 group-hover:text-neutral-950 transition-all duration-300 border border-neutral-800 group-hover:border-transparent active:scale-[0.98]"
              >
                As Client
              </button>
            </div>

            {/* PROFESSIONAL ACCESS BUTTON CARD */}
            <div className="group relative bg-neutral-900/40 border border-neutral-800 hover:border-violet-500/40 rounded-xl p-6 flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-violet-400 transition-colors duration-300 mb-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                
                <h3 className="text-lg font-medium text-neutral-100 tracking-tight">
                  Find Work
                </h3>
                
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-light">
                  Showcase high-fidelity portfolios, source projects, and secure digital contracts.
                </p>
              </div>

              <button
                disabled={loading}
                onClick={() => handleSelectRole("professional")}
                className="mt-8 w-full h-11 bg-neutral-900 group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 rounded-xl font-medium text-xs tracking-wide uppercase text-neutral-300 group-hover:text-neutral-950 transition-all duration-300 border border-neutral-800 group-hover:border-transparent active:scale-[0.98]"
              >
                As Professional
              </button>
            </div>

          </div>

          {/* Loading Indicator Overlap */}
          {loading && (
            <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 font-mono tracking-widest uppercase py-2">
              <span className="w-3 h-3 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
              Writing Identity Matrix...
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default RoleSelect;