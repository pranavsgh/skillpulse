import { useState } from "react";
import useChat, { getOrCreateSessionId, setCurrentSessionId } from "../hooks/useChat.js";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import RoleSelector from "../components/chat/RoleSelector.jsx";
import SessionSidebar from "../components/chat/SessionSidebar.jsx";

export default function Chat() {
  const [sessionId, setSessionId] = useState(getOrCreateSessionId);
  const { messages, loading, send, targetRole, setTargetRole, clearMessages } = useChat(sessionId);

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
    <div className="flex h-[calc(100vh-60px)]">
      <SessionSidebar
        currentSessionId={sessionId}
        onSelect={handleSelectSession}
        onNew={handleNewChat}
      />
      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-pulse-900 mb-4">Project Advisor</h1>
        <RoleSelector targetRole={targetRole} onChange={setTargetRole} />
        <ChatWindow messages={messages} loading={loading} onSend={send} />
      </div>
    </div>
  );
}