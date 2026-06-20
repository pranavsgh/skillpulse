import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import Navbar from "./components/shared/Navbar.jsx";
import Footer from "./components/shared/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Chat from "./pages/Chat.jsx";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import Companies from "./pages/Companies.jsx";
import { setCurrentUserId } from "./utils/api.js";

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

// Keeps api.js's request identity in sync with the signed-in Clerk user, so
// backend ownership (chat sessions, etc.) is scoped per-account instead of
// per-browser — two different users on the same machine never collide.
function ClerkUserSync() {
  const { user } = useUser();

  useEffect(() => {
    setCurrentUserId(user?.id ?? null);
  }, [user?.id]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ClerkUserSync />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}