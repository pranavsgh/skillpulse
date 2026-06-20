import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedSkills, unsaveSkill, fetchProjects, completeProject } from "../utils/api.js";

const ROLES = ["Backend", "Frontend", "Full Stack", "ML/AI", "Data Science", "Cybersecurity", "Mobile"];
const LANGUAGES = ["Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "SQL", "R"];
const COMPANIES = ["Big Tech", "Startup", "Fintech", "Any"];
const LEVELS = ["Beginner", "Some experience", "Comfortable"];

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(false);
  const [savedSkills, setSavedSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!user) return;
    const key = `skillpulse-user-prefs-${user.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const p = JSON.parse(stored);
      setPrefs(p);
      setDraft(p);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getSavedSkills(user.id).then(setSavedSkills).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchProjects(user.id).then(setProjects).catch(() => {});
  }, [user]);

  async function handleUnsave(skillName) {
    await unsaveSkill(user.id, skillName);
    setSavedSkills((prev) => prev.filter((s) => s.skill_name !== skillName));
  }

  async function handleCompleteProject(projectId) {
    await completeProject(user.id, projectId);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, status: "completed", completed_at: new Date().toISOString() } : p
      )
    );
  }

  function toggleLanguage(lang) {
    setDraft((prev) => ({
      ...prev,
      languages: prev.languages?.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...(prev.languages || []), lang],
    }));
  }

  function handleSave() {
    const key = `skillpulse-user-prefs-${user.id}`;
    localStorage.setItem(key, JSON.stringify(draft));
    setPrefs(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <img src={user?.imageUrl} alt="avatar" className="w-16 h-16 rounded-full border border-gray-200" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.fullName}</h1>
          <p className="text-gray-500 text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Member since {new Date(user?.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-800">Career Preferences</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="text-sm text-pulse-600 border border-pulse-200 px-3 py-1 rounded-full hover:bg-pulse-50">
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setDraft(prefs); }} className="text-sm text-gray-500 border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} className="text-sm text-white bg-pulse-600 px-3 py-1 rounded-full hover:bg-pulse-800">
                Save
              </button>
            </div>
          )}
        </div>

        {saved && <p className="text-emerald-600 text-sm mb-4">Preferences saved!</p>}

        {!prefs && !editing ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm mb-3">No preferences set yet.</p>
            <button onClick={() => navigate("/chat")} className="bg-pulse-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pulse-800">
              Take the quiz
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Target Role</p>
              {editing ? (
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button key={r} onClick={() => setDraft((p) => ({ ...p, role: r }))}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${draft?.role === r ? "bg-pulse-600 text-white border-pulse-600" : "bg-white text-gray-700 border-gray-200 hover:border-pulse-400"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="bg-pulse-100 text-pulse-700 text-sm px-3 py-1 rounded-full">{prefs?.role || "—"}</span>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Experience Level</p>
              {editing ? (
                <div className="flex flex-col gap-2">
                  {LEVELS.map((l) => (
                    <button key={l} onClick={() => setDraft((p) => ({ ...p, level: l }))}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium text-left transition-all ${draft?.level === l ? "bg-pulse-600 text-white border-pulse-600" : "bg-white text-gray-700 border-gray-200 hover:border-pulse-400"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="bg-sky-100 text-sky-700 text-sm px-3 py-1 rounded-full">{prefs?.level || "—"}</span>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Known Languages</p>
              {editing ? (
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button key={lang} onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${draft?.languages?.includes(lang) ? "bg-pulse-600 text-white border-pulse-600" : "bg-white text-gray-700 border-gray-200 hover:border-pulse-400"}`}>
                      {lang}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {prefs?.languages?.length ? prefs.languages.map((l) => (
                    <span key={l} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{l}</span>
                  )) : <span className="text-gray-400 text-sm">—</span>}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Target Company</p>
              {editing ? (
                <div className="grid grid-cols-2 gap-2">
                  {COMPANIES.map((c) => (
                    <button key={c} onClick={() => setDraft((p) => ({ ...p, company: c }))}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${draft?.company === c ? "bg-pulse-600 text-white border-pulse-600" : "bg-white text-gray-700 border-gray-200 hover:border-pulse-400"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full">{prefs?.company || "—"}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Saved Skills</h2>
        {savedSkills.length === 0 ? (
          <p className="text-sm text-gray-400">No saved skills yet. Star skills on the dashboard to save them.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {savedSkills.map((s) => (
              <div key={s.skill_name} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                <span className="text-sm text-gray-700">{s.skill_name}</span>
                <button onClick={() => handleUnsave(s.skill_name)} className="text-gray-400 hover:text-red-400 text-xs ml-1">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">My Projects</h2>
        {projects.length === 0 ? (
          <p className="text-sm text-gray-400">
            No projects started yet. Pick one from the Project Advisor chat.
          </p>
        ) : (
          <div className="space-y-3">
            {projects
              .filter((p) => p.status === "pending")
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 bg-pulse-50 border border-pulse-100 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Started {new Date(p.started_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCompleteProject(p.id)}
                    className="text-xs text-white bg-pulse-600 px-3 py-1.5 rounded-full hover:bg-pulse-800 flex-shrink-0"
                  >
                    Mark as finished
                  </button>
                </div>
              ))}
            {projects.filter((p) => p.status === "completed").length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Completed
                </p>
                <div className="space-y-1.5">
                  {projects
                    .filter((p) => p.status === "completed")
                    .map((p) => (
                      <div key={p.id} className="flex items-center gap-2 px-1">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <span className="text-sm text-gray-500 line-through">{p.title}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Quick Links</h2>
        <div className="space-y-2">
          <button onClick={() => navigate("/dashboard")} className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-pulse-50 text-sm text-gray-700 hover:text-pulse-700 transition-all">
            → View Skills Dashboard
          </button>
          <button onClick={() => navigate("/chat")} className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-pulse-50 text-sm text-gray-700 hover:text-pulse-700 transition-all">
            → Go to Project Advisor
          </button>
        </div>
      </div>
    </div>
  );
}