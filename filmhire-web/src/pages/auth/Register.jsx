import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // EMAIL REGISTER
  // =========================
  const handleEmailRegister = async () => {
    try {
      setLoading(true);

      // VALIDATION
      if (!fullName || !email || !password) {
        alert("Please fill all fields");
        return;
      }

      // CREATE AUTH USER
      const { data, error } = await supabase.auth.signUp({
        email,
        password,

        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      // SAVE USER IN REDUX
      if (user) {
        dispatch(setUser(user));

        // GO TO ROLE SELECT PAGE
        navigate("/select-role");
      }
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          redirectTo: "http://localhost:5173/select-role",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* LOGO */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0a66c2]">
            FilmHire
          </h1>

          <p className="text-sm text-gray-600 mt-2">
            Hire local videographers & cinematographers
          </p>
        </div>

        {/* HEADING */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Create your account
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Join the creative network today.
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* FULL NAME */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#0a66c2] focus:ring-4 focus:ring-blue-100 transition"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#0a66c2] focus:ring-4 focus:ring-blue-100 transition"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#0a66c2] focus:ring-4 focus:ring-blue-100 transition"
          />

          {/* EMAIL BUTTON */}
          <button
            onClick={handleEmailRegister}
            disabled={loading}
            className="w-full bg-[#0a66c2] hover:bg-[#004182] disabled:opacity-70 text-white font-semibold py-3 rounded-full transition duration-200"
          >
            {loading
              ? "Creating Account..."
              : "Continue with Email"}
          </button>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-[1px] bg-gray-300"></div>

          <span className="text-sm text-gray-500">
            or
          </span>

          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 hover:bg-gray-50 py-3 rounded-full flex items-center justify-center gap-3 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />

          <span className="font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}

          <span className="text-[#0a66c2] font-semibold cursor-pointer hover:underline">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;