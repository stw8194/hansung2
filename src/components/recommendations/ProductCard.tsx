import { ArrowIcon, ProductIcon } from "../common/Icons";
import type { ProductRecommendation } from "../../data/products";

export default function ProductCard({ product, rank }: { product: ProductRecommendation; rank: number }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#dbe5f5] bg-white shadow-[0_8px_24px_rgba(24,51,91,0.06)]">
      <div className="grid min-h-[180px] place-items-center overflow-hidden bg-[#f2f6fb] text-[#8ba3c4]">
        {product.imageUrl ? (
          <img className="h-[180px] w-full object-cover" src={product.imageUrl} alt={`${product.brand} ${product.name}`} />
        ) : (
          <div className="text-center"><ProductIcon className="mx-auto size-12" /><span className="mt-2 block text-[10px] font-black tracking-[0.12em]">PRODUCT {String(rank).padStart(2, "0")}</span></div>
        )}
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black tracking-[0.08em] text-[#8190a4]">{product.brand}</p>
        <h2 className="mt-1.5 text-[18px] font-black tracking-[-0.03em] text-[#1f2937]">{product.name}</h2>
        <p className="mt-2 text-[12px] leading-5 text-[#6b7280]">{product.description}</p>
        <div className="mt-4 rounded-xl bg-[#edf4ff] p-3"><strong className="text-[10px] text-[#1f5ed7]">추천 이유</strong><p className="mt-1 text-[11px] leading-5 text-[#46566d]">{product.reason}</p></div>
        <div className="mt-4 flex flex-wrap gap-1.5">{product.tags.map((tag) => <span className="rounded-full border border-[#dbe5f5] px-2.5 py-1 text-[10px] font-bold text-[#607089]" key={tag}>#{tag}</span>)}</div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <strong className="text-[15px] text-[#111827]">{product.price ?? "가격 확인"}</strong>
          <a className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-[#1f5ed7] px-4 text-[12px] font-black text-white no-underline hover:bg-[#123c9f] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#8db3ff]" href={product.productUrl} target="_blank" rel="noopener noreferrer">제품 자세히 보기 <ArrowIcon /></a>
        </div>
      </div>
    </article>
  );
}
