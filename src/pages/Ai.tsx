import { Link } from "react-router-dom";
import { clearConsultationState } from "../lib/consultationStorage";

export default function Ai() {
  return (
    <main className="conversation-page">
      <div className="conversation" aria-live="polite"><h1 className="bubble">안녕하세요! 어떤 분야의 상담을 원하시나요?</h1></div>
      <div className="answer-panel">
        <p className="subtle">답변을 선택해 주세요</p>
        <div className="answer-options">
          {([{ id: "hair", label: "헤어" }, { id: "makeup", label: "메이크업" }, { id: "skin", label: "피부" }] as const).map((category) => <Link className="app-button" key={category.id} to={`/consult/${category.id}`} onClick={clearConsultationState}>{category.label}</Link>)}
        </div>
      </div>
    </main>
  );
}
