import Image from "next/image";
import Link from "next/link";
import { getCategories, getProductsByCategory } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // ISR cache revalidation

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  
  // Fetch all categories to find the current one, and products inside this category
  const [allCategories, products] = await Promise.all([
    getCategories(),
    getProductsByCategory(slug),
  ]);

  const currentCategory = allCategories.find((c) => c.slug === slug);
  const categoryName = currentCategory ? currentCategory.name : "Category";

  return (
    <div className="section-padding">
      <div className="container">
        {/* Category Header */}
        <div style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: "24px", marginBottom: "40px" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--primary-dark)", fontWeight: 600 }}>
            Collection
          </span>
          <h1 style={{ fontSize: "48px", marginTop: "8px" }}>{categoryName}</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
            Showing {products.length} custom creations. Select a cake below to customize flavor, size, and adding your message.
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "18px", color: "var(--text-muted)", marginBottom: "20px" }}>
              No cakes found in this category yet.
            </p>
            <Link href="/" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((prod) => (
              <div className="product-card" key={prod.id}>
                <div className="product-img-wrapper">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-title">{prod.name}</h3>
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
        )}
      </div>
    </div>
  );
}
