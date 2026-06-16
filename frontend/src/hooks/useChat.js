import { useState } from "react";
import { sendChatMessage } from "../utils/api.js";

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetRole, setTargetRole] = useState("");

  async function send(message) {
    // Todo Mutha: push user message, call sendChatMessage, push assistant reply
  }

  return { messages, loading, send, targetRole, setTargetRole };
}
