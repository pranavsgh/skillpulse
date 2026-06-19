import { useState, useEffect } from "react";
import { Pencil, Download } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import useChat, { getOrCreateSessionId, setCurrentSessionId } from "../hooks/useChat.js";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import RoleSelector from "../components/chat/RoleSelector.jsx";
import SessionSidebar from "../components/chat/SessionSidebar.jsx";
import QuizModal from "../components/chat/QuizModal.jsx";
import ExportBriefModal from "../components/chat/ExportBriefModal.jsx";

function getPrefsKey(userId) {
  return `skillpulse-user-prefs-${userId}`;
}

function getSessionKey(userId) {
  return `skillpulse-session-id-${userId}`;
}

export default function Chat() {
  const { user } = useUser();
  const userId = user?.id;

  const [sessionId, setSessionId] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const { messages, loading, send, targetRole, setTargetRole, clearMessages } = useChat(sessionId, prefs);

  const projectMessages = messages
    .filter((m) => m.role === "assistant" && m.kind === "project" && m.new_project)
    .map((m) => m.content);

  // Load prefs and session scoped to this user
  useEffect(() => {
    if (!userId) return;

    const savedPrefs = localStorage.getItem(getPrefsKey(userId));
    if (savedPrefs) {
      const p = JSON.parse(savedPrefs);
      setPrefs(p);
      if (p.role) setTargetRole(p.role);
    } else {
      setShowQuiz(true);
    }

    let sid = localStorage.getItem(getSessionKey(userId));
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(getSessionKey(userId), sid);
    }
    setSessionId(sid);
  }, [userId]);

  function handleQuizComplete(answers) {
    localStorage.setItem(getPrefsKey(userId), JSON.stringify(answers));
    setPrefs(answers);
    setShowQuiz(false);
    if (answers.role) setTargetRole(answers.role);
  }

  function handleNewChat() {
    const newId = crypto.randomUUID();
    localStorage.setItem(getSessionKey(userId), newId);
    setCurrentSessionId(newId);
    setSessionId(newId);
    clearMessages();
  }

  function handleSelectSession(id) {
    localStorage.setItem(getSessionKey(userId), id);
    setCurrentSessionId(id);
    setSessionId(id);
  }

  if (!userId) return null;

  return (
    <>
      {showQuiz && <QuizModal onComplete={handleQuizComplete} />}
      {showExport && (
        <ExportBriefModal
          sessionId={sessionId}
          projectMessages={projectMessages}
          onClose={() => setShowExport(false)}
        />
      )}
      <div className="flex h-[calc(100vh-60px)]">
        <SessionSidebar
          currentSessionId={sessionId}
          onSelect={handleSelectSession}
          onNew={handleNewChat}
        />
        <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-pulse-900">Project Advisor</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExport(true)}
                disabled={projectMessages.length === 0}
                className="text-xs text-pulse-600 border border-pulse-200 px-3 py-1 rounded-full hover:bg-pulse-50 flex items-center gap-1 disabled:opacity-40 disabled:hover:bg-white"
              >
                <Download size={12} /> Export to Claude Code
              </button>
              <button
                onClick={() => setShowQuiz(true)}
                className="text-xs text-pulse-600 border border-pulse-200 px-3 py-1 rounded-full hover:bg-pulse-50 flex items-center gap-1"
              >
                <Pencil size={12} /> Edit preferences
              </button>
            </div>
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