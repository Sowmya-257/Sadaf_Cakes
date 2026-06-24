import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/data";

export const revalidate = 3600; // Cache categories page for 1 hour

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      {/* Collections Landing Parallax Banner */}
      <div
        style={{
          position: "relative",
          height: "350px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(to bottom, rgba(36, 32, 28, 0.6), rgba(36, 32, 28, 0.6)), url('/images/categories_landing_bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          color: "white",
          textAlign: "center",
        }}
      >
        <div className="container animate-fade-in-up">
          <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--primary-gold)", fontWeight: 600, display: "block", marginBottom: "12px" }}>
            Sadaf Cakes
          </span>
          <h1 style={{ fontSize: "56px", fontFamily: "var(--font-serif)", fontWeight: "300", color: "white", margin: 0 }}>
            Our Cake Collections
          </h1>
          <p style={{ color: "#eaddd3", fontSize: "16px", marginTop: "12px", maxWidth: "600px", margin: "12px auto 0 auto", fontWeight: "300", lineHeight: "1.6" }}>
            From elegant wedding designs to playful kids birthday cakes, explore our collections handcrafted with premium ingredients.
          </p>
        </div>
      </div>

      <div className="section-padding" style={{ paddingTop: "50px" }}>
        <div className="container">
          {/* Categories Grid */}
        <div className="category-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "40px" }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="category-overlay-card"
              style={{ textDecoration: "none" }}
            >
              <div className="category-overlay-img-wrapper">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 350px"
                  style={{
                    objectFit: "cover",
                  }}
                  priority
                />
                {/* Ambient dark gradient overlay */}
                <div className="category-overlay-gradient" />
                
                {/* Floating white text overlay */}
                <div className="category-overlay-content">
                  <h3 className="category-overlay-title">{cat.name}</h3>
                  <span className="category-overlay-btn">
                    Explore Collection ➔
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Custom Design Callout */}
        <div
          style={{
            marginTop: "80px",
            border: "1px solid var(--primary-gold)",
            padding: "60px 40px",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "#fcf9f5",
            boxShadow: "var(--shadow-light)",
            position: "relative",
            overflow: "hidden",
            textAlign: "center"
          }}
        >
          <h2 style={{ fontSize: "36px", marginBottom: "16px", fontFamily: "var(--font-serif)", fontWeight: "300" }}>Looking for a Bespoke Design?</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto 30px auto", lineHeight: "1.7", fontWeight: "300" }}>
            Our master pastry chefs can bring any design to life. Contact our cake consultants to plan your custom cake structure, custom sizes, and gourmet flavor options.
          </p>
          <a
            href="https://wa.me/971581988276?text=Hi%20Sadaf%20Cakes%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20cake%20design."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ textDecoration: "none", fontSize: "13px", padding: "16px 36px", letterSpacing: "0.08em" }}
          >
            Chat with Cake Consultant (WhatsApp)
          </a>
        </div>
      </div>
    </div>
    </div>
  );
}
