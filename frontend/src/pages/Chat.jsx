import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import useChat, { getOrCreateSessionId, setCurrentSessionId } from "../hooks/useChat.js";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import RoleSelector from "../components/chat/RoleSelector.jsx";
import SessionSidebar from "../components/chat/SessionSidebar.jsx";
import QuizModal from "../components/chat/QuizModal.jsx";

const PREFS_KEY = "skillpulse-user-prefs";

export default function Chat() {
  const [sessionId, setSessionId] = useState(getOrCreateSessionId);
  const [prefs, setPrefs] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const { messages, loading, send, targetRole, setTargetRole, clearMessages } = useChat(sessionId, prefs);

  useEffect(() => {
    const saved = localStorage.getItem(PREFS_KEY);
    if (saved) {
      setPrefs(JSON.parse(saved));
    } else {
      setShowQuiz(true);
    }
  }, []);

  function handleQuizComplete(answers) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(answers));
    setPrefs(answers);
    setShowQuiz(false);
    if (answers.role) setTargetRole(answers.role);
  }

  function handleNewChat() {
    const newId = crypto.randomUUID();
    setCurrentSessionId(newId);
    setSessionId(newId);
    clearMessages();
  }

  function handleSelectSession(id) {
    setCurrentSessionId(id);
    setSessionId(id);
  }

  return (
    <>
      {showQuiz && <QuizModal onComplete={handleQuizComplete} />}
      <div className="flex h-[calc(100vh-60px)]">
        <SessionSidebar
          currentSessionId={sessionId}
          onSelect={handleSelectSession}
          onNew={handleNewChat}
        />
        <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-pulse-900">Project Advisor</h1>
            <button
              onClick={() => setShowQuiz(true)}
              className="text-xs text-pulse-600 border border-pulse-200 px-3 py-1 rounded-full hover:bg-pulse-50 flex items-center gap-1"
            >
              <Pencil size={12} /> Edit preferences
            </button>
          </div>
          {prefs && (
            <div className="flex gap-2 flex-wrap mb-3">
              {prefs.role && <span className="bg-pulse-100 text-pulse-700 text-xs px-2 py-1 rounded-full">{prefs.role}</span>}
              {prefs.level && <span className="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded-full">{prefs.level}</span>}
              {prefs.company && <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">{prefs.company}</span>}
              {prefs.languages?.map((l) => (
                <span key={l} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{l}</span>
              ))}
            </div>
          )}
          <RoleSelector targetRole={targetRole} onChange={setTargetRole} />
          <ChatWindow messages={messages} loading={loading} onSend={send} />
        </div>
      </div>
    </>
  );
}