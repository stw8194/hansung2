import { getConsultationQuestions } from "./consultation";
import { supabase } from "../lib/supabase/client";
import type { ConsultationCategory, ConsultationState } from "../types/consultation";

export type SurveyResult = {
  id: string;
  resultCode: string;
  category: ConsultationCategory;
  answerPath: string[];
  label: string;
  resultTitle: string;
  resultSummary: string;
  keywords: string[];
};

export type ProductRecommendation = {
  id: string;
  brand: string;
  name: string;
  description: string;
  imageUrl: string | null;
  productUrl: string;
  price: string | null;
  tags: string[];
  reason: string;
  priority: number;
};

export type RecommendationResult = {
  surveyResult: SurveyResult;
  products: ProductRecommendation[];
};

type SurveyResultRow = {
  id: string;
  result_code: string;
  category: ConsultationCategory;
  answer_path: string[];
  label: string;
  result_title: string;
  result_summary: string;
  keywords: string[];
};

type ProductRow = {
  id: string;
  brand: string;
  name: string;
  description: string | null;
  image_url: string | null;
  product_url: string;
  price: string | null;
  tags: string[] | null;
};

type RecommendationRow = {
  priority: number;
  recommendation_reason: string | null;
  products: ProductRow | ProductRow[];
};

export function getAnswerPath(state: ConsultationState) {
  return getConsultationQuestions(state)
    .map((question) => state.answers[question.id])
    .filter((answer): answer is string => Boolean(answer));
}

export async function resolveSurveyResult(state: ConsultationState): Promise<SurveyResult | null> {
  if (!state.category) return null;
  const { data, error } = await supabase
    .from("survey_results")
    .select("id, result_code, category, answer_path, label, result_title, result_summary, keywords")
    .eq("category", state.category)
    .eq("answer_path", JSON.stringify(getAnswerPath(state)))
    .maybeSingle();

  if (error) throw new Error(`상담 결과를 확인하지 못했습니다: ${error.message}`);
  if (!data) return null;
  const row = data as SurveyResultRow;
  return { id: row.id, resultCode: row.result_code, category: row.category, answerPath: row.answer_path, label: row.label, resultTitle: row.result_title, resultSummary: row.result_summary, keywords: row.keywords ?? [] };
}

export async function getRecommendations(state: ConsultationState): Promise<RecommendationResult | null> {
  const surveyResult = await resolveSurveyResult(state);
  if (!surveyResult) return null;

  const { data, error } = await supabase
    .from("product_recommendations")
    .select("priority, recommendation_reason, products!inner(id, brand, name, description, image_url, product_url, price, tags, is_active)")
    .eq("survey_result_id", surveyResult.id)
    .eq("products.is_active", true)
    .order("priority", { ascending: true });

  if (error) throw new Error(`추천 제품을 불러오지 못했습니다: ${error.message}`);

  const products = (data as unknown as RecommendationRow[]).flatMap((mapping) => {
    const product = Array.isArray(mapping.products) ? mapping.products[0] : mapping.products;
    if (!product) return [];
    return [{
      id: product.id,
      brand: product.brand,
      name: product.name,
      description: product.description ?? "",
      imageUrl: product.image_url,
      productUrl: product.product_url,
      price: product.price,
      tags: product.tags ?? [],
      reason: mapping.recommendation_reason ?? "선택하신 상담 조건에 맞춰 등록된 제품이에요.",
      priority: mapping.priority,
    }];
  });

  return { surveyResult, products };
}
