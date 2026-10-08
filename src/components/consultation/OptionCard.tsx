import type { ConsultationOption } from "../../types/consultation";

export default function OptionCard({ option, selected, onSelect }: { option: ConsultationOption; selected: boolean; onSelect: () => void }) {
  return <button className={`app-button answer-option ${selected ? "selected" : ""}`} type="button" aria-pressed={selected} onClick={onSelect}><strong>{option.title}</strong>{option.description && <small>{option.description}</small>}</button>;
}
