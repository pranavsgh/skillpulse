import { useState } from "react";
import useSkills from "../hooks/useSkills.js";
import SkillChart from "../components/dashboard/SkillChart.jsx";
import SkillFilters from "../components/dashboard/SkillFilters.jsx";
import TopSkillsBar from "../components/dashboard/TopSkillsBar.jsx";
import Loading from "../components/shared/Loading.jsx";
import { triggerScrape } from "../utils/api.js";

export default function Dashboard() {
  const [filters, setFilters] = useState({});
  const { skills, loading, error } = useSkills(filters);
  const [scraping, setScraping] = useState(false);
  const [scrapeMsg, setScrapeMsg] = useState("");

  async function handleScrape() {
    setScraping(true);
    setScrapeMsg("");
    try {
      await triggerScrape();
      setScrapeMsg("Scrape started! New jobs will appear shortly.");
    } catch {
      setScrapeMsg("Failed to start scrape.");
    } finally {
      setScraping(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-pulse-900">Skills Dashboard</h1>
        <button
          onClick={handleScrape}
          disabled={scraping}
          className="bg-pulse-600 text-white px-4 py-2 rounded text-sm hover:bg-pulse-800 disabled:opacity-50"
        >
          {scraping ? "Scraping..." : "🔄 Refresh Data"}
        </button>
      </div>
      {scrapeMsg && <p className="text-sm text-pulse-600 mb-3">{scrapeMsg}</p>}
      <SkillFilters filters={filters} onChange={setFilters} />
      {error && <p className="text-red-500">{error}</p>}
      <SkillChart skills={skills} />
      <TopSkillsBar skills={skills} />
    </div>
  );
}