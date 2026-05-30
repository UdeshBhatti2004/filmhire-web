import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import JobCard from "./cards/JobCard";
import EditJobModal from "./modals/EditModal";

const ManageJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
const [selectedJob, setSelectedJob] = useState(null);

  
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      setJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId);

    if (error) {
      alert(error.message);
      return;
    }

    setJobs((prev) => prev.filter((job) => job.id !== jobId));

    alert("Job deleted successfully");
  };

  const handleEdit = (job) => {
  setSelectedJob(job);
  setShowEditModal(true);
};

const handleDeleteClick = (job) => {
  setSelectedJob(job);
  setShowDeleteModal(true);
};


  if (loading) {
    return (
      <div className="text-white p-4">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="panel-solid rounded-lg p-3.5">
        <h1 className="text-xs font-bold text-white uppercase tracking-wide">
          My Active Jobs
        </h1>

        <p className="text-xs text-slate-500 mt-0.5">
          Monitor and manage the status of your active project requirements.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="panel-solid rounded-lg p-4 text-center text-slate-400">
          No jobs found.
        </div>
      ) : (
        jobs.map((job) => (
  <JobCard
    key={job.id}
    job={job}
    onEdit={handleEdit}
    onDelete={handleDeleteClick}
  />
))
      )}

      <EditJobModal
  isOpen={showEditModal}
  job={selectedJob}
  onClose={() => {
    setShowEditModal(false);
    setSelectedJob(null);
  }}
  onSuccess={fetchJobs}
/>
    </div>
  );
};

export default ManageJobs;