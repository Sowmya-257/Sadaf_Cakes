import Link from "next/link";
import Image from "next/image";
import { getCategories, getFeaturedProducts } from "@/lib/data";

export const revalidate = 60; // Revalidate cache every 60 seconds (ISR)

export default async function Home() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        style={{
          position: "relative",
          height: "600px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          backgroundImage:
            "linear-gradient(to right, rgba(36, 32, 28, 0.8), rgba(36, 32, 28, 0.2)), url('https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=1600&auto=format&fit=crop&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ maxWidth: "600px" }}>
            <span
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "var(--primary-gold)",
                display: "block",
                marginBottom: "12px",
                fontWeight: 600,
              }}
            >
              Luxury Custom Pastry
            </span>
            <h1
              style={{
                fontSize: "58px",
                lineHeight: "1.1",
                color: "white",
                marginBottom: "24px",
                fontFamily: "var(--font-serif)",
              }}
            >
              We Deliver Happiness in Every Slice
            </h1>
            <p
              style={{
                fontSize: "18px",
                marginBottom: "36px",
                color: "#e2dacf",
                lineHeight: "1.6",
              }}
            >
              Bespoke customized cakes handcrafted with German standards and premium ingredients. Delivered fresh across Dubai.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <Link href="#categories" className="btn btn-primary" style={{ textDecoration: "none" }}>
                Order Online
              </Link>
              <a
                href="https://wa.me/971581988276?text=Hi%20Sadaf%20Cakes%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20cake%20design."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ borderColor: "white", color: "white", textDecoration: "none" }}
              >
                Custom Cake Inquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section id="categories" className="section-padding" style={{ backgroundColor: "var(--bg-white)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "36px", marginBottom: "12px" }}>Browse Cake Collections</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
              From birthdays to weddings, choose from our curated collections or customize your own cake down to the smallest detail.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`} className="category-card" style={{ textDecoration: "none" }}>
                <div className="category-img-wrapper">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 220px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h3>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "36px", marginBottom: "12px" }}>Best Seller Cakes</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
              Most loved custom creations that our customers keep ordering again and again.
            </p>
          </div>

          <div className="product-grid">
            {featuredProducts.map((prod) => (
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
        </div>
      </section>

      {/* 4. About Us & Custom Form Promo */}
      <section
        id="about"
        className="section-padding"
        style={{
          backgroundColor: "#f4ede2",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div>
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
              Our Story
            </span>
            <h2 style={{ fontSize: "42px", marginBottom: "20px", lineHeight: "1.2" }}>
              Handcrafted with German Quality Standards
            </h2>
            <p style={{ color: "var(--text-main)", marginBottom: "16px", fontSize: "15px" }}>
              At Sadaf Cakes, we believe cakes are more than just desserts—they are the centerpiece of your life's most precious celebrations. That's why we adhere to the highest standards of culinary craftsmanship.
            </p>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: "14px" }}>
              Every layer is freshly baked, every frosting is whipped to perfection, and every decorative detail is hand-sculpted by our team of master pastry designers. We don't compromise on ingredients, importing premium chocolate and berries to ensure exquisite taste.
            </p>
            <div style={{ display: "flex", gap: "40px" }}>
              <div>
                <div style={{ fontSize: "36px", fontFamily: "var(--font-serif)", color: "var(--primary-dark)", fontWeight: 600 }}>100%</div>
                <div style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)" }}>Freshly Baked</div>
              </div>
              <div>
                <div style={{ fontSize: "36px", fontFamily: "var(--font-serif)", color: "var(--primary-dark)", fontWeight: 600 }}>50k+</div>
                <div style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)" }}>Happy Events</div>
              </div>
              <div>
                <div style={{ fontSize: "36px", fontFamily: "var(--font-serif)", color: "var(--primary-dark)", fontWeight: 600 }}>24/7</div>
                <div style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)" }}>Support & Delivery</div>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", height: "450px", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-light)" }}>
            <Image
              src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80"
              alt="Pastry Chef decorating cake"
              fill
              sizes="(max-width: 991px) 100vw, 550px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* 5. Custom Inquiry Callout */}
      <section className="section-padding" style={{ backgroundColor: "var(--bg-white)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: "700px" }}>
          <h2 style={{ fontSize: "40px", marginBottom: "16px" }}>Need a Custom Design?</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "16px" }}>
            Planning a grand wedding, a custom themed birthday, or corporate celebration? Send your design inspiration, cake size, and preferred flavors directly to our cake consultants via WhatsApp.
          </p>
          <a
            href="https://wa.me/971581988276?text=Hi%20Sadaf%20Cakes%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20cake%20design."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ fontSize: "14px", padding: "14px 36px", textDecoration: "none" }}
          >
            Chat With Cake Designer (WhatsApp)
          </a>
        </div>
      </section>
    </div>
  );
}
