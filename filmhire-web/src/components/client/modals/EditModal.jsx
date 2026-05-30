import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

const EditJobModal = ({ isOpen, job, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [shootDate, setShootDate] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!job) return;

    setTitle(job.title || "");
    setDescription(job.description || "");
    setCategory(job.category || "");
    setLocation(job.location_text || "");
    setBudgetMin(job.budget_min || "");
    setBudgetMax(job.budget_max || "");
    setShootDate(job.shoot_date || "");
    setDuration(job.shoot_duration_hrs || "");
  }, [job]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

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

      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-4 bg-[#111111] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit Job</h2>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
          />

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
          >
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate</option>
            <option value="event">Event</option>
            <option value="reel">Reel</option>
            <option value="real_estate">Real Estate</option>
            <option value="other">Other</option>
          </select>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              placeholder="Budget Min"
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
            />

            <input
              type="number"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              placeholder="Budget Max"
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={shootDate}
              onChange={(e) => setShootDate(e.target.value)}
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
            />

            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration (Hours)"
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 rounded-lg text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded-lg text-white"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
