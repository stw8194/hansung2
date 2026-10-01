import { Link } from "react-router-dom";
import { ArrowIcon, SparkIcon, VideoIcon } from "../components/common/Icons";
import Logo from "../components/common/Logo";

const services = [
  { eyebrow: "PERSONAL AI GUIDE", mobileTitle: "AI 상담하기", title: "AI 상담 후 구매 링크 제공", mobileDescription: "AI와 상담하고 나에게 맞는 제품을 찾아보세요.", description: "피부·헤어·메이크업 고민을 차근차근 선택하면 나에게 필요한 제품과 구매 가능한 외부 스토어를 연결해드려요.", cta: "AI 상담 시작", path: "/consult", icon: SparkIcon, primary: true },
  { eyebrow: "HOW-TO VIDEO", mobileTitle: "제품 사용방법", title: "제품 사용방법", mobileDescription: "제품을 더 쉽고 정확하게 사용하는 방법을 확인하세요.", description: "제품 구매에 그치지 않고 혼자서도 제대로 사용할 수 있도록 브랜드와 전문가의 영상을 모아 보여드려요.", cta: "영상 보기", path: "/videos", icon: VideoIcon, primary: false },
];

export default function Home() {
  return (
    <main className="mobile-home flex flex-1 items-center bg-white px-5 pt-7 pb-[calc(22px+env(safe-area-inset-bottom))] text-left sm:px-6 sm:py-16 md:bg-[#f8fafc] md:pb-16">
      <section className="mx-auto w-full max-w-[1120px]">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="md:hidden"><Logo hero /></div>
          <span className="hidden rounded-full border border-[#c9d9f3] bg-[#edf4ff] px-3 py-1.5 text-[10px] font-black tracking-[0.14em] text-[#1f5ed7] md:inline-flex">HRI BEAUTY GUIDE</span>
          <h1 className="mt-6 text-[16px] leading-[1.45] font-semibold tracking-[-0.025em] text-[#5f6672] sm:text-[34px] md:mt-5 md:text-[52px] md:leading-[1.18] md:font-black md:tracking-[-0.045em] md:text-[#111827]"><span className="md:hidden">AI 상담과 제품 사용 방법을 한 번에</span><span className="hidden md:inline">AI 상담과 제품 사용법을<br />한곳에</span></h1>
          <p className="mx-auto mt-3 hidden max-w-[600px] text-[13px] leading-6 text-[#6b7280] sm:block sm:text-[15px] sm:leading-7">복잡한 뷰티 제품 선택은 간단하게, 구매한 제품의 사용법은 정확하게. 훈남연구소가 선택부터 사용까지 함께합니다.</p>
        </div>
        <div className="mobile-service-list mt-8 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-6">
          {services.map((service) => (
            <Link className={`group grid min-h-[152px] grid-cols-[72px_1fr_20px] items-center gap-4 rounded-[22px] border border-[#e7ebf1] bg-white p-5 text-left text-[#111827] no-underline shadow-[0_10px_28px_rgba(30,49,80,0.12)] transition duration-200 hover:-translate-y-0.5 md:flex md:min-h-[290px] md:flex-col md:items-stretch md:rounded-[24px] md:p-9 md:hover:-translate-y-1 ${service.primary ? "md:border-[#1f5ed7] md:bg-[#1f5ed7] md:text-white" : "md:border-[#dbe5f5] md:hover:border-[#9bb7e8]"}`} key={service.path} to={service.path}>
              <span className={`grid size-[72px] place-items-center rounded-full bg-[#1f5ed7] text-white md:size-14 md:rounded-2xl ${service.primary ? "md:bg-white/14" : "md:bg-[#edf4ff] md:text-[#1f5ed7]"}`}><service.icon className="size-9 md:size-6" /></span>
              <div className="min-w-0 md:mt-10">
                <p className={`hidden text-[10px] font-black tracking-[0.14em] md:block ${service.primary ? "text-blue-100" : "text-[#73839b]"}`}>{service.eyebrow}</p>
                <h2 className={`text-[21px] font-black tracking-[-0.04em] text-[#1f5ed7] md:mt-2 md:text-[28px] ${service.primary ? "md:text-white" : "md:text-[#111827]"}`}><span className="md:hidden">{service.mobileTitle}</span><span className="hidden md:inline">{service.title}</span></h2>
                <p className={`mt-2 text-[13px] leading-[1.6] text-[#646c78] md:mt-3 md:max-w-[430px] md:text-[13px] md:leading-6 ${service.primary ? "md:text-blue-100" : "md:text-[#6b7280]"}`}><span className="md:hidden">{service.mobileDescription}</span><span className="hidden md:inline">{service.description}</span></p>
              </div>
              <span className="grid place-items-center text-[#1f5ed7] md:hidden"><ArrowIcon className="size-6" /></span>
              <span className="mt-auto hidden items-center gap-2 pt-7 text-[12px] font-black md:inline-flex">{service.cta} <ArrowIcon /></span>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-center text-[11px] text-[#9aa1ab] md:hidden">© 2026 HRI. All rights reserved.</p>
      </section>
    </main>
  );
}
