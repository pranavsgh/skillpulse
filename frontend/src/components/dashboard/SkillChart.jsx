import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SkillChart({ skills = [] }) {
  // Todo Pranav: render Recharts bar/pie chart of skills [{name, category, count}]
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={skills}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#534AB7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
