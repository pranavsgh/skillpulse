export default function SkillFilters({ filters, onChange }) {
  function handle(key, value) {
    onChange({ ...filters, [key]: value || undefined });
  }

  return (
    <div className="flex gap-3 mb-4 flex-wrap">
      <select
        value={filters.job_type || ""}
        onChange={(e) => handle("job_type", e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-pulse-600"
      >
        <option value="">All job types</option>
        <option value="new_grad">New Grad</option>
        <option value="internship">Internship</option>
      </select>

      <select
        value={filters.role_type || ""}
        onChange={(e) => handle("role_type", e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-pulse-600"
      >
        <option value="">All roles</option>
        <option value="swe">Software Engineer</option>
        <option value="fullstack">Full Stack</option>
        <option value="ml_ai">ML / AI</option>
        <option value="data">Data</option>
        <option value="devops">DevOps / Platform</option>
        <option value="security">Security</option>
        <option value="mobile">Mobile</option>
        <option value="quant">Quant</option>
      </select>

      <select
        value={filters.category || ""}
        onChange={(e) => handle("category", e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-pulse-600"
      >
        <option value="">All categories</option>
        <option value="language">Language</option>
        <option value="framework">Framework</option>
        <option value="tool">Tool</option>
      </select>
    </div>
  );
}