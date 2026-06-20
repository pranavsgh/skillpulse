import { NavLink } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium border-b-2 ${
    isActive ? "text-gray-900 border-pulse-600" : "text-gray-500 border-transparent hover:text-gray-900"
  }`;

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-6 py-2 bg-white shadow-sm">
      <NavLink to="/" className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-md bg-pulse-600 text-white font-bold flex items-center justify-center text-lg">
          S
        </span>
        <span className="text-lg font-bold text-gray-900 hidden sm:inline">SkillPulse</span>
      </NavLink>
      <div className="flex items-center gap-1">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/companies" className={linkClass}>Companies</NavLink>
        <NavLink to="/roadmap" className={linkClass}>Roadmap</NavLink>
        <NavLink to="/chat" className={linkClass}>Project Advisor</NavLink>
        <NavLink to="/about" className={linkClass}>About</NavLink>
        <SignedIn>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>
        </SignedIn>
        <div className="ml-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="ml-2 px-4 py-1.5 bg-pulse-600 text-white text-sm rounded-lg hover:bg-pulse-800">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}