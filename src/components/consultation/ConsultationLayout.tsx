import type { ReactNode } from "react";
import { BackIcon } from "../common/Icons";
import ProgressIndicator from "./ProgressIndicator";

export default function ConsultationLayout({
  current,
  total,
  title,
  description,
  children,
  onBack,
  footer,
}: {
  current: number;
  total: number;
  title: string;
  description?: string;
  children: ReactNode;
  onBack: () => void;
  footer: ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-[#f8fafc] text-left sm:min-h-0">
      <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col px-4 pt-0 pb-[calc(76px+env(safe-area-inset-bottom))] sm:px-8 sm:pt-12 sm:pb-12">
        <div className="-mx-4 flex h-13 shrink-0 items-center justify-between border-b border-[#e5ebf3] bg-white px-4 sm:hidden">
          <button className="inline-flex min-h-11 min-w-11 cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[12px] font-bold text-[#526174]" type="button" onClick={onBack} aria-label="이전 질문"><BackIcon /></button>
          <strong className="text-[14px] font-black text-[#1f2937]">AI 상담</strong>
          <span className="min-w-11 text-right text-[11px] font-bold text-[#667085]">{current}/{total}</span>
        </div>
        <button
          className="mb-7 hidden min-h-11 w-fit cursor-pointer items-center gap-1 rounded-lg border-0 bg-transparent px-2 text-[12px] font-bold text-[#6b7280] hover:text-[#1f5ed7] sm:inline-flex"
          type="button"
          onClick={onBack}
        >
          <BackIcon /> 이전
        </button>
        <div className="mt-3 sm:hidden"><div className="h-1 overflow-hidden rounded-full bg-[#e5ebf3]"><span className="block h-full rounded-full bg-[#1f5ed7] transition-[width] duration-300" style={{ width: `${Math.max(0, Math.min(100, (current / total) * 100))}%` }} /></div></div>
        <div className="hidden sm:block"><ProgressIndicator current={current} total={total} /></div>
        <section className="mt-4 animate-[page-in_280ms_ease-out] sm:mt-9">
          <p className="hidden text-[12px] font-black tracking-[0.12em] text-[#1f5ed7] sm:block">
            QUESTION {String(current).padStart(2, "0")}
          </p>
          <h1 className="text-[21px] leading-[1.3] font-black tracking-[-0.04em] text-[#111827] sm:mt-3 sm:text-[36px]">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-[12px] leading-5 text-[#6b7280] sm:mt-3 sm:text-[14px] sm:leading-6">
              {description}
            </p>
          )}
          <div className="mt-4 sm:mt-8">{children}</div>
        </section>
        <div className="fixed right-0 bottom-0 left-0 z-30 border-t border-[#dbe5f5] bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] sm:static sm:mt-auto sm:border-0 sm:bg-transparent sm:px-0 sm:pt-10 sm:pb-0">
          <div className="mx-auto max-w-[900px]">{footer}</div>
        </div>
      </div>
    </main>
  );
}
