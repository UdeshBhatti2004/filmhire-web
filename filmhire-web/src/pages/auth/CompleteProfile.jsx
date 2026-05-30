import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const OPTIONS = [
  "Videographer",
  "Photographer",
  "Video Editor",
  "Drone Pilot",
  "Colorist",
  "Motion Designer",
  "Cinematographer",
];

const CompleteProfile = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        
        return;
      }

      setRole(data.role);
    };

    getRole();
  }, []);

  const toggleSpecialization = (item) => {
    if (specializations.includes(item)) {
      setSpecializations(
        specializations.filter((s) => s !== item)
      );
    } else {
      setSpecializations([...specializations, item]);
    }
  };

  const handleCompleteProfile = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("User not found");
        return;
      }

      let avatarUrl = null;

      if (avatar) {
        const fileName = `${user.id}-${Date.now()}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatar);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = data.publicUrl;
      }

      const finalData = {
        avatar_url: avatarUrl,
        bio,
        city,
        state,
      };

      if (role === "professional") {
        finalData.specializations = specializations;
      }

      if (role === "client") {
        finalData.company_name = companyName;
      }

      

      const { data: updatedProfile, error } = await supabase
        .from("profiles")
        .update(finalData)
        .eq("id", user.id)
        .select();

      

      if (error) throw error;

      navigate("/dashboard");
    } catch (err) {
      
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl">

        <div className="mb-10">
          <p className="text-violet-400 text-sm font-medium">
            Profile Setup
          </p>

          <h1 className="text-4xl font-semibold mt-2">
            Complete Your Profile
          </h1>

          <p className="text-neutral-400 mt-3">
            Help others understand who you are.
          </p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 space-y-8">

          <div>
            <label className="block text-sm text-neutral-400 mb-4">
              Profile Photo
            </label>

            <input
              type="file"
              hidden
              id="avatar"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
            />

            <label htmlFor="avatar">
              <div className="w-28 h-28 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center cursor-pointer hover:border-violet-500 transition overflow-hidden">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="text-neutral-500" size={24} />
                )}
              </div>
            </label>
          </div>

          {role === "professional" && (
            <div>
              <label className="block text-sm text-neutral-400 mb-4">
                Specializations
              </label>

              <div className="flex flex-wrap gap-3">
                {OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleSpecialization(item)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      specializations.includes(item)
                        ? "bg-violet-500 border-violet-500 text-white"
                        : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-neutral-400 mb-3">
              Bio
            </label>

            <textarea
              rows={5}
              maxLength={300}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-3">
                City
              </label>

              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Rajkot"
                className="w-full h-12 bg-neutral-900 border border-neutral-800 rounded-xl px-4 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-3">
                State
              </label>

              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Gujarat"
                className="w-full h-12 bg-neutral-900 border border-neutral-800 rounded-xl px-4 outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {role === "client" && (
            <div>
              <label className="block text-sm text-neutral-400 mb-3">
                Company Name
              </label>

              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="FutureHub Studios"
                className="w-full h-12 bg-neutral-900 border border-neutral-800 rounded-xl px-4 outline-none focus:border-violet-500"
              />
            </div>
          )}

          <button
            onClick={handleCompleteProfile}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
