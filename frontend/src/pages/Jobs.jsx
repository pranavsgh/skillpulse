import { useState } from "react";
import useJobs from "../hooks/useJobs.js";
import JobTable from "../components/jobs/JobTable.jsx";
import JobFilters from "../components/jobs/JobFilters.jsx";
import Loading from "../components/shared/Loading.jsx";

export default function Jobs() {
  const [filters, setFilters] = useState({});
  const { jobs, total, loading, error } = useJobs(filters);

  if (loading) return <Loading />;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-pulse-900 mb-4">Job Listings ({total})</h1>
      <JobFilters filters={filters} onChange={setFilters} />
      {error && <p className="text-red-500">{error}</p>}
      <JobTable jobs={jobs} />
    </div>
  );
}
