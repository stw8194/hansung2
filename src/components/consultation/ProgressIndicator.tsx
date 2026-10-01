export default function ProgressIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percent = Math.max(0, Math.min(100, (current / total) * 100));
  return (
    <div aria-label={`상담 진행 ${current}/${total}`}>
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-[#1f5ed7]">AI 상담순서</span>
        <span className="text-[#8490a1]">
          {current} / {total}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e5ebf3]">
        <span
          className="block h-full rounded-full bg-[#1f5ed7] transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
