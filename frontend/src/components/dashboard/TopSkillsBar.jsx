const CATEGORY_COLORS = {
  language: { bg: "bg-pulse-100", bar: "bg-pulse-600", badge: "bg-pulse-100 text-pulse-700" },
  framework: { bg: "bg-sky-100", bar: "bg-sky-500", badge: "bg-sky-100 text-sky-700" },
  tool: { bg: "bg-emerald-100", bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
};

export default function TopSkillsBar({ skills = [], onSkillClick }) {
  if (!skills.length) return null;
  const max = skills[0]?.count || 1;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Skill Rankings</h3>
      <div className="space-y-3">
        {skills.map((s, i) => {
          const colors = CATEGORY_COLORS[s.category] || CATEGORY_COLORS.language;
          return (
            <div
              key={`${s.name}-${i}`}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 -mx-2 transition-all"
              onClick={() => onSkillClick?.(s)}
            >
              <span className="text-xs font-bold text-gray-400 w-5 text-right">{i + 1}</span>
              <span className="w-28 text-sm font-medium text-gray-700 truncate">{s.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                {s.category}
              </span>
              <div className={`flex-1 ${colors.bg} h-2.5 rounded-full overflow-hidden`}>
                <div
                  className={`${colors.bar} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${(s.count / max) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">{s.count}</span>
              <span className="text-gray-300 text-xs">›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}