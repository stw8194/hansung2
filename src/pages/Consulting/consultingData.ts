import { supabase } from "../../lib/supabase/client";

export const videoCategories = ["헤어", "메이크업", "피부"] as const;
export type VideoCategory = (typeof videoCategories)[number];

export type ExpertVideo = {
  id: string; category: VideoCategory; title: string; summary: string;
  expert_name: string; expert_title: string; youtube_url: string | null;
  thumbnail_url: string | null; duration: string; published_at: string;
};

// Real YouTube links selected as temporary sample content.
export const fallbackVideos: ExpertVideo[] = [
  {
    "id": "41000000-0000-4000-8000-000000000001",
    "category": "헤어",
    "title": "요즘 이 머리만 해요. 현 시점 1티어 남자머리",
    "summary": "헤어 스타일링을 따라 해볼 수 있는 남성 헤어 가이드.",
    "expert_name": "문장군",
    "expert_title": "YouTube 크리에이터",
    "youtube_url": "https://www.youtube.com/watch?v=xhpF4qfuE9I",
    "thumbnail_url": null,
    "duration": "12:45",
    "published_at": "2026-10-04T00:00:00+09:00"
  },
  {
    "id": "41000000-0000-4000-8000-000000000002",
    "category": "피부",
    "title": "집에서 진짜 이렇게만 합니다... 남자 기본 피부관리 이것만 따라해보세요",
    "summary": "집에서 시작하는 남성 기초 피부 관리 가이드.",
    "expert_name": "다슈DASHU",
    "expert_title": "YouTube 크리에이터",
    "youtube_url": "https://www.youtube.com/watch?v=PozOZ3NqVO4",
    "thumbnail_url": null,
    "duration": "5:02",
    "published_at": "2026-10-04T00:00:00+09:00"
  },
  {
    "id": "41000000-0000-4000-8000-000000000004",
    "category": "메이크업",
    "title": "이렇게 5년을 했는데 티 절대 안남🙈 남자 메이크업 기초부터 알려드림ㅣ맨즈뷰티101 Ep.5",
    "summary": "자연스러운 남자 메이크업을 시작하는 기초 가이드.",
    "expert_name": "스완SWAN_현실남자관리",
    "expert_title": "YouTube 크리에이터",
    "youtube_url": "https://www.youtube.com/watch?v=PVZLVzW3ksM",
    "thumbnail_url": null,
    "duration": "8:13",
    "published_at": "2026-10-04T00:00:00+09:00"
  },
  {
    "id": "41000000-0000-4000-8000-000000000005",
    "category": "헤어",
    "title": "요즘 가르마 머리 하는 법#남자머리 #가르마",
    "summary": "가르마 스타일을 연출하는 짧은 헤어 튜토리얼.",
    "expert_name": "다슈DASHU",
    "expert_title": "YouTube 크리에이터",
    "youtube_url": "https://www.youtube.com/watch?v=ATW6tTvNzTw",
    "thumbnail_url": null,
    "duration": "2:15",
    "published_at": "2026-10-04T00:00:00+09:00"
  },
  {
    "id": "41000000-0000-4000-8000-000000000006",
    "category": "메이크업",
    "title": "[Eng Sub] 단돈 5만원으로 남자 데일리 메이크업 입문ㅣ초간단 왕초보 메이크업",
    "summary": "처음 시작하는 남성 데일리 메이크업 가이드.",
    "expert_name": "스완SWAN_현실남자관리",
    "expert_title": "YouTube 크리에이터",
    "youtube_url": "https://www.youtube.com/watch?v=RI15ljgxuSA",
    "thumbnail_url": null,
    "duration": "8:00",
    "published_at": "2026-10-04T00:00:00+09:00"
  },
  {
    "id": "41000000-0000-4000-8000-000000000007",
    "category": "피부",
    "title": "남자 기본적인 피부관리 이걸로 끝낸다 (아무것도 모르겠으면 그냥 이걸 보세요)",
    "summary": "기초부터 차근차근 살펴보는 남성 피부 관리 가이드.",
    "expert_name": "관리는 하고 살자",
    "expert_title": "YouTube 크리에이터",
    "youtube_url": "https://www.youtube.com/watch?v=ngcQxnXj5gI",
    "thumbnail_url": null,
    "duration": "14:24",
    "published_at": "2026-10-04T00:00:00+09:00"
  }
];

export function getYoutubeId(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const hostname = url.hostname.toLowerCase();
    let id: string | null = null;
    if (hostname === "youtu.be") id = url.pathname.split("/")[1];
    else if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(hostname)) {
      id = url.pathname === "/watch" ? url.searchParams.get("v") : /^\/(embed|shorts|live)\//.test(url.pathname) ? url.pathname.split("/")[2] : null;
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}

export function withDemoVideo(video: ExpertVideo): ExpertVideo {
  const demo = fallbackVideos.find((item) => item.id === video.id);
  return !getYoutubeId(video.youtube_url) && demo ? demo : video;
}

export function mergeExpertVideos(rows: ExpertVideo[]) {
  const videos = rows
    .map((video) => ({ ...video, category: (video.category as string) === "스킨케어" ? "피부" as const : video.category }))
    .filter((video) => videoCategories.includes(video.category))
    .map(withDemoVideo)
    .filter((video) => getYoutubeId(video.youtube_url));
  const present = new Set(videos.map((video) => video.id));
  return [...videos, ...fallbackVideos.filter((video) => !present.has(video.id))];
}

export async function getExpertVideos() {
  const { data, error } = await supabase.from("expert_videos")
    .select("id, category, title, summary, expert_name, expert_title, youtube_url, thumbnail_url, duration, published_at")
    .order("published_at", { ascending: false });
  return mergeExpertVideos(error ? [] : (data ?? []) as ExpertVideo[]);
}

export function getVideoThumbnail(video: ExpertVideo) {
  if (video.thumbnail_url) return video.thumbnail_url;
  const id = getYoutubeId(video.youtube_url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
