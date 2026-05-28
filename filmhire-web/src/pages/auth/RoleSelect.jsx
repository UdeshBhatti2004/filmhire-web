import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

const RoleSelect = () => {
  const navigate = useNavigate();

  // GET LOGGED IN USER
  const user = useSelector((state) => state.auth.user);

  // =========================
  // HANDLE ROLE SELECTION
  // =========================
  const handleSelectRole = async (role) => {
    try {
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

      // REDIRECT BASED ON ROLE
      if (role === "client") {
        navigate("/client/dashboard");
      } else {
        navigate("/professional/dashboard");
      }

    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center px-4">

      <div className="w-full max-w-5xl">

        {/* HEADING */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            How do you want to use FilmHire?
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Choose your role to personalize your experience.
          </p>
        </div>

        {/* ROLE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* CLIENT CARD */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition border border-transparent hover:border-[#0a66c2]">

            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mb-6">
              🎬
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              Hire Talent
            </h2>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Find videographers, cinematographers, editors
              and creative professionals for weddings,
              events, reels, ads and more.
            </p>

            <button
              onClick={() => handleSelectRole("client")}
              className="mt-8 w-full bg-[#0a66c2] hover:bg-[#004182] text-white py-3 rounded-full font-semibold transition"
            >
              Continue as Client
            </button>
          </div>

          {/* PROFESSIONAL CARD */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition border border-transparent hover:border-black">

            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl mb-6">
              📸
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              Find Work
            </h2>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Showcase your portfolio, connect with nearby
              clients and get hired for shoots and creative
              projects locally.
            </p>

            <button
              onClick={() => handleSelectRole("professional")}
              className="mt-8 w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full font-semibold transition"
            >
              Continue as Professional
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoleSelect;