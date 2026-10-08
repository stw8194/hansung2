import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../components/recommendations/ProductCard";
import { categoryDetails, getOptionLabel, isConsultationComplete } from "../data/consultation";
import { getRecommendations } from "../data/products";
import type { RecommendationResult } from "../data/products";
import { clearConsultationState, readConsultationState, saveConsultationState } from "../lib/consultationStorage";
import { getSessionToken } from "../lib/auth";
import { saveMemberConsultation } from "../lib/member";
import type { ConsultationState } from "../types/consultation";

type LoadState = { status: "loading" } | { status: "ready"; data: RecommendationResult | null } | { status: "error"; message: string };

export default function Recommendations() {
  const location = useLocation();
  const routeState = (location.state as { consultation?: ConsultationState } | null)?.consultation;
  const consultation = useMemo(() => {
    const state = routeState ?? readConsultationState();
    return state ? { ...state, historyId: state.historyId ?? crypto.randomUUID() } : null;
  }, [routeState]);
  const isComplete = Boolean(consultation && isConsultationComplete(consultation));
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [requestKey, setRequestKey] = useState(0);
  const [historyStatus, setHistoryStatus] = useState<"idle" | "saved" | "error">("idle");
  const [historyRetry, setHistoryRetry] = useState(0);

  useEffect(() => {
    let active = true;
    if (consultation && isComplete) {
      void getRecommendations(consultation)
        .then((data) => { if (active) setLoadState({ status: "ready", data }); })
        .catch((error: unknown) => { if (active) setLoadState({ status: "error", message: error instanceof Error ? error.message : "추천 제품을 불러오지 못했습니다." }); });
    }
    return () => { active = false; };
  }, [consultation, isComplete, requestKey]);

  useEffect(() => {
    let active = true;
    if (consultation && isComplete) {
      saveConsultationState(consultation);
      if (getSessionToken()) void saveMemberConsultation(consultation)
        .then(() => { if (active) setHistoryStatus("saved"); })
        .catch(() => { if (active) setHistoryStatus("error"); });
    }
    return () => { active = false; };
  }, [consultation, isComplete, historyRetry]);

  if (!consultation?.category || !isComplete) return <IncompleteConsultation consultation={consultation} />;
  const localSummary = [
    categoryDetails[consultation.category].title.replace(" 고민", ""),
    ...Object.entries(consultation.answers).map(([questionId, value]) => getOptionLabel(consultation, questionId, value)),
  ];
  const result = loadState.status === "ready" ? loadState.data : null;
  const summaryText = result ? result.surveyResult.label.replaceAll(" > ", " · ") : localSummary.join(" · ");
  const retry = () => { setLoadState({ status: "loading" }); setRequestKey((key) => key + 1); };

  return (
    <main className="page-body">
      <div className="bubble max-w-full">
        <h1 className="page-title mt-0">{result?.surveyResult.resultTitle ?? "상담 결과를 확인하고 있어요"}</h1>
        <p className="page-copy">{result?.surveyResult.resultSummary ?? "선택해주신 답변에 맞는 추천 조건과 제품을 불러오고 있습니다."}</p>
        {result && result.surveyResult.keywords.length > 0 && <p className="page-copy subtle">추천 기준: {result.surveyResult.keywords.join(" · ")}</p>}
      </div>
      {loadState.status === "loading" && <p className="page-copy" role="status">추천 제품을 불러오는 중입니다.</p>}
      {loadState.status === "error" && <div role="alert"><h2 className="page-title">추천 제품을 불러오지 못했어요</h2><p className="page-copy">잠시 후 다시 시도해주세요.</p><button className="app-button" type="button" onClick={retry}>다시 불러오기</button></div>}
      {loadState.status === "ready" && (!result || result.products.length === 0) && <><h2 className="page-title">조건에 맞는 추천 제품을 준비 중이에요</h2><p className="page-copy">새로운 제품이 등록되면 이곳에서 바로 확인할 수 있습니다.</p></>}
      {result && result.products.length > 0 && <section><h2 className="page-title">추천 제품</h2><div className="result-products">{result.products.map((product, index) => <ProductCard key={product.id} product={product} rank={index + 1} />)}</div></section>}
      <h2 className="page-title">나의 상담 내용</h2>
      <p className="page-copy subtle">{summaryText}</p>
      {historyStatus === "saved" && <Link className="app-button menu-item" to="/my/history">저장된 상담 내역 보기 →</Link>}
      {historyStatus === "error" && <><p className="error-message" role="alert">상담 내역을 저장하지 못했습니다.</p><button className="app-button" type="button" onClick={() => setHistoryRetry((value) => value + 1)}>내역 저장 다시 시도</button></>}
      {!getSessionToken() && <Link className="app-button menu-item" to="/login" state={{ from: "/recommendations" }}>로그인하고 상담 내역 저장하기 →</Link>}
      <Link className="app-button primary" to="/consult" onClick={clearConsultationState}>다시 상담하기</Link>
      <p className="page-copy subtle">가격과 판매 여부는 외부 스토어에서 달라질 수 있습니다.</p>
    </main>
  );
}

function IncompleteConsultation({ consultation }: { consultation: ConsultationState | null }) {
  const destination = consultation?.category ? `/consult/${consultation.category}` : "/consult";
  return <main className="page-body"><h1 className="page-title">AI 상담을 끝까지 완료해주세요</h1><p className="page-copy">모든 질문에 답하면 상담 결과에 맞는 추천 제품을 확인할 수 있습니다.</p><Link className="app-button primary" to={destination}>AI 상담 계속하기</Link></main>;
}
