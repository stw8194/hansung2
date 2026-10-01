import type {
  ConsultationCategory,
  ConsultationState,
} from "../types/consultation";

export const CONSULTATION_STORAGE_KEY = "hri-consultation";
const categories: ConsultationCategory[] = ["skin", "hair", "makeup"];

export function isConsultationCategory(
  value: string | undefined,
): value is ConsultationCategory {
  return categories.includes(value as ConsultationCategory);
}

export function readConsultationState(): ConsultationState | null {
  try {
    const value = sessionStorage.getItem(CONSULTATION_STORAGE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as ConsultationState;
    return parsed.category &&
      isConsultationCategory(parsed.category) &&
      parsed.answers &&
      typeof parsed.answers === "object"
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function saveConsultationState(state: ConsultationState) {
  sessionStorage.setItem(CONSULTATION_STORAGE_KEY, JSON.stringify(state));
}

export function clearConsultationState() {
  sessionStorage.removeItem(CONSULTATION_STORAGE_KEY);
}
