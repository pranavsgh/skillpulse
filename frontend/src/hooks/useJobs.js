import { useState, useEffect } from "react";
import { fetchJobs } from "../utils/api.js";

export default function useJobs(filters) {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchJobs(filters)
      .then((data) => {
        setJobs(data.jobs);
        setTotal(data.total);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  return { jobs, total, loading, error };
}