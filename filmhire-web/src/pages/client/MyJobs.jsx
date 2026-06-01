import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";

import { selectUser } from "../../store/slice/authSlice";
import { supabase } from "../../lib/supabase";
import ClientNavbar from "../../components/client/ClientNavbar";

function MyJobs() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
        return;
      }

      setJobs(data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <ClientNavbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-indigo-400 mb-2">
            Jobs Workspace
          </p>

          <h1 className="text-4xl font-bold">My Jobs</h1>

          <p className="text-neutral-500 mt-2">
            Manage and monitor all jobs you've posted.
          </p>
        </div>

        {loading ? (
          <div className="text-neutral-400">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-10 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No jobs found
            </h2>

            <p className="text-neutral-500 mb-6">
              You haven't created any jobs yet.
            </p>

            <button
              onClick={() => navigate("/client/create-job")}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all"
            >
              Create Your First Job
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 hover:border-indigo-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {job.title}
                    </h2>

                    <p className="text-neutral-400 mt-2 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === "open"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-indigo-500/10 text-indigo-400"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-5 text-sm text-neutral-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location_text}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {job.shoot_date}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="text-lg font-semibold text-indigo-400">
                    ₹{job.budget_min.toLocaleString()} - ₹
                    {job.budget_max.toLocaleString()}
                  </div>

                  <button
                    onClick={() => navigate(`/client/jobs/${job.id}`)}
                    className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] rounded-xl text-sm transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyJobs;