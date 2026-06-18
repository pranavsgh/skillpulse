export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  const formatted = content
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");

  return (
    <div className={`max-w-[80%] rounded px-3 py-2 text-sm leading-relaxed ${
      isUser
        ? "ml-auto bg-pulse-600 text-white"
        : "bg-gray-100 text-gray-800"
    }`}>
      {isUser ? (
        content
      ) : (
        <span dangerouslySetInnerHTML={{ __html: formatted }} />
      )}
    </div>
  );
}