import { useState, useEffect } from "react";
import { sendChatMessage, fetchSession } from "../utils/api.js";

const SESSION_KEY = "skillpulse-session-id";

export function getOrCreateSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function setCurrentSessionId(id) {
  localStorage.setItem(SESSION_KEY, id);
}

export default function useChat(sessionId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState("");

  // Load messages from DB when session changes
  useEffect(() => {
    if (!sessionId) return;
    fetchSession(sessionId)
      .then((data) => setMessages(data.messages || []))
      .catch(() => setMessages([]));
  }, [sessionId]);

  async function send(message) {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      const { reply } = await sendChatMessage(message, targetRole, sessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearMessages() {
    setMessages([]);
  }

  return { messages, loading, send, targetRole, setTargetRole, clearMessages };
}