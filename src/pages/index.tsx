import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "../components/header";
import Home from "./Home";
import Consulting from "./Consulting";
import VideoDetail from "./Consulting/VideoDetail";
import Ai from "./Ai";
import Login from "./Login";
import ConsultationWizard from "./ConsultationWizard";
import Recommendations from "./Recommendations";
import Member from "./Member";

export default function Router() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return (
    <div className="app-shell antialiased">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consult" element={<Ai />} />
        <Route path="/consult/:category" element={<ConsultationWizard />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/videos" element={<Consulting />} />
        <Route path="/videos/:id" element={<VideoDetail />} />
        <Route path="/ai" element={<Navigate replace to="/consult" />} />
        <Route path="/consulting" element={<Navigate replace to="/videos" />} />
        <Route path="/consulting/:id" element={<VideoDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my" element={<Member />} />
        <Route path="/my/profile" element={<Member />} />
        <Route path="/my/history" element={<Member />} />
        <Route path="/my/saved" element={<Member />} />
        <Route path="/my/settings" element={<Member />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}
