import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ConsultationLayout from "../components/consultation/ConsultationLayout";
import OptionCard from "../components/consultation/OptionCard";
import { getConsultationQuestions } from "../data/consultation";
import {
  isConsultationCategory,
  readConsultationState,
  saveConsultationState,
} from "../lib/consultationStorage";
import type { ConsultationState } from "../types/consultation";

export default function ConsultationWizard() {
  const { category } = useParams();
  const navigate = useNavigate();
  const validCategory = isConsultationCategory(category) ? category : null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<ConsultationState>(() => {
    const saved = readConsultationState();
    return saved?.category === validCategory
      ? saved
      : { category: validCategory, answers: {} };
  });
  const questions = useMemo(() => getConsultationQuestions(state), [state]);
  const question = questions[currentIndex];

  if (!validCategory || !question) return <Navigate replace to="/consult" />;

  const selectOption = (value: string) => {
    setState((previous) => {
      const retainedIds = new Set(
        questions.slice(0, currentIndex + 1).map((item) => item.id),
      );
      const answers = Object.fromEntries(
        Object.entries(previous.answers).filter(([id]) => retainedIds.has(id)),
      );
      answers[question.id] = value;
      const next = { category: validCategory, answers };
      saveConsultationState(next);
      return next;
    });
  };

  const goNext = () => {
    if (!state.answers[question.id]) return;
    const latestQuestions = getConsultationQuestions(state);
    if (currentIndex >= latestQuestions.length - 1) {
      navigate("/recommendations", { state: { consultation: state } });
      return;
    }
    setCurrentIndex((index) => index + 1);
  };

  const goBack = () =>
    currentIndex > 0
      ? setCurrentIndex((index) => index - 1)
      : navigate("/consult");

  const optionGrid =
    question.options.length === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : question.options.length > 4
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2";
  const totalSteps = validCategory === "hair" && state.answers.productType !== "device" ? 3 : 2;
  return (
    <ConsultationLayout
      current={currentIndex + 1}
      total={totalSteps}
      title={question.title}
      description={question.description}
      onBack={goBack}
      footer={
        <button
          className="min-h-12 w-full cursor-pointer rounded-xl border-0 bg-[#1f5ed7] px-6 text-[14px] font-black text-white transition hover:bg-[#123c9f] disabled:cursor-not-allowed disabled:bg-[#cbd5e1]"
          type="button"
          disabled={!state.answers[question.id]}
          onClick={goNext}
        >
          {currentIndex === questions.length - 1 ? "추천 결과 보기" : "다음"}
        </button>
      }
    >
      <div className={`grid gap-2.5 sm:gap-3 ${optionGrid}`}>
        {question.options.map((item) => (
          <OptionCard
            key={item.value}
            option={item}
            selected={state.answers[question.id] === item.value}
            onSelect={() => selectOption(item.value)}
          />
        ))}
      </div>
    </ConsultationLayout>
  );
}
