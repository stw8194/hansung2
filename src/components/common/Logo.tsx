import { Link } from "react-router-dom";

export default function Logo({ compact = false, hero = false }: { compact?: boolean; hero?: boolean }) {
  return (
    <Link
      className={`inline-flex text-[#111827] no-underline ${hero ? "flex-col items-center gap-2 text-center" : "items-center gap-2.5 text-left"}`}
      to="/"
      aria-label="훈남연구소 홈"
    >
      <span className={`grid place-items-center border border-[#dbe5f5] bg-white shadow-[0_8px_28px_rgba(31,94,215,0.16)] ${hero ? "size-[92px] rounded-[26px]" : "size-10 rounded-xl"}`}>
        <svg className={hero ? "size-16" : "size-7"} viewBox="0 0 32 32" aria-hidden="true">
          <path fill="#1f5ed7" d="M5 5h5v8h8V5h5v22h-5v-9h-8v9H5z" />
          <circle
            cx="23.5"
            cy="22.5"
            r="4.2"
            fill="white"
            stroke="#1f5ed7"
            strokeWidth="2"
          />
          <path
            d="m26.6 25.6 3 3"
            stroke="#1f5ed7"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {!compact && !hero && (
        <span>
          <strong className="block text-[16px] leading-none font-black tracking-[-0.04em]">
            훈남연구소
          </strong>
          <small className="mt-1 block text-[9px] font-black tracking-[0.16em] text-[#1f5ed7]">
            HRI
          </small>
        </span>
      )}
      {hero && <span><strong className="block text-[42px] leading-none font-black tracking-[0.02em] text-[#1f5ed7]">HRI</strong><small className="mt-2 block text-[25px] leading-none font-black tracking-[-0.04em] text-[#1f5ed7]">훈남연구소</small></span>}
    </Link>
  );
}
