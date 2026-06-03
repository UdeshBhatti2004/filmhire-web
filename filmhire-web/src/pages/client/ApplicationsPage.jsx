import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ClientNavbar from "../../components/client/ClientNavbar";

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "wedding",
    "corporate",
    "event",
    "reel",
    "real_estate",
    "other",
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: jobs } = await supabase
        .from("jobs")
        .select("id")
        .eq("client_id", user.id);

      const jobIds = jobs?.map((job) => job.id) || [];

      if (jobIds.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          jobs (
            id,
            title,
            category,
            budget_min,
            budget_max
          ),
          profiles (
            id,
            full_name,
            avatar_url,
            city,
            state,
            bio,
            skills,
            avg_rating,
            total_reviews
          )
        `)
        .in("job_id", jobIds)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        setApplications(data || []);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleAccept = async (application) => {
    try {
      await supabase
        .from("job_applications")
        .update({
          status: "accepted",
        })
        .eq("id", application.id);

      await supabase
        .from("jobs")
        .update({
          status: "hired",
          hired_professional_id: application.professional_id,
        })
        .eq("id", application.job_id);

      await supabase
        .from("job_applications")
        .update({
          status: "rejected",
        })
        .eq("job_id", application.job_id)
        .neq("professional_id", application.professional_id);

      fetchApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await supabase
        .from("job_applications")
        .update({
          status: "rejected",
        })
        .eq("id", applicationId);

      fetchApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredApplications =
    selectedCategory === "all"
      ? applications
      : applications.filter(
          (app) => app.jobs?.category === selectedCategory
        );

  return (
    <div className="min-h-screen bg-[#040408] text-white">
      <ClientNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Applications
        </h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm capitalize transition ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-[#111116] text-neutral-400"
              }`}
            >
              {category.replace("_", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10">
            Loading applications...
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-[#111116] border border-white/10 rounded-xl p-6">
            No applications found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-[#111116] border border-white/10 rounded-xl p-6"
              >
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {app.profiles?.full_name}
                    </h2>

                    <p className="text-sm text-neutral-400 mt-1">
                      {app.jobs?.title}
                    </p>

                    <p className="text-sm text-neutral-500">
                      {app.profiles?.city}, {app.profiles?.state}
                    </p>

                    <div className="mt-2 text-yellow-400 text-sm">
                      ⭐ {app.profiles?.avg_rating || 0}
                      {" "}
                      ({app.profiles?.total_reviews || 0} reviews)
                    </div>
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        app.status === "accepted"
                          ? "bg-green-500/20 text-green-400"
                          : app.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {app.profiles?.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs rounded bg-indigo-500/10 text-indigo-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">
                      Category:
                    </span>{" "}
                    {app.jobs?.category}
                  </div>

                  <div>
                    <span className="text-neutral-500">
                      Budget:
                    </span>{" "}
                    ₹{app.jobs?.budget_min} - ₹
                    {app.jobs?.budget_max}
                  </div>

                  <div>
                    <span className="text-neutral-500">
                      Quote:
                    </span>{" "}
                    {app.quoted_price
                      ? `₹${app.quoted_price}`
                      : "Not Provided"}
                  </div>

                  <div>
                    <span className="text-neutral-500">
                      Applied:
                    </span>{" "}
                    {new Date(
                      app.created_at
                    ).toLocaleDateString()}
                  </div>
                </div>

                {app.cover_letter && (
                  <div className="mt-4">
                    <p className="text-neutral-500 text-sm mb-1">
                      Cover Letter
                    </p>

                    <p className="text-sm text-neutral-300">
                      {app.cover_letter}
                    </p>
                  </div>
                )}

                {app.status === "pending" && (
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => handleAccept(app)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(app.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationsPage;