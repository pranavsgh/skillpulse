import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchSessions, deleteSession } from "../../utils/api.js";

export default function SessionSidebar({ currentSessionId, onSelect, onNew }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    load();
  }, [currentSessionId]);

  async function load() {
    try {
      const data = await fetchSessions();
      setSessions(data);
    } catch {}
  }

  async function handleDelete(e, sessionId) {
    e.stopPropagation();
    await deleteSession(sessionId);
    if (sessionId === currentSessionId) onNew();
    load();
  }

  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={onNew}
          className="w-full bg-pulse-600 text-white rounded-full px-3 py-2 text-sm font-semibold hover:bg-pulse-800"
        >
          + New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 && (
          <p className="text-xs text-gray-400 p-3">No conversations yet.</p>
        )}
        {sessions.map((s) => (
          <div
            key={s.session_id}
            onClick={() => onSelect(s.session_id)}
            className={`flex items-start justify-between p-3 cursor-pointer border-b hover:bg-pulse-100 ${
              s.session_id === currentSessionId ? "bg-pulse-100 border-l-2 border-l-pulse-600" : ""
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 truncate">{s.preview}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.message_count} messages</p>
            </div>
            <button
              onClick={(e) => handleDelete(e, s.session_id)}
              className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}