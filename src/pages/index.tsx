import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "../components/header";
import BottomNavigation from "../components/layout/BottomNavigation";
import Home from "./Home";
import Consulting from "./Consulting";
import VideoDetail from "./Consulting/VideoDetail";
import Ai from "./Ai";
import Login from "./Login";
import ConsultationWizard from "./ConsultationWizard";
import Recommendations from "./Recommendations";

export default function Router() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isConsultation = /^\/consult\/(skin|hair|makeup)$/.test(location.pathname);
  const headerClass = isConsultation ? "max-sm:hidden" : location.pathname === "/" ? "max-md:hidden" : "";
  return (
    <div className="mx-auto flex min-h-dvh max-w-full flex-col bg-white font-sans text-base leading-[145%] tracking-[0.18px] text-[#667085] antialiased">
      <Header className={headerClass} />
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
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      {!isConsultation && location.pathname !== "/" && <BottomNavigation />}
    </div>
  );
}
