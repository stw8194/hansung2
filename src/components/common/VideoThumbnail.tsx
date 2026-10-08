import { useState } from "react";
import { getVideoThumbnail } from "../../pages/Consulting/consultingData";
import type { ExpertVideo } from "../../pages/Consulting/consultingData";

export default function VideoThumbnail({ video }: { video: ExpertVideo }) {
  const [imageMissing, setImageMissing] = useState(false);
  const thumbnail = getVideoThumbnail(video);
  return <div className="video-thumbnail">
    {thumbnail && !imageMissing && <img src={thumbnail} alt={`${video.title} 미리보기`} loading="lazy" onError={() => setImageMissing(true)} />}
    <span className="video-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7Z" /></svg></span>
    <span className="video-duration">{video.duration}</span>
  </div>;
}
