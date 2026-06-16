import { useState } from "react";
import useSkills from "../hooks/useSkills.js";
import SkillChart from "../components/dashboard/SkillChart.jsx";
import SkillFilters from "../components/dashboard/SkillFilters.jsx";
import TopSkillsBar from "../components/dashboard/TopSkillsBar.jsx";
import Loading from "../components/shared/Loading.jsx";

export default function Dashboard() {
  const [filters, setFilters] = useState({});
  const { skills, loading, error } = useSkills(filters);

  if (loading) return <Loading />;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-pulse-900 mb-4">Skills Dashboard</h1>
      <SkillFilters filters={filters} onChange={setFilters} />
      {error && <p className="text-red-500">{error}</p>}
      <SkillChart skills={skills} />
      <TopSkillsBar skills={skills} />
    </div>
  );
}
