import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { CheckIcon } from "../components/common/Icons";
import ConsultationLayout from "../components/consultation/ConsultationLayout";
import OptionCard from "../components/consultation/OptionCard";
import { getConsultationAcknowledgement, getConsultationQuestions, getOptionLabel } from "../data/consultation";
import { isConsultationCategory, readConsultationState, saveConsultationState } from "../lib/consultationStorage";
import type { ConsultationState } from "../types/consultation";

export default function ConsultationWizard() {
  const { category } = useParams();
  const navigate = useNavigate();
  const validCategory = isConsultationCategory(category) ? category : null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const transitionTimer = useRef<number | null>(null);
  const [state, setState] = useState<ConsultationState>(() => {
    const saved = readConsultationState();
    return saved?.category === validCategory ? { ...saved, historyId: saved.historyId ?? crypto.randomUUID() } : { historyId: crypto.randomUUID(), category: validCategory, answers: {} };
  });
  const questions = useMemo(() => getConsultationQuestions(state), [state]);
  const question = questions[currentIndex];

  useEffect(() => () => {
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
  }, []);

  useEffect(() => {
    if (!isPreparing) return;
    const timer = window.setTimeout(() => navigate("/recommendations", { state: { consultation: state } }), 900);
    return () => window.clearTimeout(timer);
  }, [isPreparing, navigate, state]);

  if (!validCategory || !question) return <Navigate replace to="/consult" />;
  if (isPreparing) return <PreparingRecommendations />;

  const selectOption = (value: string) => {
    if (isChanging) return;
    const retainedIds = new Set(questions.slice(0, currentIndex + 1).map((item) => item.id));
    const answers = Object.fromEntries(Object.entries(state.answers).filter(([id]) => retainedIds.has(id)));
    answers[question.id] = value;
    const nextState: ConsultationState = { historyId: state.historyId, category: validCategory, answers };
    setState(nextState);
    saveConsultationState(nextState);
    setIsChanging(true);

    transitionTimer.current = window.setTimeout(() => {
      const nextQuestions = getConsultationQuestions(nextState);
      if (currentIndex >= nextQuestions.length - 1) setIsPreparing(true);
      else setCurrentIndex((index) => index + 1);
      setIsChanging(false);
    }, 380);
  };

  const goBack = () => {
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    setIsChanging(false);
    if (currentIndex > 0) setCurrentIndex((index) => index - 1);
    else navigate("/consult");
  };

  const totalSteps = validCategory === "hair" && state.answers.productType !== "device" ? 3 : 2;
  const categoryLabel = { hair: "헤어", makeup: "메이크업", skin: "피부" }[validCategory];
  const conversation = <><div className="bubble">안녕하세요! 어떤 분야의 상담을 원하시나요?</div><div className="bubble mine">{categoryLabel}</div>{questions.slice(0, currentIndex).map((item) => <div className="contents" key={item.id}><div className="bubble">{item.title}</div><div className="bubble mine">{getOptionLabel(state, item.id, state.answers[item.id])}</div></div>)}</>;

  return (
    <ConsultationLayout current={currentIndex + 1} total={totalSteps} title={question.title} description={question.description} acknowledgement={getConsultationAcknowledgement(state, currentIndex)} onBack={goBack} conversation={conversation} footer={<Link className="app-button" to="/consult">처음부터 선택</Link>}>
      <div className={`answer-options ${isChanging ? "pointer-events-none opacity-75" : ""}`} aria-busy={isChanging}>
        {question.options.map((item) => <OptionCard key={item.value} option={item} selected={state.answers[question.id] === item.value} onSelect={() => selectOption(item.value)} />)}
      </div>
    </ConsultationLayout>
  );
}

function PreparingRecommendations() {
  const items = ["주요 고민 확인", "제품 유형 확인", "관리 목적 확인"];
  return (
    <main className="conversation-page" role="status">
      <section className="conversation">
        <h1 className="bubble">답변을 바탕으로 추천 조건을 정리하고 있어요.</h1>
        <div className="bubble space-y-2">{items.map((item) => <p className="flex items-center gap-2 subtle" key={item}><CheckIcon className="size-3" />{item}</p>)}</div>
        <p className="subtle">조건에 맞는 제품을 찾고 있어요.</p>
      </section>
    </main>
  );
}
