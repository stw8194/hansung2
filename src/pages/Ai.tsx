import { Link } from "react-router-dom";
import { HairIcon, MakeupIcon, SkinIcon } from "../components/common/Icons";
import { categoryDetails } from "../data/consultation";
import type { ConsultationCategory } from "../types/consultation";

const icons = { skin: SkinIcon, hair: HairIcon, makeup: MakeupIcon };

export default function Ai() {
  return (
    <main className="flex-1 bg-[#f8fafc] px-4 pt-5 pb-[calc(76px+env(safe-area-inset-bottom))] text-left sm:px-6 sm:py-14 md:pb-14">
      <section className="mx-auto max-w-[1080px]">
        <div className="text-center">
          <p className="text-[10px] font-black tracking-[0.14em] text-[#1f5ed7] sm:text-[11px]">
            AI 상담순서 · STEP 1
          </p>
          <h1 className="mt-1.5 text-[26px] font-black tracking-[-0.05em] text-[#111827] sm:mt-3 sm:text-[42px]">
            카테고리 선택
          </h1>
          <p className="mt-1.5 text-[12px] text-[#6b7280] sm:mt-3 sm:text-[15px]">
            어떤 카테고리에 대해 상담을 원하시나요?
          </p>
        </div>
        <div className="mt-5 grid gap-2.5 sm:mt-9 sm:grid-cols-2 sm:gap-4 lg:mt-12 lg:grid-cols-3">
          {(Object.keys(categoryDetails) as ConsultationCategory[]).map(
            (category) => {
              const detail = categoryDetails[category];
              const Icon = icons[category];
              return (
                <Link
                  className="group grid min-h-[86px] grid-cols-[46px_1fr_20px] items-center gap-3 rounded-xl border border-[#dbe5f5] bg-white p-3 no-underline shadow-[0_6px_18px_rgba(24,51,91,0.05)] transition duration-200 hover:border-[#1f5ed7] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#8db3ff] sm:flex sm:min-h-[300px] sm:flex-col sm:items-stretch sm:rounded-2xl sm:p-6 sm:hover:-translate-y-1 sm:hover:shadow-[0_14px_32px_rgba(31,94,215,0.1)]"
                  key={category}
                  to={`/consult/${category}`}
                >
                  <span className="hidden text-[11px] font-black text-[#99a6b8] sm:block">
                    {detail.number}
                  </span>
                  <span className="grid size-11 place-items-center rounded-xl bg-[#edf4ff] text-[#1f5ed7] sm:mt-7 sm:size-16 sm:rounded-2xl">
                    <Icon className="size-6 sm:size-8" />
                  </span>
                  <div><h2 className="text-[16px] font-black tracking-[-0.035em] text-[#1f2937] sm:mt-7 sm:text-[22px]">{detail.title}</h2><p className="mt-0.5 line-clamp-1 text-[11px] leading-5 text-[#6b7280] sm:mt-2 sm:line-clamp-none sm:text-[12px]">{detail.description}</p></div>
                  <span className="text-[#1f5ed7] sm:hidden">→</span>
                  <span className="mt-auto hidden min-h-11 items-center pt-7 text-[12px] font-black text-[#1f5ed7] sm:inline-flex">
                    선택하기{" "}
                    <span className="ml-1 transition group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              );
            },
          )}
        </div>
      </section>
    </main>
  );
}
