// src/components/client/views/CreateJob.jsx

import { useState } from "react";
import { useSelector } from "react-redux";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { selectUser } from "../../store/slice/authSlice"; // Adjust this import path if needed

const CreateJob = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "wedding",
        location_text: "",
        budget_min: "",
        budget_max: "",
        shoot_date: "",
        shoot_duration_hrs: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const user = useSelector(selectUser);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload if wrapped in a form wrapper
        if (!user?.id) {
            alert("User context not identified.");
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase
                .from("jobs")
                .insert({
                    client_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    location_text: formData.location_text,
                    lat: 0,
                    lng: 0,
                    budget_min: Number(formData.budget_min),
                    budget_max: Number(formData.budget_max),
                    shoot_date: formData.shoot_date,
                    shoot_duration_hrs: Number(formData.shoot_duration_hrs),
                });

            if (error) {
                alert(error.message);
                return;
            }

            alert("Job created successfully!");
            // Reset state
            setFormData({
                title: "",
                description: "",
                category: "wedding",
                location_text: "",
                budget_min: "",
                budget_max: "",
                shoot_date: "",
                shoot_duration_hrs: "",
            });
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel-solid rounded-lg p-4 space-y-4">
            <div className="border-b border-premium pb-3">
                <h1 className="text-xs font-bold text-white uppercase tracking-wide">
                    Post a New Job Listing
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                    Fill out your project specifications to broadcast to available talent.
                </p>
            </div>

            <div className="space-y-3.5 pt-1">
                {/* Row 1: Title & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">
                            Job Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Lead Cinematographer"
                            className="w-full h-8 px-2.5 text-xs input-solid rounded text-slate-200"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full h-8 px-2 text-xs input-solid rounded text-slate-300 bg-[#06060A]"
                        >
                            <option value="wedding">Wedding</option>
                            <option value="commercial">Commercial</option>
                            <option value="fashion">Fashion</option>
                            <option value="event">Event</option>
                            <option value="editorial">Editorial</option>
                        </select>
                    </div>
                </div>

                {/* Row 2: Budget Boundaries */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">
                            Min Budget ($)
                        </label>
                        <input
                            type="number"
                            name="budget_min"
                            value={formData.budget_min}
                            onChange={handleChange}
                            placeholder="e.g., 1500"
                            className="w-full h-8 px-2.5 text-xs input-solid rounded text-slate-200"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">
                            Max Budget ($)
                        </label>
                        <input
                            type="number"
                            name="budget_max"
                            value={formData.budget_max}
                            onChange={handleChange}
                            placeholder="e.g., 3000"
                            className="w-full h-8 px-2.5 text-xs input-solid rounded text-slate-200"
                        />
                    </div>
                </div>

                {/* Row 3: Shoot Date & Duration */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">
                            Shoot Date
                        </label>
                        <input
                            type="date"
                            name="shoot_date"
                            value={formData.shoot_date}
                            onChange={handleChange}
                            className="w-full h-8 px-2.5 text-xs input-solid rounded text-slate-300 color-scheme-dark"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-medium">
                            Duration (Hours)
                        </label>
                        <input
                            type="number"
                            name="shoot_duration_hrs"
                            value={formData.shoot_duration_hrs}
                            onChange={handleChange}
                            placeholder="e.g., 6"
                            className="w-full h-8 px-2.5 text-xs input-solid rounded text-slate-200"
                        />
                    </div>
                </div>

                {/* Row 4: Location Text */}
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">
                        Location / Venue Details
                    </label>
                    <input
                        type="text"
                        name="location_text"
                        value={formData.location_text}
                        onChange={handleChange}
                        placeholder="e.g., Downtown Studio, Los Angeles, CA"
                        className="w-full h-8 px-2.5 text-xs input-solid rounded text-slate-200"
                    />
                </div>

                {/* Row 5: Description Area */}
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">
                        Job Description & Milestones
                    </label>
                    <textarea
                        rows={5}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the responsibilities, project scope, and overall design expectations..."
                        className="w-full p-3 text-xs input-solid rounded resize-none leading-relaxed text-slate-200"
                        required
                    />
                </div>

                {/* Action Submissions Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="h-8 w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-xs rounded transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Publishing Sync Matrix...
                        </>
                    ) : (
                        <>
                            Publish Job Posting
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CreateJob;