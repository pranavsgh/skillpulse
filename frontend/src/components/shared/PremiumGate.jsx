import { useNavigate } from "react-router-dom";
import usePremium from "../../hooks/usePremium.js";

export default function PremiumGate({ children, feature = "this feature" }) {
  const { isPremium, loading } = usePremium();
  const navigate = useNavigate();

  if (loading) return null;

  if (!isPremium) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-6">⭐</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Premium Feature</h1>
        <p className="text-gray-500 mb-2">
          {feature} is available for SkillPulse Premium members.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Upgrade to unlock personalized roadmaps, interview prep, and more.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/chat")}
            className="border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-sm hover:bg-gray-50"
          >
            Back to Advisor
          </button>
          <button
            onClick={() => alert("Stripe coming soon!")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700"
          >
            Upgrade to Premium →
          </button>
        </div>
      </div>
    );
  }

  return children;
}