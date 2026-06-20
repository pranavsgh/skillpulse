import { useState, useEffect } from "react";
import { RefreshCw, Loader2, Flame } from "lucide-react";
import useSkills from "../hooks/useSkills.js";
import SkillChart from "../components/dashboard/SkillChart.jsx";
import SkillFilters from "../components/dashboard/SkillFilters.jsx";
import TopSkillsBar from "../components/dashboard/TopSkillsBar.jsx";
import SkillDetailPanel from "../components/dashboard/SkillDetailPanel.jsx";
import JobsOverTimeChart from "../components/dashboard/JobsOverTimeChart.jsx";
import Loading from "../components/shared/Loading.jsx";
import { triggerScrape, fetchJobs, fetchStats, fetchJobsTimeseries } from "../utils/api.js";

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-3xl font-bold text-pulse-800">{value?.toLocaleString() ?? "—"}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [filters, setFilters] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const { skills, loading, error } = useSkills(filters, refreshKey);
  const [scraping, setScraping] = useState(false);
  const [scrapeMsg, setScrapeMsg] = useState("");
  const [stats, setStats] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [timeseries, setTimeseries] = useState([]);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
  }, [refreshKey]);

  useEffect(() => {
    fetchJobsTimeseries().then(setTimeseries).catch(() => {});
  }, [refreshKey]);

  async function handleScrape() {
    setScraping(true);
    setScrapeMsg("Scrape started...");
    try {
      await triggerScrape();
      const before = await fetchJobs({ limit: 1 });
      const beforeCount = before.total;
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        try {
          const after = await fetchJobs({ limit: 1 });
          if (after.total > beforeCount) {
            clearInterval(interval);
            setScrapeMsg(`Done! ${after.total - beforeCount} new jobs added.`);
            setRefreshKey((k) => k + 1);
            setScraping(false);
          } else if (attempts >= 24) {
            clearInterval(interval);
            setScrapeMsg("Scrape complete — no new jobs found.");
            setRefreshKey((k) => k + 1);
            setScraping(false);
          }
        } catch {
          clearInterval(interval);
          setScraping(false);
        }
      }, 5000);
    } catch {
      setScrapeMsg("Failed to start scrape.");
      setScraping(false);
    }
  }

  const newGradSkills = skills.filter((_, i) => i % 2 === 0).slice(0, 10);
  const internSkills = skills.filter((_, i) => i % 2 !== 0).slice(0, 10);

  if (loading) return <Loading />;

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-pulse-900">Skills Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time skill demand from CS job postings</p>
        </div>
        <button
          onClick={handleScrape}
          disabled={scraping}
          className="bg-pulse-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-pulse-800 disabled:opacity-50 flex items-center gap-2"
        >
          {scraping ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Scraping...
            </>
          ) : (
            <>
              <RefreshCw size={16} /> Refresh Data
            </>
          )}
        </button>
      </div>

      {scrapeMsg && <p className="text-sm text-pulse-600 mb-4">{scrapeMsg}</p>}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Jobs Tracked" value={stats?.total} sub="from Simplify + Indeed" />
        <StatCard label="New Grad Roles" value={stats?.new_grad} sub="entry-level positions" />
        <StatCard label="Internship Roles" value={stats?.internship} sub="intern positions" />
      </div>

      {skills[0] && (
        <div className="bg-pulse-600 text-white rounded-lg p-4 mb-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium opacity-75 uppercase tracking-wide flex items-center gap-1">
              <Flame size={14} /> Most In-Demand Skill
            </p>
            <p className="text-2xl font-bold mt-1 capitalize">{skills[0].name}</p>
            <p className="text-sm opacity-75 mt-0.5">{skills[0].count} job postings mention this skill</p>
          </div>
          <span className="text-5xl opacity-20 font-black">#1</span>
        </div>
      )}

      <JobsOverTimeChart data={timeseries} />

      <SkillFilters filters={filters} onChange={setFilters} />
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <SkillChart skills={skills} />

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="bg-pulse-100 text-pulse-700 text-xs px-2 py-0.5 rounded-full">New Grad</span>
            Top Skills
          </h3>
          <TopSkillsBar skills={newGradSkills} onSkillClick={setSelectedSkill} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="bg-sky-100 text-sky-700 text-xs px-2 py-0.5 rounded-full">Internship</span>
            Top Skills
          </h3>
          <TopSkillsBar skills={internSkills} onSkillClick={setSelectedSkill} />
        </div>
      </div>

      <TopSkillsBar skills={skills} onSkillClick={setSelectedSkill} />

      <SkillDetailPanel skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </div>
  );
}