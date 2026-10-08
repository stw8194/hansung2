import type { ProductRecommendation } from "../../data/products";

export default function ProductCard({ product, rank }: { product: ProductRecommendation; rank: number }) {
  const brand = product.brand === "HRI SELECT" ? "MAN-PICK SELECT" : product.brand;
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e5eaf0] bg-white">
      <div className="media-placeholder video rounded-none">
        {product.imageUrl ? <img className="absolute inset-0 h-full w-full object-cover" src={product.imageUrl} alt={`${brand} ${product.name}`} /> : <span className="media-label">추천 제품 {rank}<br />사진 준비 중</span>}
      </div>
      <div className="p-[18px]">
        <p className="subtle">{brand}</p>
        <h3 className="page-title mt-1">{product.name}</h3>
        <p className="page-copy">{product.description}</p>
        <div className="bubble max-w-full"><strong className="subtle font-medium">추천 이유</strong><p className="subtle">{product.reason}</p></div>
        <p className="page-copy subtle">{product.tags.map((tag) => `#${tag}`).join(" ")}</p>
        <p className="page-copy">{product.price ?? "가격 확인"}</p>
        <a className="app-button primary" href={product.productUrl} target="_blank" rel="noopener noreferrer">제품 자세히 보기 ↗</a>
      </div>
    </article>
  );
}
