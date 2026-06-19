export default function RoleSelector({ targetRole, onChange }) {
  // Todo Mutha: target role dropdown (e.g. frontend, backend, ml, data)
  return (
    <select
      value={targetRole}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white shadow-sm mb-3 focus:outline-none focus:ring-1 focus:ring-pulse-600"
    >
      <option value="">Any role</option>
      <option value="frontend">Frontend</option>
      <option value="backend">Backend</option>
      <option value="ml">Machine Learning</option>
      <option value="data">Data</option>
    </select>
  );
}
