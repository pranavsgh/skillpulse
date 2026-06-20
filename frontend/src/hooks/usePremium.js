import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { checkPremium } from "../utils/api.js";

export default function usePremium() {
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    checkPremium(user.id)
      .then(setIsPremium)
      .catch(() => setIsPremium(false))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return { isPremium, loading };
}