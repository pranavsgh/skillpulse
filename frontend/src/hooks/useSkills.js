import { useState, useEffect } from "react";
import { fetchSkills } from "../utils/api.js";

export default function useSkills(filters, refreshKey = 0) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchSkills(filters)
      .then((data) => {
        setSkills(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters, refreshKey]);

  return { skills, loading, error };
}