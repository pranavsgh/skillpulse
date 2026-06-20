import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const RANGE_OPTIONS = [
  { label: "Past Month", days: 30 },
  { label: "Past 3 Months", days: 90 },
  { label: "Past 6 Months", days: 180 },
  { label: "Past Year", days: 365 },
];

const SERIES_COLORS = {
  new_grad: "#0A66C2",
  internship: "#0ea5e9",
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded shadow px-3 py-2 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{formatDate(label)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: SERIES_COLORS[p.dataKey] }}>
          {p.dataKey === "new_grad" ? "New Grad" : "Internship"}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function JobsOverTimeChart({ data = [] }) {
  const [rangeDays, setRangeDays] = useState(90);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - rangeDays);
  const recent = data.filter((d) => new Date(d.date) >= cutoff);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Job Postings Over Time</h3>
        <div className="flex items-center gap-4">
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: SERIES_COLORS.new_grad }} />
              New Grad
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: SERIES_COLORS.internship }} />
              Internship
            </span>
          </div>
          <select
            value={rangeDays}
            onChange={(e) => setRangeDays(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-pulse-600"
          >
            {RANGE_OPTIONS.map((opt) => (
              <option key={opt.days} value={opt.days}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">No job posting data in this range.</p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={recent} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11 }}
                minTickGap={30}
              />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="new_grad"
                stackId="1"
                stroke={SERIES_COLORS.new_grad}
                fill={SERIES_COLORS.new_grad}
                fillOpacity={0.25}
              />
              <Area
                type="monotone"
                dataKey="internship"
                stackId="1"
                stroke={SERIES_COLORS.internship}
                fill={SERIES_COLORS.internship}
                fillOpacity={0.25}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
