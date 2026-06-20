import { useState, useEffect } from "react";
import { fetchCompanies } from "../utils/api.js";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COMPANY_COLORS = {
  "Apple": "#555555",
  "Microsoft": "#00a4ef",
  "Google": "#4285f4",
  "Amazon": "#ff9900",
  "Meta": "#0082fb",
  "Netflix": "#e50914",
  "Tesla": "#cc0000",
  "SpaceX": "#005288",
  "Nvidia": "#76b900",
  "Intel": "#0071c5",
  "Stripe": "#635bff",
  "Ramp": "#f3b01c",
  "Brex": "#fb3640",
  "Plaid": "#00c4a0",
  "Robinhood": "#00c805",
  "Coinbase": "#0052ff",
  "Cloudflare": "#f48120",
  "Datadog": "#632ca6",
  "MongoDB": "#00ed64",
  "Databricks": "#ff3621",
  "Snowflake": "#29b5e8",
  "Elastic": "#f04e98",
  "Confluent": "#0097a7",
  "HashiCorp": "#000000",
  "Vercel": "#000000",
  "Railway": "#7000ff",
  "Supabase": "#3ecf8e",
  "TikTok": "#010101",
  "ByteDance": "#161823",
  "Airbnb": "#ff5a5f",
  "Notion": "#000000",
  "Figma": "#f24e1e",
  "Airtable": "#fcb400",
  "Linear": "#5e6ad2",
  "Nokia": "#124191",
  "Innodata": "#e31837",
  "Anthropic": "#d4a96a",
  "OpenAI": "#412991",
  "Gusto": "#f45d48",
  "Rippling": "#ff4500",
  "Lattice": "#6c4de6",
  "Asana": "#f06a6a",
  "Retool": "#3d63dd",
  "Webflow": "#4353ff",
};

const FALLBACK_COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6",
  "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#3b82f6",
];

function getCompanyColor(name, index) {
  return COMPANY_COLORS[name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

const MEDALS = ["🥇", "🥈", "🥉"];
const SKILL_LABELS = ["python", "java", "javascript", "linux", "go", "sql", "typescript", "c++", "react", "mongodb"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].sort((a, b) => b.value - a.value).filter(p => p.value > 0);
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[180px]">
      <p className="font-bold text-gray-800 mb-2 capitalize">{label}</p>
      {sorted.length === 0 ? (
        <p className="text-gray-400 text-xs">No mentions</p>
      ) : sorted.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-gray-600 text-xs">{p.dataKey}</span>
          </div>
          <span className="font-bold text-xs" style={{ color: p.color }}>{p.value} jobs</span>
        </div>
      ))}
    </div>
  );
}

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobType, setJobType] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchCompanies({ limit: 30, job_type: jobType || undefined })
      .then((data) => {
        setCompanies(data);
        setSelected(data.slice(0, 5).map((c) => c.company));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobType]);

  const filtered = companies.filter((c) =>
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  const top10 = companies.slice(0, 10);
  const top3 = companies.slice(0, 3);
  const visibleCompanies = top10.filter((c) => selected.includes(c.company));

  const lineData = SKILL_LABELS.map((skill) => ({
    label: skill,
    ...Object.fromEntries(
      visibleCompanies.map((c) => [c.company, c.skill_breakdown?.[skill] || 0])
    ),
  }));

  function toggleCompany(name) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Leaderboard</h1>
          <p className="text-gray-500 mt-1">Which companies are hiring the most CS talent right now</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
          />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
          >
            <option value="">All types</option>
            <option value="new_grad">New Grad</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="text-gray-400 text-sm animate-pulse">Loading leaderboard...</div>
        </div>
      ) : (
        <>
          {/* Top 3 podium cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {top3.map((c, i) => (
              <div
                key={c.company}
                className="relative rounded-2xl p-5 text-white overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${getCompanyColor(c.company, i)}ee, ${getCompanyColor(c.company, i)}99)`,
                  boxShadow: `0 8px 24px ${getCompanyColor(c.company, i)}40`,
                }}
              >
                <span className="text-4xl absolute top-4 right-4 opacity-20 font-black">#{i + 1}</span>
                <div className="text-2xl mb-2">{MEDALS[i]}</div>
                <h3 className="text-xl font-bold">{c.company}</h3>
                <p className="text-white/70 text-sm mt-1">{c.total} total jobs</p>
                <div className="flex gap-3 mt-3 text-xs text-white/80">
                  <span>{c.new_grad} new grad</span>
                  <span>·</span>
                  <span>{c.internship} intern</span>
                </div>
                {c.top_skills.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-3">
                    {c.top_skills.map((s) => (
                      <span key={s} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Skill DNA chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Skill DNA</h2>
                <p className="text-xs text-gray-400 mt-0.5">How many jobs each company posts per skill — toggle to compare</p>
              </div>
            </div>

            {/* Company toggle chips */}
            <div className="flex flex-wrap gap-2 mb-5 mt-3">
              {top10.map((c, i) => (
                <button
                  key={c.company}
                  onClick={() => toggleCompany(c.company)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                    selected.includes(c.company)
                      ? "text-white border-transparent shadow-sm"
                      : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                  }`}
                  style={selected.includes(c.company) ? {
                    backgroundColor: getCompanyColor(c.company, i),
                    borderColor: getCompanyColor(c.company, i),
                  } : {}}
                >
                  {c.company}
                </button>
              ))}
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: "Job mentions", angle: -90, position: "insideLeft", fontSize: 10, fill: "#9ca3af", dy: 40 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {visibleCompanies.map((c) => {
                    const idx = top10.indexOf(c);
                    const color = getCompanyColor(c.company, idx);
                    return (
                      <Line
                        key={c.company}
                        type="monotone"
                        dataKey={c.company}
                        stroke={color}
                        strokeWidth={2.5}
                        dot={{ r: 4, strokeWidth: 2, fill: "white", stroke: color }}
                        activeDot={{ r: 7, strokeWidth: 0, fill: color }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Insight callout */}
            {visibleCompanies.length > 0 && (
              <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-500">
                💡 <strong className="text-gray-700">Tip:</strong> Spikes show what a company heavily prioritizes.
                Flat lines mean they hire generalists. Compare Stripe vs Tesla to see the difference.
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Full Rankings</h2>
              <span className="text-xs text-gray-400">{filtered.length} companies</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">New Grad</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Intern</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Top Skills</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const color = getCompanyColor(c.company, i);
                  return (
                    <tr key={c.company} className="border-t border-gray-50 hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-base">
                        {i < 3 ? MEDALS[i] : <span className="text-gray-400 text-sm font-bold">{i + 1}</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="font-bold text-gray-800">{c.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: color }}>
                          {c.total}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{c.new_grad}</td>
                      <td className="px-6 py-4 text-gray-500">{c.internship}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {c.top_skills.map((s) => (
                            <span
                              key={s}
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: `${color}18`, color }}
                            >
                              {s}
                            </span>
                          ))}
                          {c.top_skills.length === 0 && <span className="text-gray-300 text-xs">—</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}