import { Routes, Route } from "react-router";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Home from "./pages/Home";
import { AnnouncementList, AnnouncementDetail } from "./pages/Announcements";
import Dictionary from "./pages/Dictionary";
import { GuideList, GuideDetail } from "./pages/Guides";
import Calendar from "./pages/Calendar";
import Recruit from "./pages/Recruit";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <div className="noise-overlay" />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/announcements" element={<AnnouncementList />} />
        <Route path="/announcements/:id" element={<AnnouncementDetail />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/guides" element={<GuideList />} />
        <Route path="/guides/:id" element={<GuideDetail />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/recruit" element={<Recruit />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SiteFooter />
    </div>
  );
}
