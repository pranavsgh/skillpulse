export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  const formatted = content
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <span className="w-7 h-7 rounded-full bg-pulse-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          SP
        </span>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
          isUser ? "bg-pulse-600 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        {isUser ? content : <span dangerouslySetInnerHTML={{ __html: formatted }} />}
      </div>
    </div>
  );
}