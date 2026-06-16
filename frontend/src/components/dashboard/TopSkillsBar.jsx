export default function TopSkillsBar({ skills = [] }) {
  // Todo Pranav: horizontal bar ranking of top skills by count
  return (
    <ul className="space-y-2">
      {skills.map((s) => (
        <li key={s.name} className="flex items-center gap-2">
          <span className="w-32 text-sm">{s.name}</span>
          <div className="flex-1 bg-pulse-100 h-3 rounded">
            <div className="bg-pulse-600 h-3 rounded" style={{ width: `${s.count}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
