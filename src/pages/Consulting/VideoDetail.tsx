import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PlayIcon } from "../Consulting";
import {
  fallbackVideos,
  getExpertVideos,
  getYoutubeId,
} from "./consultingData";
import type { ExpertVideo } from "./consultingData";

export default function VideoDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState<ExpertVideo | null>(
    () => fallbackVideos.find((item) => item.id === id) ?? null,
  );
  useEffect(() => {
    let active = true;
    void getExpertVideos().then((data) => {
      if (active) setVideo(data.find((item) => item.id === id) ?? null);
    });
    return () => {
      active = false;
    };
  }, [id]);
  if (!video)
    return (
      <main className="grid min-h-[480px] flex-1 place-items-center">
        <Link to="/videos">영상 목록으로</Link>
      </main>
    );
  const youtubeId = getYoutubeId(video.youtube_url);
  return (
    <main className="flex-1 bg-[#f8fafc] pb-24 text-left md:pb-0">
      <section className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 sm:py-11">
        <Link
          className="inline-flex min-h-11 items-center text-[13px] font-bold text-[#748092] no-underline hover:text-[#1f5ed7]"
          to="/videos"
        >
          ← 영상 목록
        </Link>
        <div className="mt-3 overflow-hidden rounded-2xl bg-[#111827] shadow-[0_18px_45px_rgba(14,27,47,0.16)]">
          {youtubeId ? (
            <iframe
              className="aspect-video w-full border-0"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="grid aspect-video place-items-center bg-[#dfeafb] px-5 text-center">
              <div>
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-white text-[#1f5ed7] shadow-lg">
                  <PlayIcon />
                </span>
              </div>
            </div>
          )}
        </div>
        <article className="mt-6 rounded-2xl border border-[#dbe5f5] bg-white px-5 py-6 sm:px-9 sm:py-8">
          <span className="rounded-full bg-[#edf4ff] px-3 py-1 text-[11px] font-bold text-[#1f5ed7]">
            {video.category}
          </span>
          <h1 className="mt-4 text-[24px] leading-[1.35] font-black tracking-[-0.04em] text-[#111827] sm:text-[30px]">
            {video.title}
          </h1>
          <p className="mt-4 text-[13px] font-bold text-[#536176]">
            HRI 영상 <span className="font-normal text-[#8a96a8]">· {video.category}</span>
          </p>
          <p className="mt-7 border-t border-[#e9eef5] pt-7 text-[14px] leading-7 text-[#596678]">
            {video.summary}
          </p>
        </article>
      </section>
    </main>
  );
}
