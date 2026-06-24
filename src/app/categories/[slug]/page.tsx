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
    <div>
      {/* Category Parallax Banner */}
      <div
        style={{
          position: "relative",
          height: "350px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(to bottom, rgba(36, 32, 28, 0.6), rgba(36, 32, 28, 0.6)), url('${currentCategory?.image || "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=1600&auto=format&fit=crop&q=80"}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          color: "white",
          textAlign: "center",
        }}
      >
        <div className="container animate-fade-in-up">
          <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--primary-gold)", fontWeight: 600, display: "block", marginBottom: "12px" }}>
            Collection
          </span>
          <h1 style={{ fontSize: "56px", fontFamily: "var(--font-serif)", fontWeight: "300", color: "white", margin: 0 }}>
            {categoryName}
          </h1>
          <p style={{ color: "#eaddd3", fontSize: "16px", marginTop: "12px", maxWidth: "600px", margin: "12px auto 0 auto", fontWeight: "300", lineHeight: "1.6" }}>
            Explore our curated selection of bespoke creations. Handcrafted with premium ingredients.
          </p>
        </div>
      </div>

      <div className="section-padding" style={{ paddingTop: "20px" }}>
        <div className="container">
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
    </div>
  );
}
