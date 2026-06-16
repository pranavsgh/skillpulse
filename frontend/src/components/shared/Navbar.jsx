import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium ${isActive ? "text-pulse-600" : "text-gray-600 hover:text-pulse-500"}`;

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <span className="text-lg font-bold text-pulse-800">SkillPulse</span>
      <div className="flex gap-2">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/jobs" className={linkClass}>Jobs</NavLink>
        <NavLink to="/chat" className={linkClass}>Project Advisor</NavLink>
      </div>
    </nav>
  );
}
