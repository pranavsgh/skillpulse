import { useState } from "react";
import { generateBrief } from "../../utils/api.js";

function previewOf(content) {
  const stripped = content.replace(/[*#`]/g, "").trim();
  return stripped.length > 140 ? stripped.slice(0, 140) + "..." : stripped;
}

function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 50) || "project-brief"
  );
}

function downloadMarkdown(filename, content) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportBriefModal({ sessionId, projectMessages, onClose }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const { brief } = await generateBrief(sessionId, selected);
      const titleLine = brief.split("\n").find((l) => l.startsWith("# "));
      const filename = `${slugify(titleLine ? titleLine.slice(2) : "project-brief")}.md`;
      downloadMarkdown(filename, brief);
      onClose();
    } catch {
      setError("Couldn't generate the brief. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <h2 className="text-lg font-bold text-pulse-900 mb-1">Export to Claude Code</h2>
        <p className="text-sm text-gray-500 mb-4">
          Pick the project idea you want to turn into a build brief.
        </p>

        {projectMessages.length === 0 ? (
          <p className="text-sm text-gray-400">No project ideas in this chat yet.</p>
        ) : (
          <div className="space-y-2 overflow-y-auto flex-1">
            {projectMessages.map((content, i) => (
              <button
                key={i}
                onClick={() => setSelected(content)}
                className={`block w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                  selected === content
                    ? "bg-pulse-600 text-white border-pulse-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-pulse-400"
                }`}
              >
                {previewOf(content)}
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <div className="flex justify-between items-center mt-6">
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!selected || loading}
            className="bg-pulse-600 text-white px-6 py-2 rounded-full text-sm font-medium disabled:opacity-40 hover:bg-pulse-800"
          >
            {loading ? "Generating..." : "Generate .md"}
          </button>
        </div>
      </div>
    </div>
  );
}
