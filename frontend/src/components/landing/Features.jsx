import { Radar, TrendingUp, Sparkles } from "lucide-react";

const FEATURES = [
  { title: "Scrapes the market", desc: "Simplify postings, pulled continuously.", icon: Radar },
  { title: "Surfaces trends", desc: "NLP-driven skill extraction ranks languages, frameworks, tools.", icon: TrendingUp },
  { title: "AI project advisor", desc: "Claude-powered chat recommends portfolio projects for your target role.", icon: Sparkles },
];

export default function Features() {
  return (
    <section className="grid md:grid-cols-3 gap-6 px-6 py-12 max-w-5xl mx-auto">
      {FEATURES.map((f) => (
        <div
          key={f.title}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-full bg-pulse-50 text-pulse-600 flex items-center justify-center mb-3">
            <f.icon size={20} />
          </div>
          <h3 className="font-semibold text-gray-900">{f.title}</h3>
          <p className="text-sm text-gray-600 mt-2">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
