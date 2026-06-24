import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getProductsByCategory } from "@/lib/data";
import ProductForm from "@/components/ProductForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR cache revalidation

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="section-padding" style={{ textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>Cake Not Found</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>
            The cake you are looking for does not exist or has been removed.
          </p>
          <Link href="/" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Fetch related products in the same category
  const allCategoryProducts = await getProductsByCategory(product.category.slug);
  const relatedProducts = allCategoryProducts
    .filter((p) => p.slug !== slug && p.isActive !== false)
    .slice(0, 4);

  return (
    <div className="section-padding" style={{ backgroundColor: "var(--bg-cream)", minHeight: "100vh" }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: "36px" }}>
          <Link href="/" style={{ textDecoration: "none", transition: "color 0.2s" }}>Home</Link>
          <span style={{ margin: "0 10px", color: "var(--border-light)" }}>/</span>
          <Link href="/categories" style={{ textDecoration: "none", transition: "color 0.2s" }}>Collections</Link>
          <span style={{ margin: "0 10px", color: "var(--border-light)" }}>/</span>
          <Link href={`/categories/${product.category.slug}`} style={{ textDecoration: "none", transition: "color 0.2s", color: "var(--primary-dark)" }}>{product.category.name}</Link>
          <span style={{ margin: "0 10px", color: "var(--border-light)" }}>/</span>
          <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="detail-grid">
          {/* Left Column: Image with offset editorial frame & sticky positioning */}
          <div className="detail-image-sticky-wrapper">
            <div className="detail-image-container-wrapper">
              {/* Rotating Gold Seal */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="gold-seal-stamp">
                <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                <text fill="var(--primary-dark)" fontSize="7.8" fontWeight="600" letterSpacing="0.08em" fontFamily="var(--font-sans)">
                  <textPath href="#circlePath" startOffset="0%">
                    ✦ SADAF CAKES DUBAI ✦ SIGNATURE DESIGN
                  </textPath>
                </text>
                <polygon points="50,38 53,46 62,46 55,51 58,60 50,54 42,60 45,51 38,46 47,46" fill="var(--primary-gold)" />
              </svg>

              <div className="detail-image-frame-backdrop" />
              <div className="detail-img-container">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 991px) 100vw, 600px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Info & Form */}
          <div className="detail-info animate-fade-in-up" style={{ padding: "10px 0" }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--primary-gold)", fontWeight: 600, display: "block", marginBottom: "12px" }}>
              Sadaf Signature Collection
            </span>
            <h1 style={{ fontSize: "44px", fontFamily: "var(--font-serif)", fontWeight: "300", lineHeight: "1.15", marginBottom: "16px", color: "var(--text-main)" }}>
              {product.name}
            </h1>
            <div className="detail-price" style={{ fontSize: "32px", fontFamily: "var(--font-serif)", fontWeight: "400", color: "var(--primary-dark)", marginBottom: "24px" }}>
              AED {Number(product.price).toFixed(2)}
            </div>
            
            {/* Fine line divider */}
            <div style={{ width: "60px", height: "1px", backgroundColor: "var(--primary-gold)", marginBottom: "24px" }} />

            <p className="detail-desc" style={{ fontSize: "15px", lineHeight: "1.7", color: "var(--text-muted)", marginBottom: "30px" }}>
              {product.description}
            </p>

            {/* Customization Form */}
            <ProductForm
              product={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image,
                flavors: product.flavors,
                sizes: product.sizes,
              }}
            />

            {/* Premium Confectionery Badges with vector SVG icons */}
            <div style={{
              marginTop: "40px",
              paddingTop: "30px",
              borderTop: "1px solid var(--border-light)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px 30px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0-3 3.5 3 3 0 0 0 .5 5.5h13a3 3 0 0 0 .5-5.5 4 4 0 0 0-3-3.5 4 4 0 0 0-4-4z" />
                  <path d="M6 17h12v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
                </svg>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Freshly Baked to Order</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" />
                </svg>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Premium Ingredients</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <polyline points="12 4 15 7 12 10" />
                  <polyline points="12 20 9 17 12 14" />
                  <polyline points="4 12 7 15 10 12" />
                  <polyline points="20 12 17 9 14 12" />
                  <line x1="5.17" y1="5.17" x2="18.83" y2="18.83" />
                  <line x1="5.17" y1="18.83" x2="18.83" y2="5.17" />
                </svg>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Dubai Cold Delivery</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-gold)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Handcrafted Designs</span>
              </div>
            </div>

            {/* Interactive Accordions for Details, Ingredients, Shipping */}
            <details className="product-details-accordion" open>
              <summary className="product-details-summary">
                Description & Ingredients
                <span className="product-details-summary-icon">+</span>
              </summary>
              <div className="product-details-content">
                <p style={{ marginBottom: "10px" }}>
                  {product.description}
                </p>
                <p>
                  <strong>Ingredients:</strong> Fresh dairy cream, organic unbleached wheat flour, farm-fresh eggs, organic cane sugar, and natural flavor extracts. Baked fresh to order without any artificial shelf-life extenders or preservatives.
                </p>
              </div>
            </details>

            <details className="product-details-accordion">
              <summary className="product-details-summary">
                Delivery & Timing
                <span className="product-details-summary-icon">+</span>
              </summary>
              <div className="product-details-content">
                <p style={{ marginBottom: "10px" }}>
                  To ensure perfect presentation, we deliver all cakes in temperature-controlled refrigerated logistics vans directly to your venue in Dubai, Sharjah, or Ajman.
                </p>
                <p>
                  <strong>Lead Time:</strong> Please place your order at least 24 to 48 hours in advance. For same-day orders, please contact our helpline at 058 198 8276 to verify slot availability.
                </p>
              </div>
            </details>

            <details className="product-details-accordion">
              <summary className="product-details-summary">
                Cake Care & Storage
                <span className="product-details-summary-icon">+</span>
              </summary>
              <div className="product-details-content">
                <p style={{ marginBottom: "10px" }}>
                  Our cakes are freshly layered and decorated. Keep refrigerated upon arrival. 
                </p>
                <p>
                  <strong>Serving Instructions:</strong> For optimal flavor profile and texture, remove the cake from the refrigerator and allow it to rest at room temperature for 15 to 20 minutes before slicing. Best consumed within 48 hours.
                </p>
              </div>
            </details>
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "80px", borderTop: "1px solid var(--border-light)", paddingTop: "60px" }}>
            <h2 style={{
              fontSize: "32px",
              fontFamily: "var(--font-serif)",
              fontWeight: "300",
              textAlign: "center",
              marginBottom: "40px",
              letterSpacing: "0.03em",
              color: "var(--text-main)"
            }}>
              You May Also Like
            </h2>
            <div className="product-grid">
              {relatedProducts.map((prod) => (
                <div className="product-card" key={prod.id}>
                  <Link href={`/products/${prod.slug}`} style={{ display: "block" }}>
                    <div className="product-img-wrapper">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 280px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </Link>
                  <div className="product-info">
                    <Link href={`/products/${prod.slug}`}>
                      <h3 className="product-title">{prod.name}</h3>
                    </Link>
                    <p className="product-desc">{prod.description}</p>
                    <div className="product-footer">
                      <span className="product-price">AED {Number(prod.price).toFixed(2)}</span>
                      <Link href={`/products/${prod.slug}`} className="view-btn">
                        Select Options
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
