import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({ messages = [], loading, onSend }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  }

  return (
    <div className="flex flex-col h-[60vh] border rounded">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="text-sm text-gray-400 italic px-1">SkillPulse is thinking...</div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Ask for project ideas..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-pulse-600 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}