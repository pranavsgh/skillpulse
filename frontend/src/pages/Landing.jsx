import { useState, useEffect } from "react";
import Hero from "../components/landing/Hero.jsx";
import Features from "../components/landing/Features.jsx";
import { fetchStats } from "../utils/api.js";

function StatStrip() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
  }, []);

  if (!stats) return null;

  const items = [
    { label: "Jobs tracked", value: stats.total },
    { label: "New grad roles", value: stats.new_grad },
    { label: "Internship roles", value: stats.internship },
  ];

  return (
    <div className="flex justify-center gap-10 pb-16">
      {items.map((s) => (
        <div key={s.label} className="text-center">
          <p className="text-3xl font-bold text-pulse-600">{s.value?.toLocaleString() ?? "—"}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      <Hero />
      <StatStrip />
      <Features />
    </div>
  );
}
