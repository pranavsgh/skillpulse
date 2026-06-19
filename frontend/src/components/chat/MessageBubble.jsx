export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  const formatted = content
    .replace(/^### (.+)$/gm, "<strong style='font-size:0.9rem;display:block;margin-top:0.6rem;margin-bottom:0.1rem'>$1</strong>")
    .replace(/^## (.+)$/gm, "<strong style='font-size:0.95rem;display:block;margin-top:0.6rem;margin-bottom:0.1rem'>$1</strong>")
    .replace(/^# (.+)$/gm, "<strong style='font-size:1rem;display:block;margin-top:0.6rem;margin-bottom:0.1rem'>$1</strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<span style='display:block;padding-left:0.75rem;text-indent:-0.5rem'>• $1</span>")
    .replace(/^---+$/gm, "<hr style='border:none;border-top:1px solid #e5e7eb;margin:0.4rem 0'/>")
    .replace(/\n{2,}/g, "<br/>")
    .replace(/\n/g, " ");

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <span className="w-7 h-7 rounded-full bg-pulse-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          SP
        </span>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-snug shadow-sm ${
          isUser ? "bg-pulse-600 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        {isUser ? content : <span dangerouslySetInnerHTML={{ __html: formatted }} />}
      </div>
    </div>
  );
}