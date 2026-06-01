import { useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slice/authSlice";
import { supabase } from "../../lib/supabase";
import ClientNavbar from "../../components/client/ClientNavbar";

function CreateJob() {

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


    const user = useSelector(selectUser)

    const handleSubmit = async () => {
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
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="h-screen overflow-y-auto bg-[#030303] text-white p-6">
<ClientNavbar />

            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <p className="text-xs uppercase tracking-widest text-indigo-400 mb-2">
                        Client Workspace
                    </p>

                    <h1 className="text-4xl font-bold">Create New Job</h1>

                    <p className="text-neutral-500 mt-2">
                        Publish a project and start receiving applications from
                        professionals.
                    </p>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-8 space-y-6">
                    <div>
                        <label className="block text-sm mb-2 text-neutral-300">
                            Job Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Wedding Photography for 2 Days"
                            className="w-full h-12 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2 text-neutral-300">
                            Description
                        </label>

                        <textarea
                            rows="5"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your requirements..."
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2 text-neutral-300">
                            Category
                        </label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full h-12 bg-[#0f0f11] border border-white/[0.08] rounded-xl px-4 outline-none focus:border-indigo-500 text-white appearance-none"
                        >
                            <option value="wedding" className="bg-[#0f0f11] text-white">
                                Wedding
                            </option>

                            <option value="corporate" className="bg-[#0f0f11] text-white">
                                Corporate
                            </option>

                            <option value="event" className="bg-[#0f0f11] text-white">
                                Event
                            </option>

                            <option value="reel" className="bg-[#0f0f11] text-white">
                                Reel
                            </option>

                            <option value="real_estate" className="bg-[#0f0f11] text-white">
                                Real Estate
                            </option>

                            <option value="other" className="bg-[#0f0f11] text-white">
                                Other
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-2 text-neutral-300">
                            Location
                        </label>

                        <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-neutral-500" />

                            <input
                                type="text"
                                name="location_text"
                                value={formData.location_text}
                                onChange={handleChange}
                                placeholder="Rajkot, Gujarat"
                                className="w-full h-12 pl-12 bg-white/[0.03] border border-white/[0.08] rounded-xl outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-2 text-neutral-300">
                                Minimum Budget
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-3 text-neutral-500 font-semibold text-lg">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="budget_min"
                                    value={formData.budget_min}
                                    onChange={handleChange}
                                    placeholder="5000"
                                    className="w-full h-12 pl-10 bg-white/[0.03] border border-white/[0.08] rounded-xl outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-neutral-300">
                                Maximum Budget
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-3 text-neutral-500 font-semibold text-lg">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="budget_max"
                                    value={formData.budget_max}
                                    onChange={handleChange}
                                    placeholder="15000"
                                    className="w-full h-12 pl-10 bg-white/[0.03] border border-white/[0.08] rounded-xl outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-2 text-neutral-300">
                                Shoot Date
                            </label>

                            <div className="relative">
                                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-neutral-500" />

                                <input
                                    type="date"
                                    name="shoot_date"
                                    value={formData.shoot_date}
                                    onChange={handleChange}
                                    className="w-full h-12 pl-12 bg-white/[0.03] border border-white/[0.08] rounded-xl outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-neutral-300">
                                Duration (Hours)
                            </label>

                            <input
                                type="number"
                                name="shoot_duration_hrs"
                                value={formData.shoot_duration_hrs}
                                onChange={handleChange}
                                placeholder="8"
                                className="w-full h-12 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition-all disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Job"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateJob;