import { useState, useEffect } from "react";
import { fetchSkills } from "../utils/api.js";

export default function useSkills(filters) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Todo Pranav: call fetchSkills(filters), populate skills/loading/error
  }, [filters]);

  return { skills, loading, error };
}
