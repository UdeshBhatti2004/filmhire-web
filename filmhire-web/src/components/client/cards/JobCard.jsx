const JobCard = ({ job, onEdit, onDelete }) => {
  return (
    <div className="panel-solid rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {job.title}
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            {job.category}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(job)}>
            ✏️
          </button>

          <button onClick={() => onDelete(job)}>
            🗑️
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        {job.description}
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p>Location</p>
          <p>{job.location_text}</p>
        </div>

        <div>
          <p>Budget</p>
          <p>
            ₹{job.budget_min} - ₹{job.budget_max}
          </p>
        </div>

        <div>
          <p>Duration</p>
          <p>{job.shoot_duration_hrs} hrs</p>
        </div>

        <div>
          <p>Shoot Date</p>
          <p>{job.shoot_date}</p>
        </div>

        <div className="col-span-2">
          <p>Hired Professional</p>
          <p>
            {job.hired_professional_id || "Not Assigned"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobCard