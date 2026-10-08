import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { notifyAuthChange, signOut, subscribeAuth } from "../lib/auth";
import { getMemberDashboard, MemberAuthError, readProfilePhoto, setMemberSavedVideo, updateMemberPreferences, updateMemberProfile } from "../lib/member";
import type { MemberDashboard } from "../lib/member";
import { getOptionLabel } from "../data/consultation";
import { saveConsultationState } from "../lib/consultationStorage";

const labels = { hair: "헤어", makeup: "메이크업", skin: "피부" };

export default function Member() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<MemberDashboard | null>(null);
  const [nickname, setNickname] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [readingPhoto, setReadingPhoto] = useState(false);
  const [reload, setReload] = useState(0);
  const leaving = useRef(false);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const load = () => {
      if (leaving.current) return;
      const request = ++revision;
      void getMemberDashboard().then((data) => {
        if (!active || request !== revision || leaving.current) return;
        setDashboard(data); setNickname(data.nickname); setPhoto(data.photo); setError(""); setMessage("");
      }).catch((reason: unknown) => {
        if (!active || request !== revision || leaving.current) return;
        if (reason instanceof MemberAuthError) navigate("/login", { replace: true, state: { from: pathname } });
        else setError(reason instanceof Error ? reason.message : "회원 정보를 불러오지 못했습니다.");
      });
    };
    load();
    const unsubscribe = subscribeAuth(load);
    return () => { active = false; unsubscribe(); };
  }, [pathname, navigate, reload]);

  const run = async (action: () => Promise<unknown>, success: string) => {
    setBusy(true); setError(""); setMessage("");
    try {
      await action();
      const data = await getMemberDashboard();
      setDashboard(data); setMessage(success);
      return true;
    } catch (reason) {
      if (reason instanceof MemberAuthError) navigate("/login", { replace: true, state: { from: pathname } });
      else setError(reason instanceof Error ? reason.message : "변경 내용을 저장하지 못했습니다.");
      return false;
    } finally { setBusy(false); }
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (readingPhoto) return;
    if (await run(() => updateMemberProfile(nickname, photo), "프로필을 저장했습니다.")) {
      notifyAuthChange();
      navigate("/my");
    }
  };

  const selectPhoto = async (file: File | undefined) => {
    if (!file) return;
    setReadingPhoto(true); setError("");
    try { setPhoto(await readProfilePhoto(file)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "사진을 열지 못했습니다."); }
    finally { setReadingPhoto(false); }
  };

  const changeNotifications = async (notifications: boolean) => {
    const previous = dashboard?.notifications ?? false;
    setDashboard((current) => current ? { ...current, notifications } : current);
    if (!await run(() => updateMemberPreferences(notifications), "알림 수신 설정을 저장했습니다.")) {
      setDashboard((current) => current ? { ...current, notifications: previous } : current);
    }
  };

  const logout = async () => {
    setBusy(true); setError("");
    leaving.current = true;
    try { await signOut(); navigate("/", { replace: true }); }
    catch { leaving.current = false; setError("로그아웃하지 못했습니다. 다시 시도해 주세요."); }
    finally { setBusy(false); }
  };

  if (!dashboard) return <main className="page-body">{error ? <><p className="error-message" role="alert">{error}</p><button className="app-button" onClick={() => setReload((value) => value + 1)}>다시 불러오기</button></> : <p role="status">회원 정보를 불러오는 중입니다.</p>}</main>;

  return (
    <main className="page-body">
      {error && <p className="error-message" role="alert">{error}</p>}
      {message && <p className="success-message" role="status">{message}</p>}
      {pathname === "/my" && <>
        <div className="profile"><Avatar photo={dashboard.photo} /><div><h2 className="page-title mt-0">{dashboard.nickname}님</h2><Link className="app-button" to="/my/profile">프로필 수정</Link></div></div>
        <h2 className="page-title">나의 뷰티 활동</h2>
        <Link className="app-button menu-item" to="/my/history"><span>AI 상담 내역</span><span>{dashboard.history.length}건 →</span></Link>
        <Link className="app-button menu-item" to="/my/saved"><span>저장한 콘텐츠</span><span>{dashboard.savedVideos.length}건 →</span></Link>
        <h2 className="page-title">계정 관리</h2>
        <Link className="app-button menu-item" to="/my/settings"><span>계정 설정</span><span>→</span></Link>
        <button className="app-button menu-item" disabled={busy} onClick={() => void logout()}>로그아웃</button>
      </>}
      {pathname === "/my/profile" && <form className="app-form" onSubmit={(event) => void saveProfile(event)}>
        <Avatar photo={photo} />
        <label>닉네임<input className="app-input" required minLength={2} maxLength={30} value={nickname} disabled={busy} onChange={(event) => setNickname(event.target.value)} /></label>
        <label>프로필 사진<input className="app-input" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy || readingPhoto} onChange={(event) => { void selectPhoto(event.target.files?.[0]); event.target.value = ""; }} /></label>
        {readingPhoto && <p className="subtle" role="status">사진을 처리하고 있습니다.</p>}
        {photo && <button className="app-button" type="button" disabled={busy || readingPhoto} onClick={() => setPhoto(null)}>프로필 사진 삭제</button>}
        <button className="app-button primary" disabled={busy || readingPhoto} type="submit">{busy ? "저장 중…" : "변경 내용 저장"}</button>
      </form>}
      {pathname === "/my/history" && (dashboard.history.length ? dashboard.history.map((item) => <Link className="app-button menu-item" key={item.id} to="/recommendations" state={{ consultation: item }} onClick={() => saveConsultationState(item)}>
        <span>{item.category ? labels[item.category] : "뷰티"} 상담<small className="block subtle">{new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "medium" }).format(new Date(item.createdAt))}</small><small className="block subtle">{Object.entries(item.answers).map(([id, value]) => getOptionLabel(item, id, value)).join(" · ")}</small></span><span className="shrink-0">결과 보기 →</span>
      </Link>) : <><h2 className="page-title">아직 상담 내역이 없어요</h2><p className="page-copy">AI 상담을 완료하면 여기에 내역이 표시돼요.</p><Link className="app-button primary" to="/consult">AI 상담 시작하기</Link></>)}
      {pathname === "/my/saved" && (dashboard.savedVideos.length ? dashboard.savedVideos.map((video) => <div className="video-item" key={video.id}><Link className="app-button menu-item" to={`/videos/${video.id}`}><span>{video.title}<small className="block subtle">{video.category}</small></span><span className="shrink-0">보기 →</span></Link><button className="app-button subtle" disabled={busy} onClick={() => void run(() => setMemberSavedVideo(video.id, false), "저장을 취소했습니다.")}>저장 취소</button></div>) : <><h2 className="page-title">저장한 콘텐츠가 없어요</h2><p className="page-copy">영상 상세 화면에서 콘텐츠를 저장해 보세요.</p><Link className="app-button primary" to="/videos">콘텐츠 둘러보기</Link></>)}
      {pathname === "/my/settings" && <>
        <h2 className="page-title">계정 정보</h2><p className="page-copy">아이디: {dashboard.loginId}</p>
        <Link className="app-button menu-item" to="/my/profile">닉네임·프로필 수정 →</Link>
        <h2 className="page-title">알림 설정</h2>
        <label className="settings-row"><span>뷰티 콘텐츠 알림</span><input type="checkbox" checked={dashboard.notifications} disabled={busy} onChange={(event) => void changeNotifications(event.target.checked)} /></label>
        <p className="subtle">알림 수신 여부를 계정에 저장합니다.</p>
      </>}
    </main>
  );
}

function Avatar({ photo }: { photo: string | null }) {
  return <div className="avatar">{photo ? <img src={photo} alt="프로필 사진" /> : <span>프로필<br />사진</span>}</div>;
}
