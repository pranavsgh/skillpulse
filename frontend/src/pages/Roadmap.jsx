import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchRoadmap } from "../utils/api.js";

function TimelineSection({ text }) {
  const formatted = text
    .replace(/^#### (.+)$/gm, "<p style='font-size:0.75rem;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-top:1rem;margin-bottom:0.25rem'>$1</p>")
    .replace(/^### (.+)$/gm, "<p style='font-size:0.875rem;font-weight:700;color:#374151;margin-top:0.75rem;margin-bottom:0.25rem'>$1</p>")
    .replace(/^## (.+)$/gm, "<p style='font-size:1rem;font-weight:800;color:#111827;margin-top:0.75rem;margin-bottom:0.25rem'>$1</p>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- \[ \] (.+)$/gm, "<div style='display:flex;gap:0.5rem;margin:0.3rem 0;padding-left:0.5rem;align-items:flex-start'><span style='color:#6366f1;font-size:1rem;margin-top:-1px'>☐</span><span>$1</span></div>")
    .replace(/^- \[x\] (.+)$/gm, "<div style='display:flex;gap:0.5rem;margin:0.3rem 0;padding-left:0.5rem;align-items:flex-start'><span style='color:#10b981;font-size:1rem;margin-top:-1px'>☑</span><span style='text-decoration:line-through;color:#9ca3af'>$1</span></div>")
    .replace(/^- (.+)$/gm, "<div style='display:flex;gap:0.5rem;margin:0.2rem 0;padding-left:0.5rem'><span style='color:#6366f1'>•</span><span>$1</span></div>")
    .replace(/\n{2,}/g, "<div style='margin-top:0.4rem'></div>")
    .replace(/\n/g, " ");

  return (
    <div
      className="text-sm text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
}

const WEEK_COLORS = [
  { bg: "bg-indigo-50", border: "border-indigo-200", dot: "bg-indigo-500", line: "bg-indigo-200" },
  { bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500", line: "bg-blue-200" },
  { bg: "bg-sky-50", border: "border-sky-200", dot: "bg-sky-500", line: "bg-sky-200" },
  { bg: "bg-violet-50", border: "border-violet-200", dot: "bg-violet-500", line: "bg-violet-200" },
  { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", line: "bg-emerald-200" },
  { bg: "bg-teal-50", border: "border-teal-200", dot: "bg-teal-500", line: "bg-teal-200" },
];

export default function Roadmap() {
  const { user } = useUser();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [roadmap, setRoadmap] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    if (!projectId) {
      setLoading(false);
      return;
    }

    // Use roadmap passed via navigation state (just generated)
    if (location.state?.roadmap) {
      setRoadmap(location.state.roadmap);
      setTitle(location.state.title);
      setLoading(false);
      return;
    }

    // Otherwise fetch from DB
    fetchRoadmap(parseInt(projectId), user.id)
      .then((data) => {
        if (data.roadmap) {
          setRoadmap(data.roadmap);
          setTitle(data.title);
        } else {
          setError("Roadmap not generated yet. Go back and click 'View My Roadmap'.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load roadmap.");
        setLoading(false);
      });
  }, [user, projectId, location.state]);

  if (!loading && !projectId) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-6">🗺️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">No Roadmap Yet</h1>
        <p className="text-gray-500 mb-2">Your personalized roadmap is generated when you start a project.</p>
        <p className="text-gray-400 text-sm mb-8">
          Go to the Project Advisor, get a project suggestion, and click "Start this project" to unlock your roadmap.
        </p>
        <button
          onClick={() => navigate("/chat")}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all"
        >
          Go to Project Advisor
        </button>
      </div>
    );
  }

  const weeks = roadmap ? roadmap.split(/(?=\*\*Week \d)/).filter((s) => s.trim()) : [];
  const mainWeeks = weeks.filter((w) => w.match(/\*\*Week/));
  const extras = weeks.filter((w) => !w.match(/\*\*Week/));

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <button
          onClick={() => navigate("/chat")}
          className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
        >
          ← Back to Project Advisor
        </button>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Project Roadmap</p>
            <h1 className="text-2xl font-bold text-gray-900">{title || "Your Project"}</h1>
            <p className="text-gray-500 text-sm mt-1">Week-by-week timeline to complete your project</p>
          </div>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mt-1">12 Weeks</span>
        </div>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4 animate-pulse">🗺️</div>
          <p className="text-gray-500">Loading your roadmap...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => navigate("/chat")} className="text-sm text-indigo-600 hover:underline">
            Go back to Project Advisor
          </button>
        </div>
      )}

      {roadmap && !loading && (
        <div className="space-y-0">
          {mainWeeks.map((section, i) => {
            const color = WEEK_COLORS[i % WEEK_COLORS.length];
            const isLast = i === mainWeeks.length - 1;
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${color.dot} flex-shrink-0 mt-6 z-10 shadow-sm`} />
                  {!isLast && <div className={`w-0.5 flex-1 ${color.line} mt-1`} />}
                </div>
                <div className={`flex-1 ${color.bg} border ${color.border} rounded-2xl p-5 mb-4`}>
                  <TimelineSection text={section} />
                </div>
              </div>
            );
          })}

          {extras.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {extras.map((section, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <TimelineSection text={section} />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={() => navigate("/profile")} className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50">
              View All Projects
            </button>
            <button onClick={() => navigate("/chat")} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-indigo-700">
              Back to Project Advisor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}