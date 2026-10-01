import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./common/Logo";
import { BellIcon } from "./common/Icons";
import { getAppSession, signOut, subscribeAuth } from "../lib/auth";

const navItems = [
  { label: "AI 상담", path: "/consult" },
  { label: "영상", path: "/videos" },
  { label: "추천 제품", path: "/recommendations" },
];

export default function Header({ className = "" }: { className?: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const refresh = () =>
      void getAppSession().then((session) => setIsLoggedIn(Boolean(session)));
    refresh();
    return subscribeAuth(refresh);
  }, []);
  return (
    <header className={`sticky top-0 z-40 h-[68px] shrink-0 border-b border-[#e4ebf5] bg-white/95 backdrop-blur-sm ${className}`}>
      <div className="mx-auto flex h-full w-full max-w-[1220px] items-center justify-between px-4 sm:px-6">
        <div className="md:hidden"><Link className="inline-flex items-baseline gap-2.5 no-underline" to="/"><strong className="text-[24px] font-black tracking-[0.04em] text-[#1f5ed7]">HRI</strong><span className="text-[17px] font-black tracking-[-0.04em] text-[#1f2937]">훈남연구소</span></Link></div>
        <div className="hidden md:block"><Logo /></div>
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="주요 메뉴"
        >
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `relative py-6 text-[13px] font-black no-underline transition ${isActive ? "text-[#1f5ed7] after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-[#1f5ed7]" : "text-[#4f5d70] hover:text-[#1f5ed7]"}`
              }
              key={item.path}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="grid size-11 cursor-pointer place-items-center border-0 bg-transparent text-[#1f2937] md:hidden" type="button" aria-label="알림"><BellIcon className="size-6" /></button>
        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <button
              className="min-h-10 cursor-pointer rounded-xl border border-[#dbe5f5] bg-white px-4 text-[11px] font-bold text-[#64748b] hover:border-[#1f5ed7] hover:text-[#1f5ed7]"
              type="button"
              onClick={() => void signOut()}
            >
              로그아웃
            </button>
          ) : (
            <Link
              className="inline-flex min-h-10 items-center rounded-xl border border-[#dbe5f5] px-4 text-[11px] font-bold text-[#64748b] no-underline hover:border-[#1f5ed7] hover:text-[#1f5ed7]"
              to="/login"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
