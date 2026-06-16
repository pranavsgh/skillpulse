import { useState, useEffect } from "react";
import { fetchJobs } from "../utils/api.js";

export default function useJobs(filters) {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Todo Pranav: call fetchJobs(filters), populate jobs/total/loading/error
  }, [filters]);

  return { jobs, total, loading, error };
}
