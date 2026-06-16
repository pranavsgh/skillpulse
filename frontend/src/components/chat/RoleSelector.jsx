export default function RoleSelector({ targetRole, onChange }) {
  // Todo Mutha: target role dropdown (e.g. frontend, backend, ml, data)
  return (
    <select
      value={targetRole}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-2 py-1 mb-3"
    >
      <option value="">Any role</option>
      <option value="frontend">Frontend</option>
      <option value="backend">Backend</option>
      <option value="ml">Machine Learning</option>
      <option value="data">Data</option>
    </select>
  );
}
