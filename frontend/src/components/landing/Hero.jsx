import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="text-center py-20 px-6">
      <h1 className="text-4xl font-bold text-pulse-900">Know what skills land the job.</h1>
      <p className="mt-4 text-gray-600 max-w-xl mx-auto">
        SkillPulse tracks new grad and internship postings to surface trending
        languages, frameworks, and tools — in real time.
      </p>
      <Link to="/dashboard" className="inline-block mt-6 bg-pulse-600 text-white px-6 py-2 rounded">
        View Dashboard
      </Link>
    </section>
  );
}