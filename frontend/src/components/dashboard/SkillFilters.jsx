export default function SkillFilters({ filters, onChange }) {
  // Todo Pranav: job type + category dropdowns wired to onChange(filters)
  return (
    <div className="flex gap-3 mb-4">
      <select className="border rounded px-2 py-1">
        <option value="">All job types</option>
        <option value="new_grad">New Grad</option>
        <option value="internship">Internship</option>
      </select>
      <select className="border rounded px-2 py-1">
        <option value="">All categories</option>
        <option value="language">Language</option>
        <option value="framework">Framework</option>
        <option value="tool">Tool</option>
      </select>
    </div>
  );
}
