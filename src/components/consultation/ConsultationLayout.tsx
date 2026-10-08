import type { ReactNode } from "react";

export default function ConsultationLayout({ current, total, title, description, acknowledgement, children, onBack, footer, conversation }: {
  current: number; total: number; title: string; description?: string; acknowledgement: string;
  children: ReactNode; onBack: () => void; footer?: ReactNode; conversation?: ReactNode;
}) {
  return (
    <main className="conversation-page">
      <div className="conversation" role="log" aria-live="polite" aria-relevant="additions text">
        {conversation}
        <div className="bubble"><p>{acknowledgement}</p><h1 className="mt-2">{title}</h1>{description && <p className="subtle mt-2">{description}</p>}</div>
      </div>
      <div className="answer-panel">
        <p className="subtle">답변을 선택해 주세요 · {current} / {total}</p>
        {children}
        <div className="inline-actions"><button className="app-button" type="button" onClick={onBack}>이전 선택</button>{footer}</div>
      </div>
    </main>
  );
}
