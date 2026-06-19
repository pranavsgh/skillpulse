import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-pulse-900 mb-2">About SkillPulse</h1>
      <p className="text-pulse-600 text-lg mb-10">Real-time CS job market intelligence for new grads and interns.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-pulse-800 mb-3">What is SkillPulse?</h2>
        <p className="text-gray-600 leading-relaxed">
          SkillPulse is a full-stack web application that scrapes thousands of CS job postings daily from sources like Simplify and Indeed, extracts the most in-demand programming languages, frameworks, and tools, and surfaces that data in real time. Instead of guessing what to learn, you can see exactly what employers are hiring for right now.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-pulse-800 mb-3">Why we built it</h2>
        <p className="text-gray-600 leading-relaxed">
          As CS students ourselves, we found it frustrating to not know which skills actually matter for landing internships and new grad roles. Advice online is generic and outdated. SkillPulse cuts through that by going directly to the source — the job postings themselves — and telling you what skills are trending this week, not last year.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-pulse-800 mb-3">How it works</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <span className="bg-pulse-100 text-pulse-800 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</span>
            <div>
              <p className="font-medium text-gray-800">Scrape</p>
              <p className="text-gray-500 text-sm">Our scrapers pull thousands of new grad and internship postings daily from Simplify and Indeed.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-pulse-100 text-pulse-800 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</span>
            <div>
              <p className="font-medium text-gray-800">Extract</p>
              <p className="text-gray-500 text-sm">NLP-driven skill extraction identifies languages, frameworks, and tools mentioned in each job description.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-pulse-100 text-pulse-800 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</span>
            <div>
              <p className="font-medium text-gray-800">Visualize</p>
              <p className="text-gray-500 text-sm">The Skills Dashboard ranks skills by frequency so you can see exactly what's in demand for your target role.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-pulse-100 text-pulse-800 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</span>
            <div>
              <p className="font-medium text-gray-800">Advise</p>
              <p className="text-gray-500 text-sm">The AI Project Advisor, powered by Claude, uses this live data to recommend portfolio projects tailored to your target role.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-pulse-800 mb-3">Tech stack</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Frontend", "React, Vite, Tailwind CSS, Recharts"],
            ["Backend", "FastAPI, SQLAlchemy, SQLite"],
            ["AI", "Claude Sonnet 4.6 (Anthropic), Gemini Flash Lite (Google)"],
            ["Scraping", "Simplify Jobs API, Indeed RSS, APScheduler"],
          ].map(([label, value]) => (
            <div key={label} className="bg-pulse-50 border border-pulse-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-pulse-600 uppercase tracking-wide mb-1">{label}</p>
              <p className="text-sm text-gray-700">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-pulse-800 mb-3">Built by</h2>
        <p className="text-gray-600">
          Muthamizh Arrasu Kamaraj and Pranav Singh — CS students at UW-Madison, Class of 2029.
        </p>
      </section>

      <div className="flex gap-4 mt-8">
        <Link to="/dashboard" className="bg-pulse-600 text-white px-5 py-2 rounded hover:bg-pulse-800 text-sm">
          View Dashboard
        </Link>
        <Link to="/chat" className="border border-pulse-600 text-pulse-600 px-5 py-2 rounded hover:bg-pulse-50 text-sm">
          Try Project Advisor
        </Link>
      </div>
    </div>
  );
}