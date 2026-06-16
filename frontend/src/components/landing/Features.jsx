const FEATURES = [
  { title: "Scrapes the market", desc: "LinkedIn, Indeed, and Simplify postings, pulled continuously." },
  { title: "Surfaces trends", desc: "NLP-driven skill extraction ranks languages, frameworks, tools." },
  { title: "AI project advisor", desc: "Claude-powered chat recommends portfolio projects for your target role." },
];

export default function Features() {
  // Todo Mutha: 3 feature cards
  return (
    <section className="grid md:grid-cols-3 gap-6 px-6 py-12 max-w-5xl mx-auto">
      {FEATURES.map((f) => (
        <div key={f.title} className="border rounded p-6">
          <h3 className="font-semibold text-pulse-800">{f.title}</h3>
          <p className="text-sm text-gray-600 mt-2">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
