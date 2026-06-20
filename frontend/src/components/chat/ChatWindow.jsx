import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";

export const STARTER_PROMPTS = ["Suggest a project idea for me"];

export const FOLLOWUP_PROMPTS = [
  "Go deeper on this idea",
  "Suggest a different idea",
  "Make it more advanced",
  "Make it simpler",
  "Why does this fit my profile?",
];

export default function ChatWindow({ messages = [], loading, onSend, startedIndexes, onStartProject }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const hasProjectIdea = messages.some((m) => m.role === "assistant" && m.kind === "project");
  const prompts = hasProjectIdea ? FOLLOWUP_PROMPTS : STARTER_PROMPTS;

  return (
    <div className="flex flex-col h-[60vh] border border-gray-200 rounded-lg bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 && !loading && (
          <p className="text-sm text-gray-400 text-center mt-8">
            Pick a prompt below to get started.
          </p>
        )}
        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            role={m.role}
            content={m.content}
            canStart={m.role === "assistant" && m.kind === "project" && m.new_project}
            started={startedIndexes?.has(i)}
            onStart={() => onStartProject(i, m.content)}
          />
        ))}
        {loading && (
          <div className="text-sm text-gray-400 italic px-1">SkillPulse is thinking...</div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex flex-wrap gap-2 p-3 border-t border-gray-200">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onSend(p)}
            disabled={loading}
            className="text-sm border border-pulse-200 text-pulse-700 bg-pulse-50 px-3 py-1.5 rounded-full hover:bg-pulse-100 disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
