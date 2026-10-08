import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SaveVideoButton from "../../components/common/SaveVideoButton";
import { fallbackVideos, getExpertVideos, getYoutubeId } from "./consultingData";
import type { ExpertVideo } from "./consultingData";

export default function VideoDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState<ExpertVideo | null>(() => fallbackVideos.find((item) => item.id === id) ?? null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    void getExpertVideos().then((data) => { if (active) { setVideo(data.find((item) => item.id === id) ?? null); setLoaded(true); } });
    return () => { active = false; };
  }, [id]);
  const currentVideo = video?.id === id ? video : fallbackVideos.find((item) => item.id === id) ?? null;
  const youtubeId = currentVideo ? getYoutubeId(currentVideo.youtube_url) : null;
  return (
    <main className="page-body">
      <Link className="app-button mb-5" to="/videos">← 영상 목록</Link>
      {!currentVideo ? <p className="page-copy" role="status">{loaded ? "해당 영상을 찾을 수 없습니다." : "영상 정보를 불러오는 중입니다."}</p> : <>
        <div className="video-player">{youtubeId && <iframe key={youtubeId} src={`https://www.youtube-nocookie.com/embed/${youtubeId}?controls=1&playsinline=1&hl=ko&rel=0`} title={currentVideo.title} loading="eager" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />}</div>
        <div className="video-source"><span>{currentVideo.category}</span><span aria-hidden="true">·</span>{currentVideo.duration}<span aria-hidden="true">·</span>YouTube</div>
        <h1 className="video-detail-title">{currentVideo.title}</h1>
        <p className="page-copy">{currentVideo.summary}</p>
        <p className="page-copy subtle">{currentVideo.expert_name}</p>
        <div className="video-actions"><SaveVideoButton videoId={currentVideo.id} /></div>
      </>}
    </main>
  );
}
