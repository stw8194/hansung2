import { NavLink } from "react-router-dom";
import { HomeIcon, SparkIcon, UserIcon, VideoIcon } from "../common/Icons";

const items = [
  { label: "홈", path: "/", icon: HomeIcon, end: true },
  { label: "AI 상담", path: "/consult", icon: SparkIcon },
  { label: "영상", path: "/videos", icon: VideoIcon },
  { label: "마이", path: "/login", icon: UserIcon },
];

export default function BottomNavigation() {
  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-40 grid h-[calc(60px+env(safe-area-inset-bottom))] grid-cols-4 border-t border-[#dbe5f5] bg-white px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="모바일 주요 메뉴"
    >
      {items.map((item) => (
        <NavLink
          className={({ isActive }) =>
            `flex min-h-11 flex-col items-center justify-center gap-1 text-[10px] font-bold no-underline ${isActive ? "text-[#1f5ed7]" : "text-[#7a8493]"}`
          }
          end={item.end}
          key={item.path}
          to={item.path}
        >
          <item.icon className="size-[19px]" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
