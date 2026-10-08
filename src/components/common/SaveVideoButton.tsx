import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSessionToken, subscribeAuth } from "../../lib/auth";
import { getMemberDashboard, MemberAuthError, setMemberSavedVideo } from "../../lib/member";

export default function SaveVideoButton({ videoId }: { videoId: string }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const load = () => {
      if (!getSessionToken()) { if (active) setSaved(false); return; }
      void getMemberDashboard().then((data) => { if (active) setSaved(data.savedVideos.some((video) => video.id === videoId)); }).catch(() => {});
    };
    load();
    const unsubscribe = subscribeAuth(load);
    return () => { active = false; unsubscribe(); };
  }, [videoId]);
  const toggle = async () => {
    setBusy(true); setError("");
    try {
      const data = await getMemberDashboard();
      const next = !data.savedVideos.some((video) => video.id === videoId);
      await setMemberSavedVideo(videoId, next);
      setSaved(next);
    } catch (reason) {
      if (reason instanceof MemberAuthError) navigate("/login", { state: { from: pathname } });
      else setError(reason instanceof Error ? reason.message : "콘텐츠를 저장하지 못했습니다.");
    } finally { setBusy(false); }
  };
  return <><button className="app-button primary" type="button" disabled={busy} aria-pressed={saved} onClick={() => void toggle()}>{busy ? "처리 중…" : saved ? "저장 취소" : "이 콘텐츠 저장"}</button>{error && <p className="error-message" role="alert">{error}</p>}</>;
}
