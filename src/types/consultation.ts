export type ConsultationCategory = "skin" | "hair" | "makeup";

export type ConsultationState = {
  historyId?: string;
  category: ConsultationCategory | null;
  answers: Record<string, string>;
};

export type ConsultationOption = {
  value: string;
  title: string;
  description?: string;
  examples?: string[];
};

export type ConsultationQuestion = {
  id: string;
  title: string;
  description?: string;
  options: ConsultationOption[];
};
