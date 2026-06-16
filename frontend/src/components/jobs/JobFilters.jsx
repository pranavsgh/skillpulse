export default function JobFilters({ filters, onChange }) {
  // Todo Pranav: source + type filters, search input, wired to onChange(filters)
  return (
    <div className="flex gap-3 mb-4">
      <input
        type="text"
        placeholder="Search jobs..."
        className="border rounded px-2 py-1 flex-1"
      />
      <select className="border rounded px-2 py-1">
        <option value="">All sources</option>
        <option value="simplify">Simplify</option>
        <option value="indeed">Indeed</option>
        <option value="linkedin">LinkedIn</option>
      </select>
    </div>
  );
}
