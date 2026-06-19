import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CATEGORY_COLORS = {
  language: "#0A66C2",
  framework: "#0ea5e9",
  tool: "#10b981",
};

const CATEGORY_LABELS = {
  language: "Language",
  framework: "Framework",
  tool: "Tool",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded shadow px-3 py-2 text-sm">
      <p className="font-semibold text-gray-800">{d.name}</p>
      <p style={{ color: CATEGORY_COLORS[d.category] }}>{CATEGORY_LABELS[d.category]}</p>
      <p className="text-gray-600">{d.count} job postings</p>
    </div>
  );
}

export default function SkillChart({ skills = [] }) {
  const top = skills.slice(0, 15);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Top Skills by Job Postings</h3>
        <div className="flex gap-3 text-xs">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <span key={cat} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top} margin={{ top: 4, right: 8, left: 0, bottom: 24 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {top.map((s, i) => (
                <Cell key={i} fill={CATEGORY_COLORS[s.category] || "#0A66C2"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}