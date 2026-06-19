import { X, Check } from "lucide-react";
import { getSkillMeta, DIFFICULTY_STYLES } from "../../data/skillMeta.js";

export default function SkillDetailPanel({ skill, onClose }) {
  if (!skill) return null;
  const meta = getSkillMeta(skill.name);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="bg-pulse-600 text-white px-6 py-5">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_STYLES[meta.difficulty]}`}>
              {meta.difficulty}
            </span>
            <button onClick={onClose} className="text-white/70 hover:text-white leading-none">
              <X size={20} />
            </button>
          </div>
          <h2 className="text-2xl font-bold capitalize">{skill.name}</h2>
          <p className="text-white/75 text-sm mt-1">{meta.blurb}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
            <span className="bg-white/20 px-2 py-0.5 rounded-full capitalize">{skill.category}</span>
            <span>{skill.count} job postings</span>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Difficulty</p>
            <div className="flex gap-2">
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <div
                  key={level}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold text-center transition-all ${
                    meta.difficulty === level ? DIFFICULTY_STYLES[level] : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {level}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">What you need to know first</p>
            <ul className="space-y-2">
              {meta.prerequisites.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check size={14} className="text-pulse-400 mt-0.5 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Practice projects</p>
            <ul className="space-y-2">
              {meta.practice.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="bg-pulse-100 text-pulse-700 font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs">
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Free learning resources</p>
            <div className="space-y-2">
              {meta.resources.map((r, i) => (
                <div
                  key={i}
                  onClick={() => window.open(r.url, "_blank")}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-pulse-50 border border-gray-100 hover:border-pulse-200 rounded-lg text-sm text-gray-700 hover:text-pulse-700 transition-all group cursor-pointer"
                >
                  <span>{r.label}</span>
                  <span className="text-gray-400 group-hover:text-pulse-500">→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}