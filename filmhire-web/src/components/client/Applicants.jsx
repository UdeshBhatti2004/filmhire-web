// src/components/client/views/Applicants.jsx

import {
  CheckCircle2,
  MessageSquare,
  XCircle,
} from "lucide-react";

const Applicants = ({
  applicants,
  handleDirectRouteToChat,
}) => {
  return (
    <div className="space-y-3">
      <div className="panel-solid rounded-lg p-3.5">
        <h1 className="text-xs font-bold text-white uppercase tracking-wide">
          Review Job Applicants
        </h1>

        <p className="text-xs text-slate-500 mt-0.5">
          Review, accept, or reject candidates who applied to your open
          listings.
        </p>
      </div>

      <div className="panel-solid rounded-lg overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-premium text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Target Job</th>
                <th className="p-3">Match Score</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.03]">
              {applicants.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-white/[0.01]"
                >
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={app.avatar}
                      className="w-6 h-6 rounded object-cover border border-premium"
                      alt=""
                    />

                    <div>
                      <div className="font-bold text-white text-xs">
                        {app.name}
                      </div>

                      <div className="text-[10px] text-slate-500">
                        {app.role}
                      </div>
                    </div>
                  </td>

                  <td className="p-3 text-slate-400 text-xs">
                    {app.jobTitle}
                  </td>

                  <td className="p-3 font-bold text-cyan-400 text-xs">
                    {app.matchScore}
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() =>
                          handleDirectRouteToChat(
                            app.name,
                            app.avatar
                          )
                        }
                        className="bg-white/5 hover:bg-white/10 px-2 py-0.5 text-[11px] rounded transition-all border border-premium"
                      >
                        <MessageSquare className="w-3 h-3 inline mr-1" />
                        Message
                      </button>

                      <button className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      <button className="p-1 text-slate-600 hover:text-slate-300 rounded">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Applicants;