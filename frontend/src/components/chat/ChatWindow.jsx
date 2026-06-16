import { useState } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({ messages = [], loading, onSend }) {
  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Todo Mutha: call onSend(input), clear input
  }

  return (
    <div className="flex flex-col h-[60vh] border rounded">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Ask for project ideas..."
        />
        <button type="submit" className="bg-pulse-600 text-white px-4 py-1 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
