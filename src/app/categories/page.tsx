import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/data";

export const revalidate = 3600; // Cache categories page for 1 hour

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="section-padding">
      <div className="container">
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--primary-dark)",
              fontWeight: 600,
              display: "block",
              marginBottom: "8px",
            }}
          >
            Sadaf Cakes
          </span>
          <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>Our Cake Collections</h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
            From elegant wedding designs to playful kids birthday cakes, explore our collections handcrafted with premium ingredients.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="category-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="category-card"
              style={{ textDecoration: "none" }}
            >
              <div
                className="category-img-wrapper"
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "100%", // Square aspect ratio for categories page
                  overflow: "hidden",
                }}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 350px"
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                />
              </div>
              <div style={{ padding: "24px", backgroundColor: "white", textAlign: "center" }}>
                <h3 style={{ fontSize: "22px", marginBottom: "8px", fontFamily: "var(--font-serif)" }}>{cat.name}</h3>
                <span
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--primary-gold)",
                    fontWeight: 600,
                    borderBottom: "1px solid var(--primary-gold)",
                    paddingBottom: "2px",
                  }}
                >
                  Explore Collection
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Custom Design Callout */}
        <div
          style={{
            marginTop: "80px",
            backgroundColor: "#f4ede2",
            borderRadius: "var(--radius-lg)",
            padding: "50px",
            textAlign: "center",
            border: "1px solid var(--border-light)",
          }}
        >
          <h2 style={{ fontSize: "36px", marginBottom: "12px" }}>Looking for a Bespoke Design?</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 30px auto" }}>
            Our master pastry chefs can bring any design to life. Contact our cake consultants to plan your custom cake structure, custom sizes, and gourmet flavor options.
          </p>
          <a
            href="https://wa.me/971581988276?text=Hi%20Sadaf%20Cakes%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20cake%20design."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ textDecoration: "none" }}
          >
            Chat with Cake Consultant (WhatsApp)
          </a>
        </div>
      </div>
    </div>
  );
}
