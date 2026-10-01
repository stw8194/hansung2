import { supabase } from "../../lib/supabase/client";

export const videoCategories = ["헤어", "메이크업", "피부"] as const;
export type VideoCategory = (typeof videoCategories)[number];

export type ExpertVideo = {
  id: string;
  category: VideoCategory;
  title: string;
  summary: string;
  expert_name: string;
  expert_title: string;
  youtube_url: string | null;
  thumbnail_url: string | null;
  duration: string;
  published_at: string;
};

export const fallbackVideos: ExpertVideo[] = [
  {
    id: "41000000-0000-4000-8000-000000000001",
    category: "헤어",
    title: "왁스 양부터 다릅니다: 자연스러운 가르마 스타일링",
    summary:
      "모발 길이에 맞는 왁스 양과 손에 펴 바르는 방법부터 가르마 결을 살리는 순서까지 알려드립니다.",
    expert_name: "김현우",
    expert_title: "헤어 디자이너",
    youtube_url: null,
    thumbnail_url: null,
    duration: "08:24",
    published_at: "2026-06-10T10:00:00+09:00",
  },
  {
    id: "41000000-0000-4000-8000-000000000002",
    category: "피부",
    title: "선크림이 밀리지 않는 아침 스킨케어 순서",
    summary:
      "토너, 수분 크림, 선크림 사이에 얼마나 기다려야 하는지 실제 사용 순서로 설명합니다.",
    expert_name: "이서진",
    expert_title: "뷰티 에디터",
    youtube_url: null,
    thumbnail_url: null,
    duration: "06:18",
    published_at: "2026-06-08T10:00:00+09:00",
  },
  {
    id: "41000000-0000-4000-8000-000000000004",
    category: "메이크업",
    title: "티 나지 않게 피부 톤만 정리하는 베이스 사용법",
    summary:
      "컬러 선택과 소량 도포 방법, 경계가 생기지 않는 마무리 팁을 차근차근 보여드립니다.",
    expert_name: "정다은",
    expert_title: "메이크업 아티스트",
    youtube_url: null,
    thumbnail_url: null,
    duration: "07:42",
    published_at: "2026-06-02T10:00:00+09:00",
  },
];

export async function getExpertVideos() {
  const { data, error } = await supabase
    .from("expert_videos")
    .select(
      "id, category, title, summary, expert_name, expert_title, youtube_url, thumbnail_url, duration, published_at",
    )
    .order("published_at", { ascending: false });
  if (error || !data?.length) return fallbackVideos;
  const normalized = data
    .map((video) => ({
      ...video,
      category: video.category === "스킨케어" ? "피부" : video.category,
    }))
    .filter((video) =>
      videoCategories.includes(video.category as VideoCategory),
    ) as ExpertVideo[];
  return normalized.length ? normalized : fallbackVideos;
}

export function getYoutubeId(url: string | null) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
}

export function getVideoThumbnail(video: ExpertVideo) {
  if (video.thumbnail_url) return video.thumbnail_url;
  const youtubeId = getYoutubeId(video.youtube_url);
  return youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null;
}
