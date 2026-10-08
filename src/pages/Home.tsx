import { Link } from "react-router-dom";
import { ArrowIcon, SparkIcon, VideoIcon } from "../components/common/Icons";

export default function Home() {
  return (
    <main className="page-body home-page">
      <section className="brand-hero" aria-labelledby="brand-title">
        <div className="brand-hero-image"><img src="/man-pick-logo.png" alt="MAN-PICK 브랜드" width="1024" height="662" /><span className="hero-edition">HAIR · MAKEUP · SKIN</span></div>
        <div className="brand-hero-copy">
          <span className="eyebrow">YOUR DAILY, YOUR PICK</span>
          <h1 id="brand-title">나에게 맞는<br />관리의 시작.</h1>
          <p>헤어부터 피부까지, 나다운 인상을 만드는<br />작은 변화를 MAN-PICK과 함께하세요.</p>
        </div>
      </section>
      <Link className="video-entry" to="/videos">
        <span className="entry-icon"><VideoIcon className="size-5" /></span>
        <span><strong>브랜드 영상 보러가기</strong><small>헤어·메이크업·피부 사용법을 한곳에서</small></span>
        <ArrowIcon className="size-5" />
      </Link>
      <section className="ai-entry" aria-labelledby="ai-entry-title">
        <div className="ai-entry-top"><span className="ai-symbol"><SparkIcon className="size-5" /></span><span className="eyebrow">PERSONAL BEAUTY GUIDE</span><span className="ai-pill">AI 상담</span></div>
        <h2 id="ai-entry-title">어떤 고민이 있으세요?</h2>
        <p>고민은 가볍게, 선택은 나에게 맞게.<br />몇 가지 질문으로 관리 방향을 찾아보세요.</p>
        <Link className="app-button primary" to="/consult">AI 상담 시작하기 <ArrowIcon className="size-4" /></Link>
      </section>
      <footer className="home-footer"><span>MAN-PICK</span><small>나를 위한 선택, 매일의 작은 변화.</small></footer>
    </main>
  );
}
