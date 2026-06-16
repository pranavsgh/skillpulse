import useChat from "../hooks/useChat.js";
import ChatWindow from "../components/chat/ChatWindow.jsx";
import RoleSelector from "../components/chat/RoleSelector.jsx";

export default function Chat() {
  const { messages, loading, send, targetRole, setTargetRole } = useChat();

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-pulse-900 mb-4">Project Advisor</h1>
      <RoleSelector targetRole={targetRole} onChange={setTargetRole} />
      <ChatWindow messages={messages} loading={loading} onSend={send} />
    </div>
  );
}
