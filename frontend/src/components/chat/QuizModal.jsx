import { useState } from "react";

const ROLES = ["Backend", "Frontend", "Full Stack", "ML/AI", "Data Science", "Cybersecurity", "Mobile"];
const LANGUAGES = ["Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "SQL", "R"];
const COMPANIES = ["Big Tech", "Startup", "Fintech", "Any"];
const LEVELS = ["Beginner", "Some experience", "Comfortable"];

export default function QuizModal({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    role: "",
    level: "",
    languages: [],
    company: "",
  });

  function toggleLanguage(lang) {
    setAnswers((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  }

  function next() {
    if (step < 3) setStep((s) => s + 1);
    else onComplete(answers);
  }

  function canNext() {
    if (step === 0) return answers.role !== "";
    if (step === 1) return answers.level !== "";
    if (step === 2) return answers.languages.length > 0;
    if (step === 3) return answers.company !== "";
    return false;
  }

  const steps = [
    {
      title: "What role are you targeting?",
      content: (
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setAnswers((p) => ({ ...p, role: r }))}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                answers.role === r
                  ? "bg-pulse-600 text-white border-pulse-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-pulse-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What's your experience level?",
      content: (
        <div className="flex flex-col gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setAnswers((p) => ({ ...p, level: l }))}
              className={`px-4 py-3 rounded-lg border text-sm font-medium text-left transition-all ${
                answers.level === l
                  ? "bg-pulse-600 text-white border-pulse-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-pulse-400"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Which languages do you already know?",
      subtitle: "Select all that apply",
      content: (
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                answers.languages.includes(lang)
                  ? "bg-pulse-600 text-white border-pulse-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-pulse-400"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What type of company are you targeting?",
      content: (
        <div className="grid grid-cols-2 gap-2">
          {COMPANIES.map((c) => (
            <button
              key={c}
              onClick={() => setAnswers((p) => ({ ...p, company: c }))}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                answers.company === c
                  ? "bg-pulse-600 text-white border-pulse-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-pulse-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        {/* Progress */}
        <div className="flex gap-1 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i <= step ? "bg-pulse-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <h2 className="text-lg font-bold text-pulse-900 mb-1">{steps[step].title}</h2>
        {steps[step].subtitle && (
          <p className="text-sm text-gray-500 mb-4">{steps[step].subtitle}</p>
        )}
        {!steps[step].subtitle && <div className="mb-4" />}

        {steps[step].content}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`text-sm text-gray-400 hover:text-gray-600 ${step === 0 ? "invisible" : ""}`}
          >
            Back
          </button>
          <button
            onClick={next}
            disabled={!canNext()}
            className="bg-pulse-600 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-pulse-800"
          >
            {step === 3 ? "Start Advising →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}