import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/shared/Navbar.jsx";
import Footer from "./components/shared/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import Chat from "./pages/Chat.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
