import { CheckIcon } from "../common/Icons";
import type { ConsultationOption } from "../../types/consultation";

export default function OptionCard({
  option,
  selected,
  onSelect,
}: {
  option: ConsultationOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`group min-h-[66px] cursor-pointer rounded-xl border p-3 text-left transition duration-200 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#8db3ff] sm:min-h-[116px] sm:rounded-2xl sm:p-5 ${selected ? "border-[#1f5ed7] bg-[#edf4ff] shadow-[0_8px_20px_rgba(31,94,215,0.1)]" : "border-[#dbe5f5] bg-white hover:border-[#9db9ed]"}`}
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <strong className="block text-[14px] font-black text-[#1f2937] sm:text-[15px]">
            {option.title}
          </strong>
          {option.description && (
            <p className="mt-0.5 line-clamp-1 text-[11px] leading-5 text-[#6b7280] sm:mt-2 sm:line-clamp-none sm:text-[12px]">
              {option.description}
            </p>
          )}
        </div>
        <span
          className={`grid size-5 shrink-0 place-items-center rounded-full border transition sm:size-6 ${selected ? "border-[#1f5ed7] bg-[#1f5ed7] text-white" : "border-[#cdd8e7] text-transparent"}`}
        >
          <CheckIcon />
        </span>
      </div>
      {option.examples && (
        <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
          {option.examples.map((example) => (
            <span
              className="rounded-md bg-[#f1f5f9] px-2 py-1 text-[10px] font-semibold text-[#778293]"
              key={example}
            >
              {example}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
