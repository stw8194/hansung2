import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HairIcon, MakeupIcon, SkinIcon } from "../components/common/Icons";
import { fallbackVideos, getExpertVideos, getVideoThumbnail, videoCategories } from "./Consulting/consultingData";
import type { ExpertVideo, VideoCategory } from "./Consulting/consultingData";

const categoryStyle = {
  헤어: { icon: HairIcon, tile: "border-[#c9dafa] bg-[#eff5ff] text-[#376dd6]" },
  메이크업: { icon: MakeupIcon, tile: "border-[#dfcef4] bg-[#f5effc] text-[#8062c7]" },
  피부: { icon: SkinIcon, tile: "border-[#cee7c7] bg-[#f0faec] text-[#469549]" },
} satisfies Record<VideoCategory, { icon: typeof HairIcon; tile: string }>;

export default function Consulting() {
  const [videos, setVideos] = useState<ExpertVideo[]>(fallbackVideos);
  const [category, setCategory] = useState<VideoCategory | null>(null);

  useEffect(() => {
    let active = true;
    void getExpertVideos().then((data) => { if (active) setVideos(data); });
    return () => { active = false; };
  }, []);

  const visibleVideos = useMemo(() => category ? videos.filter((video) => video.category === category) : videos, [category, videos]);

  return (
    <main className="flex-1 bg-white px-4 pt-5 pb-[calc(76px+env(safe-area-inset-bottom))] text-left sm:bg-[#f8fafc] sm:px-6 sm:py-14 md:pb-14">
      <section className="mx-auto w-full max-w-[1120px]">
        <header className="sm:text-center">
          <p className="hidden text-[11px] font-black tracking-[0.14em] text-[#1f5ed7] sm:block">PRODUCT HOW-TO</p>
          <h1 className="text-[25px] font-black tracking-[-0.05em] text-[#111827] sm:mt-3 sm:text-[42px]">영상</h1>
          <p className="mt-2 text-[13px] leading-6 font-medium text-[#6b7280] sm:mx-auto sm:mt-3 sm:max-w-[560px] sm:text-[15px]">브랜드 유튜브 채널과 연결된 영상 콘텐츠</p>
        </header>

        <div className="mt-5 grid grid-cols-3 gap-2.5 sm:hidden" role="tablist" aria-label="영상 카테고리">
          {videoCategories.map((item) => {
            const style = categoryStyle[item];
            const Icon = style.icon;
            return <button className={`grid min-h-[112px] cursor-pointer place-items-center rounded-2xl border p-2 transition ${style.tile} ${category === item ? "ring-2 ring-current ring-offset-2" : ""}`} key={item} type="button" role="tab" aria-selected={category === item} onClick={() => setCategory((current) => current === item ? null : item)}><span className="flex flex-col items-center gap-2"><Icon className="size-10" /><strong className="text-[15px] font-black">{item}</strong></span></button>;
          })}
        </div>

        <div className="mx-auto mt-8 hidden max-w-[620px] grid-cols-3 rounded-xl border border-[#dbe5f5] bg-white p-1 sm:grid" role="tablist" aria-label="영상 카테고리">
          {videoCategories.map((item) => <button className={`min-h-11 cursor-pointer rounded-lg border-0 text-[12px] font-black transition ${category === item ? "bg-[#1f5ed7] text-white" : "bg-transparent text-[#667085] hover:bg-[#edf4ff]"}`} key={item} type="button" role="tab" aria-selected={category === item} onClick={() => setCategory((current) => current === item ? null : item)}>{item}</button>)}
        </div>

        <div className="mt-7 flex items-center justify-between sm:mt-9"><h2 className="text-[18px] font-black tracking-[-0.035em] text-[#111827] sm:hidden">{category ? `${category} 영상` : "추천 영상"}</h2>{category && <button className="ml-auto min-h-10 cursor-pointer border-0 bg-transparent text-[12px] font-bold text-[#7b8491] sm:hidden" type="button" onClick={() => setCategory(null)}>전체 보기 ›</button>}</div>

        {visibleVideos.length ? (
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-6 sm:mt-0 sm:gap-x-6 sm:gap-y-9 lg:grid-cols-3">{visibleVideos.map((video) => <VideoCard key={video.id} video={video} />)}</div>
        ) : (
          <div className="mt-3 rounded-2xl border border-[#dbe5f5] bg-white px-6 py-16 text-center text-[13px] text-[#7a8698]">이 카테고리의 영상이 준비 중입니다.</div>
        )}
      </section>
    </main>
  );
}

function VideoCard({ video }: { video: ExpertVideo }) {
  const thumbnail = getVideoThumbnail(video);
  return (
    <Link className="group block min-w-0 text-left no-underline" to={`/videos/${video.id}`}>
      <div className="relative aspect-[1.42] overflow-hidden rounded-xl bg-[#e5e9ee] sm:aspect-video sm:rounded-2xl">
        {thumbnail ? <img className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" src={thumbnail} alt={`${video.title} 영상 미리보기`} /> : <div className="absolute inset-0 grid place-items-center text-[#1f5ed7]"><span className="grid size-10 place-items-center rounded-full bg-white/90 shadow-[0_6px_18px_rgba(31,94,215,0.18)] sm:size-14"><PlayIcon /></span></div>}
        <span className="absolute top-2 left-2 hidden rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-[#1f5ed7] sm:block">{video.category}</span>
        <span className="absolute right-1.5 bottom-1.5 rounded-md bg-[#111827]/75 px-1.5 py-0.5 text-[9px] font-bold text-white sm:right-3 sm:bottom-3 sm:px-2 sm:py-1 sm:text-[10px]">{video.duration}</span>
      </div>
      <div className="pt-2 sm:pt-4">
        <h2 className="line-clamp-2 text-[13px] leading-[1.4] font-black tracking-[-0.025em] text-[#1f2937] group-hover:text-[#1f5ed7] sm:text-[17px] sm:leading-[1.45]">{video.title}</h2>
        <p className="mt-2 hidden line-clamp-2 text-[12px] leading-5 text-[#6b7280] sm:block">{video.summary}</p>
        <p className="mt-1 text-[11px] text-[#8a919c] sm:mt-3 sm:font-bold sm:text-[#536176]">HRI 영상 <span className="font-normal text-[#8a96a8]">· {video.category}</span></p>
      </div>
    </Link>
  );
}

export function PlayIcon() {
  return <svg className="ml-0.5 size-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z" /></svg>;
}
