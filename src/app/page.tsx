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
          height: "650px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          backgroundImage:
            "linear-gradient(to right, rgba(36, 32, 28, 0.85) 30%, rgba(36, 32, 28, 0.4) 60%, rgba(36, 32, 28, 0.15) 100%), url('/images/hero_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          color: "white",
          overflow: "hidden"
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <div style={{ maxWidth: "650px" }} className="animate-fade-in-up">
            <span
              style={{
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "var(--primary-gold)",
                display: "block",
                marginBottom: "16px",
                fontWeight: 600,
              }}
            >
              Luxury Custom Pastry
            </span>
            <h1
              style={{
                fontSize: "64px",
                lineHeight: "1.05",
                color: "white",
                marginBottom: "24px",
                fontFamily: "var(--font-serif)",
                fontWeight: "300"
              }}
            >
              We Deliver <span style={{ fontStyle: "italic", color: "var(--primary-gold)" }}>Happiness</span> in Every Slice
            </h1>
            <p
              style={{
                fontSize: "18px",
                marginBottom: "40px",
                color: "#eaddd3",
                lineHeight: "1.7",
                fontWeight: "300"
              }}
            >
              Bespoke customized cakes handcrafted with German standards and premium ingredients. Delivered fresh across Dubai.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <Link href="#categories" className="btn btn-primary" style={{ textDecoration: "none", padding: "14px 32px" }}>
                Order Online
              </Link>
              <a
                href="https://wa.me/971581988276?text=Hi%20Sadaf%20Cakes%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20cake%20design."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ borderColor: "rgba(255, 255, 255, 0.4)", color: "white", textDecoration: "none", padding: "14px 32px", backdropFilter: "blur(4px)" }}
              >
                Custom Cake Inquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section id="categories" className="section-padding" style={{ backgroundColor: "var(--bg-white)", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }} className="container">
          <h2 style={{ fontSize: "36px", marginBottom: "12px", fontFamily: "var(--font-serif)" }}>Browse Cake Collections</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto", fontWeight: "300" }}>
            From birthdays to weddings, choose from our curated collections or customize your own cake down to the smallest detail.
          </p>
        </div>

        <div className="marquee-container">
          <div className="marquee-content">
            {[...categories, ...categories, ...categories, ...categories].map((cat, idx) => (
              <Link
                key={`${cat.id}-${idx}`}
                href={`/categories/${cat.slug}`}
                className="category-overlay-card"
                style={{ textDecoration: "none" }}
              >
                <div className="category-overlay-img-wrapper" style={{ width: "260px", paddingTop: "130%" }}>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="260px"
                    style={{ objectFit: "cover" }}
                  />
                  {/* Ambient dark gradient overlay */}
                  <div className="category-overlay-gradient" />
                  
                  {/* Floating white text overlay */}
                  <div className="category-overlay-content">
                    <h3 className="category-overlay-title" style={{ fontSize: "20px" }}>{cat.name}</h3>
                    <span className="category-overlay-btn" style={{ fontSize: "10px" }}>
                      Explore Collection ➔
                    </span>
                  </div>
                </div>
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
          backgroundColor: "#fcf9f5",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="container about-grid">
          <div>
            <span
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "var(--primary-dark)",
                fontWeight: 600,
                display: "block",
                marginBottom: "12px",
              }}
            >
              Our Story
            </span>
            <h2 style={{ fontSize: "44px", marginBottom: "24px", lineHeight: "1.15", fontWeight: "300", fontFamily: "var(--font-serif)" }}>
              Handcrafted with <span style={{ fontStyle: "italic" }}>German Quality</span> Standards
            </h2>
            <p style={{ color: "var(--text-main)", marginBottom: "20px", fontSize: "15px", lineHeight: "1.7", fontWeight: "300" }}>
              At Sadaf Cakes, we believe cakes are more than just desserts—they are the centerpiece of your life's most precious celebrations. That's why we adhere to the highest standards of culinary craftsmanship.
            </p>
            <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "14px", lineHeight: "1.7", fontWeight: "300" }}>
              Every layer is freshly baked, every frosting is whipped to perfection, and every decorative detail is hand-sculpted by our team of master pastry designers. We don't compromise on ingredients, importing premium chocolate and berries to ensure exquisite taste.
            </p>
            <div style={{ display: "flex", gap: "40px", borderTop: "1px solid var(--border-light)", paddingTop: "24px" }}>
              <div>
                <div style={{ fontSize: "38px", fontFamily: "var(--font-serif)", color: "var(--primary-dark)", fontWeight: "400", fontStyle: "italic" }}>100%</div>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginTop: "4px" }}>Freshly Baked</div>
              </div>
              <div>
                <div style={{ fontSize: "38px", fontFamily: "var(--font-serif)", color: "var(--primary-dark)", fontWeight: "400", fontStyle: "italic" }}>50k+</div>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginTop: "4px" }}>Happy Events</div>
              </div>
              <div>
                <div style={{ fontSize: "38px", fontFamily: "var(--font-serif)", color: "var(--primary-dark)", fontWeight: "400", fontStyle: "italic" }}>24/7</div>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginTop: "4px" }}>Support</div>
              </div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              right: "-15px",
              bottom: "-15px",
              border: "1px solid var(--primary-gold)",
              borderRadius: "var(--radius-lg)",
              zIndex: 0
            }} />
            <div style={{ position: "relative", zIndex: 1, height: "450px", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-hover)" }}>
              <Image
                src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80"
                alt="Pastry Chef decorating cake"
                fill
                sizes="(max-width: 991px) 100vw, 550px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Custom Inquiry Callout Banner */}
      <section
        style={{
          position: "relative",
          height: "420px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(to bottom, rgba(36, 32, 28, 0.75), rgba(36, 32, 28, 0.75)), url('/images/custom_design_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          color: "white",
          textAlign: "center"
        }}
      >
        <div className="container">
          <h2 style={{ fontSize: "40px", marginBottom: "20px", fontFamily: "var(--font-serif)", color: "white", fontWeight: "300" }}>Need a Custom Design?</h2>
          <p style={{ color: "#eaddd3", marginBottom: "36px", fontSize: "16px", maxWidth: "600px", margin: "0 auto 36px auto", lineHeight: "1.7", fontWeight: "300" }}>
            Planning a grand wedding, a custom themed birthday, or corporate celebration? Send your design inspiration, cake size, and preferred flavors directly to our cake consultants via WhatsApp.
          </p>
          <a
            href="https://wa.me/971581988276?text=Hi%20Sadaf%20Cakes%2C%20I%20would%20like%20to%20inquire%20about%20a%20custom%20cake%20design."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ fontSize: "13px", padding: "16px 36px", textDecoration: "none", letterSpacing: "0.08em" }}
          >
            Chat With Cake Designer (WhatsApp)
          </a>
        </div>
      </section>
    </div>
  );
}
