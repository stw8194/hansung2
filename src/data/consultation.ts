import type {
  ConsultationCategory,
  ConsultationQuestion,
  ConsultationState,
} from "../types/consultation";

export const categoryDetails: Record<
  ConsultationCategory,
  {
    number: string;
    title: string;
    consultationLabel: string;
    description: string;
    icon: ConsultationCategory;
  }
> = {
  skin: {
    number: "01",
    title: "피부 고민",
    consultationLabel: "피부가 고민이에요",
    description: "수분/진정, 트러블/모공, 선케어/클렌징",
    icon: "skin",
  },
  hair: {
    number: "02",
    title: "헤어 고민",
    consultationLabel: "헤어가 고민이에요",
    description: "두피, 탈모, 손상모, 스타일링",
    icon: "hair",
  },
  makeup: {
    number: "03",
    title: "메이크업 고민",
    consultationLabel: "메이크업 제품을 찾고 있어요",
    description: "베이스, 포인트/커버, 메이크업 도구",
    icon: "makeup",
  },
};

const option = (
  value: string,
  title: string,
  description?: string,
  examples?: string[],
) => ({ value, title, description, examples });

const firstQuestions: Record<ConsultationCategory, ConsultationQuestion> = {
  skin: {
    id: "productType",
    title: "어떤 피부 제품을 찾고 계신가요?",
    description: "현재 가장 신경 쓰이는 피부 고민을 기준으로 골라주세요.",
    options: [
      option("hydration", "수분/진정 제품", "건조, 민감, 수분 부족 피부 고민"),
      option("trouble", "트러블/모공 제품", "여드름, 피지, 모공 피부 고민"),
      option("sunClean", "선케어/클렌징 제품", "자외선 차단, 클렌징 피부 고민"),
    ],
  },
  hair: {
    id: "productType",
    title: "어떤 목적으로 제품을 찾고 계세요?",
    description: "관리 목적에 가장 가까운 항목을 선택해주세요.",
    options: [
      option("care", "케어 제품", "두피와 모발을 건강하게 관리"),
      option("styling", "스타일링 제품", "고정력과 원하는 질감 연출"),
      option("device", "스타일링 기기", "볼륨과 모양을 만드는 기기"),
    ],
  },
  makeup: {
    id: "productType",
    title: "어떤 메이크업 제품을 찾고 계신가요?",
    description: "처음부터 세부 제품을 고르지 않아도 괜찮아요.",
    options: [
      option("base", "베이스 제품", "피부 톤과 결을 자연스럽게 정돈", [
        "쿠션",
        "복합파운데이션",
        "BB/CC크림",
        "톤업크림",
        "프라이머",
        "파우더",
      ]),
      option("point", "포인트 / 커버 제품", "필요한 부분만 섬세하게 보완", [
        "컨실러",
        "컬러 코렉터",
        "아이브로우",
        "립밤/틴트",
        "아이메이크업",
        "쉐딩/하이라이터",
      ]),
      option("tool", "메이크업 도구", "표현을 더 쉽고 깔끔하게", [
        "퍼프/스펀지",
        "브러쉬",
        "눈썹칼",
        "족집게/커터",
        "뷰러",
        "기름종이/거울",
      ]),
    ],
  },
};

export function getConsultationQuestions(
  state: ConsultationState,
): ConsultationQuestion[] {
  if (!state.category) return [];
  const questions = [firstQuestions[state.category]];
  const productType = state.answers.productType;

  if (state.category === "skin") {
    if (productType === "hydration")
      questions.push({
        id: "concern",
        title: "어떤 제형이나 타입을 선호하시나요?",
        options: [
          option("allInOne", "올인원", "하나로 편하게 하는 케어"),
          option("toner", "스킨/토너", "단계별로 많이 사용하는 제품"),
          option("cream", "수분크림/로션", "촉촉함이 오래 지속되는 제형"),
          option("other", "기타", "직접 선택"),
        ],
      });
    if (productType === "trouble")
      questions.push({
        id: "concern",
        title: "가장 고민되는 피부 상태는 무엇인가요?",
        options: [
          option("acne", "붉은 트러블·여드름"),
          option("pore", "모공·블랙헤드"),
          option("oil", "유분·피지"),
          option("other", "기타"),
        ],
      });
    if (productType === "sunClean")
      questions.push({
        id: "concern",
        title: "어떤 용도의 제품이 필요하신가요?",
        options: [
          option("sun", "자외선 차단"),
          option("cleansing", "클렌징"),
          option("deepClean", "강력 세안"),
          option("other", "기타"),
        ],
      });
  }

  if (state.category === "makeup") {
    if (productType === "base")
      questions.push({
        id: "concern",
        title: "피부 표현에서 가장 신경 쓰이는 부분은?",
        options: [
          "피부톤 정리",
          "잡티 커버",
          "모공 커버",
          "번들거림",
          "건조함",
          "지속력",
        ].map((title, index) =>
          option(
            ["tone", "blemish", "pore", "shine", "dry", "lasting"][index],
            title,
          ),
        ),
      });
    if (productType === "point")
      questions.push({
        id: "concern",
        title: "어떤 부분을 보완하고 싶으신가요?",
        options: [
          "잡티 가리기",
          "눈썹 정리",
          "입술 생기",
          "눈매 보완",
          "얼굴 윤곽",
          "자연스러운 표현",
        ].map((title, index) =>
          option(
            ["cover", "brow", "lip", "eye", "contour", "natural"][index],
            title,
          ),
        ),
      });
    if (productType === "tool")
      questions.push({
        id: "concern",
        title: "어떤 용도의 도구가 필요하신가요?",
        options: [
          "베이스 표현",
          "컨실러 커버",
          "눈썹 정리",
          "속눈썹 정리",
          "휴대 / 수정",
          "브러쉬 선택",
        ].map((title, index) =>
          option(
            [
              "baseTool",
              "concealerTool",
              "browTool",
              "lashTool",
              "portable",
              "brush",
            ][index],
            title,
          ),
        ),
      });
  }

  if (state.category === "hair") {
    if (productType === "care") {
      questions.push({
        id: "detail",
        title: "먼저 필요한 제품 형태를 알려주세요.",
        options: [
          option("shampoo", "샴푸 제품"),
          option("treatment", "트리트먼트 제품"),
          option("sprayCare", "분사형 제품"),
          option("leaveIn", "바르는 제품"),
        ],
      });
      if (state.answers.detail)
        questions.push({
          id: "concern",
          title: "가장 필요한 관리 방향은 무엇인가요?",
          options: [
            option("scalp", "두피 케어 제품"),
            option("damage", "모발 케어 제품"),
            option("loss", "탈모 케어 제품"),
            option("oily", "지성 케어 제품"),
          ],
        });
    }
    if (productType === "styling") {
      questions.push({
        id: "detail",
        title: "원하시는 스타일링 방식은 어느 쪽에 가까운가요?",
        options: [
          option("hard", "고정(하드) 제품", "스타일을 단단하게 유지"),
          option("soft", "연출(소프트) 제품", "자연스러운 결감과 윤기"),
        ],
      });
      if (state.answers.detail === "hard")
        questions.push({
          id: "concern",
          title: "고정하되 어떤 특징을 원하시나요?",
          options: [
            option("spray", "분사형 제품"),
            option("cream", "크림 제형 제품"),
            option("tube", "튜브형 제품"),
            option("brush", "브러쉬(왁싱)형 제품"),
          ],
        });
      if (state.answers.detail === "soft")
        questions.push({
          id: "concern",
          title: "어떤 키워드로 찾아드릴까요?",
          options: [
            option("cream", "크림 제품"),
            option("oil", "오일 제품"),
            option("grease", "기름 제품"),
            option("spray", "분사형 제품"),
          ],
        });
    }
    if (productType === "device")
      questions.push({
        id: "concern",
        title: "어떤 스타일링 기기를 찾으시나요?",
        options: [
          option("iron", "고데기 제품"),
          option("volume", "볼륨 제품"),
          option("down", "볼륨 제거 제품"),
        ],
      });
  }

  return questions;
}

export function getOptionLabel(
  state: ConsultationState,
  questionId: string,
  value: string,
) {
  return (
    getConsultationQuestions(state)
      .find((question) => question.id === questionId)
      ?.options.find((item) => item.value === value)?.title ?? value
  );
}

export function isConsultationComplete(state: ConsultationState) {
  if (!state.category) return false;
  const questions = getConsultationQuestions(state);
  return questions.length > 1 && questions.every((question) => Boolean(state.answers[question.id]));
}

const categoryAcknowledgements: Record<ConsultationCategory, string> = {
  skin: "피부 고민이 있으시군요. 조금 더 자세히 알아볼게요.",
  hair: "헤어 관련 제품을 찾고 계시는군요. 목적에 맞게 함께 좁혀볼게요.",
  makeup: "메이크업 제품을 찾고 계시는군요. 원하는 표현부터 확인해볼게요.",
};

const answerAcknowledgements: Record<string, string> = {
  "skin.productType.hydration": "수분과 진정 관리가 필요하시군요. 선호하는 제품 타입도 확인해볼게요.",
  "skin.productType.trouble": "트러블과 모공 관리가 필요하시군요. 가장 신경 쓰이는 부분을 알려주세요.",
  "skin.productType.sunClean": "선케어와 클렌징 제품을 찾고 계시는군요. 필요한 용도를 조금 더 확인해볼게요.",
  "hair.productType.care": "두피와 모발을 관리할 제품이 필요하시군요. 먼저 제품 형태를 골라볼게요.",
  "hair.productType.styling": "스타일링을 위한 제품을 찾고 계시는군요. 원하는 연출 방식을 확인해볼게요.",
  "hair.productType.device": "스타일링 기기를 찾고 계시는군요. 필요한 기능에 가까운 것을 알려주세요.",
  "hair.detail.shampoo": "샴푸 형태를 선호하시는군요. 가장 필요한 관리 방향도 확인할게요.",
  "hair.detail.treatment": "트리트먼트 제품을 찾고 계시는군요. 집중하고 싶은 관리를 알려주세요.",
  "hair.detail.sprayCare": "간편한 분사형 제품을 찾고 계시는군요. 어떤 관리가 필요한지 확인할게요.",
  "hair.detail.leaveIn": "바르는 타입의 제품을 찾고 계시는군요. 관리 목적을 조금 더 알려주세요.",
  "hair.detail.hard": "고정력이 필요한 스타일링이군요. 선호하는 사용 방식을 골라주세요.",
  "hair.detail.soft": "자연스러운 연출을 원하시는군요. 원하는 제형에 가까운 것을 알려주세요.",
  "makeup.productType.base": "자연스러운 피부 표현을 위한 제품이군요. 가장 신경 쓰이는 부분을 알려주세요.",
  "makeup.productType.point": "필요한 부분을 자연스럽게 보완하고 싶으시군요. 어느 부분인지 확인해볼게요.",
  "makeup.productType.tool": "메이크업을 더 쉽게 도와줄 도구가 필요하시군요. 사용 목적을 알려주세요.",
};

export function getConsultationAcknowledgement(state: ConsultationState, currentIndex: number) {
  if (!state.category) return "안녕하세요. 고민에 맞는 제품을 함께 찾아볼게요.";
  if (currentIndex === 0) return categoryAcknowledgements[state.category];
  const questions = getConsultationQuestions(state);
  const previousQuestion = questions[currentIndex - 1];
  const previousValue = previousQuestion ? state.answers[previousQuestion.id] : null;
  if (!previousQuestion || !previousValue) return categoryAcknowledgements[state.category];
  return answerAcknowledgements[`${state.category}.${previousQuestion.id}.${previousValue}`]
    ?? "선택해주신 내용을 확인했어요. 조금 더 자세히 알아볼게요.";
}
