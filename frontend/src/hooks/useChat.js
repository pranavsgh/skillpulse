import { useState } from "react";
import { sendChatMessage } from "../utils/api.js";

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState("");

  async function send(message) {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      const reply = await sendChatMessage(message, targetRole);
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

  return { messages, loading, send, targetRole, setTargetRole };
}