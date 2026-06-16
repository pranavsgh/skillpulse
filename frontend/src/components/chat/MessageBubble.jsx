export default function MessageBubble({ role, content }) {
  // Todo Mutha: user vs assistant styling
  const isUser = role === "user";
  return (
    <div className={`max-w-[80%] rounded px-3 py-2 ${isUser ? "ml-auto bg-pulse-600 text-white" : "bg-gray-100"}`}>
      {content}
    </div>
  );
}
