import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoThumbnail from "../components/common/VideoThumbnail";
import { fallbackVideos, getExpertVideos, videoCategories } from "./Consulting/consultingData";
import type { VideoCategory } from "./Consulting/consultingData";

export default function Consulting() {
  const [videos, setVideos] = useState(fallbackVideos);
  const [category, setCategory] = useState<VideoCategory>("헤어");
  useEffect(() => {
    let active = true;
    void getExpertVideos().then((data) => { if (active) setVideos(data); });
    return () => { active = false; };
  }, []);
  const visible = videos.filter((video) => video.category === category);
  return (
    <main className="page-body">
      <div className="video-page-heading"><span className="eyebrow">BEAUTY IN PRACTICE</span><h1>뷰티를 더 쉽게.</h1><p>직접 보고, 따라 하며 나만의 루틴을 만들어보세요.</p></div>
      <div className="video-tabs" role="tablist" aria-label="영상 분야">
        {videoCategories.map((item, index) => <button className={`app-button ${category === item ? "selected" : ""}`} key={item} id={`video-tab-${index}`} type="button" role="tab" tabIndex={category === item ? 0 : -1} aria-selected={category === item} aria-controls="video-panel" onClick={() => setCategory(item)} onKeyDown={(event) => {
          const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
          const next = delta ? (index + delta + videoCategories.length) % videoCategories.length : event.key === "Home" ? 0 : event.key === "End" ? videoCategories.length - 1 : null;
          if (next !== null) { event.preventDefault(); setCategory(videoCategories[next]); document.getElementById(`video-tab-${next}`)?.focus(); }
        }}>{item}</button>)}
      </div>
      <section id="video-panel" role="tabpanel" aria-labelledby={`video-tab-${videoCategories.indexOf(category)}`}>
        <div className="video-panel-heading"><h2>{category} 영상</h2><span>{visible.length}개의 가이드</span></div>
        <div className="video-list">
          {visible.map((video) => <Link className="video-card" key={video.id} to={`/videos/${video.id}`} aria-label={`${video.title} 영상 자세히 보기`}>
            <VideoThumbnail video={video} />
            <div className="video-source"><span>{video.category}</span><span aria-hidden="true">·</span>{video.expert_name}</div>
            <h3>{video.title}</h3><p>{video.summary}</p>
          </Link>)}
        </div>
      </section>
    </main>
  );
}
