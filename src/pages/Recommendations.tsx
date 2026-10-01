import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../components/recommendations/ProductCard";
import { categoryDetails, getOptionLabel, isConsultationComplete } from "../data/consultation";
import { getRecommendations } from "../data/products";
import type { RecommendationResult } from "../data/products";
import { clearConsultationState, readConsultationState } from "../lib/consultationStorage";
import type { ConsultationState } from "../types/consultation";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; data: RecommendationResult | null }
  | { status: "error"; message: string };

export default function Recommendations() {
  const location = useLocation();
  const routeState = (location.state as { consultation?: ConsultationState } | null)?.consultation;
  const consultation = useMemo(() => routeState ?? readConsultationState(), [routeState]);
  const isComplete = Boolean(consultation && isConsultationComplete(consultation));
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (consultation && isComplete) {
      void getRecommendations(consultation)
        .then((data) => { if (active) setLoadState({ status: "ready", data }); })
        .catch((error: unknown) => { if (active) setLoadState({ status: "error", message: error instanceof Error ? error.message : "추천 제품을 불러오지 못했습니다." }); });
    }
    return () => { active = false; };
  }, [consultation, isComplete, requestKey]);

  if (!consultation?.category || !isComplete) return <IncompleteConsultation consultation={consultation} />;

  const localSummary = [
    categoryDetails[consultation.category].title.replace(" 고민", ""),
    ...Object.entries(consultation.answers).map(([questionId, value]) => getOptionLabel(consultation, questionId, value)),
  ];
  const summaryText = loadState.status === "ready" && loadState.data
    ? loadState.data.surveyResult.label.replaceAll(" > ", " · ")
    : localSummary.join(" · ");

  const retry = () => {
    setLoadState({ status: "loading" });
    setRequestKey((key) => key + 1);
  };

  return (
    <main className="flex-1 bg-[#f8fafc] px-4 py-8 pb-24 text-left sm:px-6 sm:py-14 md:pb-14">
      <section className="mx-auto max-w-[1120px]">
        <div className="text-center">
          <p className="text-[10px] font-black tracking-[0.14em] text-[#1f5ed7] sm:text-[11px]">PERSONAL RECOMMENDATION</p>
          <h1 className="mt-2 text-[28px] font-black tracking-[-0.05em] text-[#111827] sm:mt-3 sm:text-[42px]">당신에게 맞는 제품을 찾았어요</h1>
          <p className="mt-2 text-[12px] text-[#6b7280] sm:mt-3 sm:text-[13px]">선택한 고민을 바탕으로 우선순위가 높은 제품을 정리했습니다.</p>
          <div className="mx-auto mt-4 max-w-[720px] cursor-default rounded-xl bg-[#eef3f8] px-4 py-3 text-left sm:mt-5 sm:px-5">
            <p className="text-[10px] font-bold text-[#7b8798]">나의 상담 결과</p>
            <p className="mt-1 text-[12px] leading-5 font-semibold text-[#526174] sm:text-[13px]">{summaryText}</p>
            {loadState.status === "ready" && loadState.data && <p className="mt-1 text-[9px] text-[#98a2b3]">{loadState.data.surveyResult.resultCode}</p>}
          </div>
        </div>

        {loadState.status === "loading" && <LoadingState />}
        {loadState.status === "error" && <MessageState title="추천 제품을 불러오지 못했어요" description="잠시 후 다시 시도해주세요." action={<button className="min-h-11 cursor-pointer rounded-xl border-0 bg-[#1f5ed7] px-5 text-[12px] font-black text-white" type="button" onClick={retry}>다시 불러오기</button>} />}
        {loadState.status === "ready" && (!loadState.data || loadState.data.products.length === 0) && <MessageState title="조건에 맞는 추천 제품을 준비 중이에요" description="새로운 제품이 등록되면 이곳에서 바로 확인할 수 있습니다." />}
        {loadState.status === "ready" && loadState.data && loadState.data.products.length > 0 && <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-3">{loadState.data.products.map((product, index) => <ProductCard key={product.id} product={product} rank={index + 1} />)}</div>}

        <div className="mt-9 text-center sm:mt-10">
          <Link className="inline-flex min-h-12 items-center rounded-xl border border-[#cddaf0] bg-white px-6 text-[13px] font-black text-[#1f5ed7] no-underline hover:border-[#1f5ed7]" to="/consult" onClick={clearConsultationState}>다시 상담하기</Link>
          <p className="mt-4 text-[10px] leading-5 text-[#8a96a8]">가격과 판매 여부는 외부 스토어에서 달라질 수 있습니다.</p>
        </div>
      </section>
    </main>
  );
}

function LoadingState() {
  return <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-3" aria-label="추천 제품 불러오는 중">{[1, 2, 3].map((item) => <div className="h-[390px] animate-pulse rounded-2xl border border-[#e4eaf2] bg-white" key={item}><div className="h-[180px] bg-[#eef2f7]" /><div className="space-y-3 p-5"><div className="h-3 w-1/3 rounded bg-[#e8edf3]" /><div className="h-5 w-2/3 rounded bg-[#e8edf3]" /><div className="h-14 rounded bg-[#f1f4f8]" /></div></div>)}</div>;
}

function MessageState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="mt-8 rounded-2xl border border-[#dbe5f5] bg-white px-5 py-12 text-center sm:mt-10"><h2 className="text-[18px] font-black text-[#1f2937]">{title}</h2><p className="mt-2 text-[12px] text-[#7b8798]">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

function IncompleteConsultation({ consultation }: { consultation: ConsultationState | null }) {
  const destination = consultation?.category ? `/consult/${consultation.category}` : "/consult";
  return <main className="grid flex-1 place-items-center bg-[#f8fafc] px-5 pb-24"><section className="max-w-md text-center"><h1 className="text-[27px] font-black tracking-[-0.04em] text-[#111827]">AI 상담을 끝까지 완료해주세요</h1><p className="mt-3 text-[13px] leading-6 text-[#6b7280]">모든 질문에 답하면 상담 결과에 맞는 추천 제품을 확인할 수 있습니다.</p><Link className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-[#1f5ed7] px-6 text-[13px] font-black text-white no-underline" to={destination}>AI 상담 계속하기</Link></section></main>;
}
