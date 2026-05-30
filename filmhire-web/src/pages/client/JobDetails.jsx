import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ClientNavbar from "../../components/client/ClientNavbar";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [category, setCategory] = useState("");
const [location, setLocation] = useState("");
const [budgetMin, setBudgetMin] = useState("");
const [budgetMax, setBudgetMax] = useState("");
const [shootDate, setShootDate] = useState("");
const [duration, setDuration] = useState("");

  useEffect(() => {
    fetchJob();
  }, []);

  useEffect(() => {
  if (job) {
    setTitle(job.title || "");
    setDescription(job.description || "");
    setCategory(job.category || "");
    setLocation(job.location_text || "");
    setBudgetMin(job.budget_min || "");
    setBudgetMax(job.budget_max || "");
    setShootDate(job.shoot_date || "");
    setDuration(job.shoot_duration_hrs || "");
  }
}, [job]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      setJob(data);
    } finally {
      setLoading(false);
    }
  };

const handleUpdate = async () => {
  const { error } = await supabase
    .from("jobs")
    .update({
      title,
      description,
      category,
      location_text: location,
      budget_min: budgetMin,
      budget_max: budgetMax,
      shoot_date: shootDate,
      shoot_duration_hrs: duration,
    })
    .eq("id", job.id);

  if (error) {
    alert(error.message);
    return;
  }

  await fetchJob();

  setShowEditModal(false);

  alert("Job updated successfully");
};


const handleDelete = async () => {
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Job deleted successfully");

  navigate("/client/jobs");
};


  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] text-white">
        <ClientNavbar />
        <div className="max-w-6xl mx-auto px-6 py-8">
          Loading...
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#030303] text-white">
        <ClientNavbar />
        <div className="max-w-6xl mx-auto px-6 py-8">
          Job not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <ClientNavbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8">

          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-indigo-400 mb-2">
                Job Details
              </p>

              <h1 className="text-4xl font-bold">
                {job.title}
              </h1>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${job.status === "open"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                }`}
            >
              {job.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-[#0f0f11] border border-white/[0.06] rounded-2xl p-5">
              <p className="text-xs uppercase text-neutral-500 mb-2">
                Category
              </p>

              <p className="text-lg">
                {job.category}
              </p>
            </div>

            <div className="bg-[#0f0f11] border border-white/[0.06] rounded-2xl p-5">
              <p className="text-xs uppercase text-neutral-500 mb-2">
                Location
              </p>

              <p className="text-lg">
                {job.location_text}
              </p>
            </div>

            <div className="bg-[#0f0f11] border border-white/[0.06] rounded-2xl p-5">
              <p className="text-xs uppercase text-neutral-500 mb-2">
                Budget Range
              </p>

              <p className="text-lg text-indigo-400">
                ₹{job.budget_min?.toLocaleString()} - ₹{job.budget_max?.toLocaleString()}
              </p>
            </div>

            <div className="bg-[#0f0f11] border border-white/[0.06] rounded-2xl p-5">
              <p className="text-xs uppercase text-neutral-500 mb-2">
                Shoot Duration
              </p>

              <p className="text-lg">
                {job.shoot_duration_hrs} Hours
              </p>
            </div>

            <div className="bg-[#0f0f11] border border-white/[0.06] rounded-2xl p-5">
              <p className="text-xs uppercase text-neutral-500 mb-2">
                Shoot Date
              </p>

              <p className="text-lg">
                {job.shoot_date}
              </p>
            </div>

            <div className="bg-[#0f0f11] border border-white/[0.06] rounded-2xl p-5">
              <p className="text-xs uppercase text-neutral-500 mb-2">
                Created At
              </p>

              <p className="text-lg">
                {new Date(job.created_at).toLocaleDateString()}
              </p>
            </div>

          </div>

          <div className="mt-8 bg-[#0f0f11] border border-white/[0.06] rounded-2xl p-6">
            <p className="text-xs uppercase text-neutral-500 mb-4">
              Description
            </p>

            <p className="text-neutral-300 leading-relaxed">
              {job.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-blue-600 rounded-lg"
            >
              Edit Job
            </button>

            <button className="px-5 py-3 bg-white/[0.05] hover:bg-white/[0.08] rounded-xl transition-all">
              View Applicants
            </button>

            <button
  onClick={() => setShowDeleteModal(true)}
  className="px-5 py-3 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-all"
>
  Delete Job
</button>
          </div>

        </div>
      </div>

      {showEditModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Edit Job</h2>

        <button
          onClick={() => setShowEditModal(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

     <div className="space-y-4">
  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Title"
    className="w-full p-3 bg-black border border-gray-700 rounded-lg"
  />

  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Description"
    rows={4}
    className="w-full p-3 bg-black border border-gray-700 rounded-lg"
  />

<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full p-3 bg-black border border-gray-700 rounded-lg"
>
  <option value="Photographer">Photographer</option>
  <option value="Videographer">Videographer</option>
  <option value="Editor">Editor</option>
</select>

  <input
    type="text"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    placeholder="Location"
    className="w-full p-3 bg-black border border-gray-700 rounded-lg"
  />

  <div className="grid md:grid-cols-2 gap-4">
    <input
      type="number"
      value={budgetMin}
      onChange={(e) => setBudgetMin(e.target.value)}
      placeholder="Budget Min"
      className="w-full p-3 bg-black border border-gray-700 rounded-lg"
    />

    <input
      type="number"
      value={budgetMax}
      onChange={(e) => setBudgetMax(e.target.value)}
      placeholder="Budget Max"
      className="w-full p-3 bg-black border border-gray-700 rounded-lg"
    />
  </div>

  <div className="grid md:grid-cols-2 gap-4">
    <input
      type="date"
      value={shootDate}
      onChange={(e) => setShootDate(e.target.value)}
      className="w-full p-3 bg-black border border-gray-700 rounded-lg"
    />

    <input
      type="number"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      placeholder="Duration (Hours)"
      className="w-full p-3 bg-black border border-gray-700 rounded-lg"
    />
  </div>
</div>

<div className="flex justify-end gap-3 pt-4">
  <button
    type="button"
    onClick={() => setShowEditModal(false)}
    className="px-5 py-3 bg-white/10 rounded-xl"
  >
    Cancel
  </button>

  <button
    type="button"
    onClick={handleUpdate}
    className="px-5 py-3 bg-blue-600 rounded-xl"
  >
    Save Changes
  </button>
</div>
    </div>
  </div>
)}

{showDeleteModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
      <h2 className="text-xl font-bold mb-4">
        Delete Job
      </h2>

      <p className="text-neutral-400 mb-6">
        Are you sure you want to delete this job?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 bg-white/10 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default JobDetails;