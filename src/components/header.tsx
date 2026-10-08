import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./common/Logo";
import { getAppSession, subscribeAuth } from "../lib/auth";

const memberTitles: Record<string, string> = {
  "/my": "마이페이지", "/my/profile": "프로필 수정", "/my/history": "AI 상담 내역",
  "/my/saved": "저장한 콘텐츠", "/my/settings": "계정 설정",
};

export default function Header() {
  const { pathname } = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    let active = true;
    let revision = 0;
    const refresh = () => {
      const request = ++revision;
      void getAppSession().then((session) => { if (active && request === revision) setIsLoggedIn(Boolean(session)); });
    };
    refresh();
    const unsubscribe = subscribeAuth(refresh);
    return () => { active = false; unsubscribe(); };
  }, []);
  const accountLink = <Link className="app-button shrink-0" to={isLoggedIn ? "/my" : "/login"}>{isLoggedIn ? "마이페이지" : "로그인"}</Link>;
  if (pathname === "/") return <header className="app-header"><Logo />{accountLink}</header>;
  if (pathname.startsWith("/my")) return <header className="app-header"><Link className="app-button" to={pathname === "/my" ? "/" : "/my"}>{pathname === "/my" ? "← 홈" : "← 마이"}</Link><h1 className="app-header-title">{memberTitles[pathname] ?? "마이페이지"}</h1><Link className="app-button" to="/">홈</Link></header>;
  const isConsultation = pathname.startsWith("/consult");
  const title = isConsultation ? "AI 뷰티 상담" : pathname === "/recommendations" ? "상담 결과" : pathname === "/login" ? "로그인" : "MAN-PICK 영상";
  return <header className="app-header"><Link className="app-button shrink-0" to="/">← 홈</Link><h1 className="app-header-title">{title}</h1>{isConsultation ? <span className="subtle shrink-0">선택형</span> : pathname === "/login" ? null : accountLink}</header>;
}
