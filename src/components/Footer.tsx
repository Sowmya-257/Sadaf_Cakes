import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>SADAF CAKES</h3>
            <p>
              Crafting premium customized cakes and desserts for birthday celebrations, weddings, and special events across the UAE.
            </p>
            <div style={{ color: "var(--primary-gold)", fontWeight: 500 }}>
              📍 Al Quoz, Dubai, United Arab Emirates
            </div>
          </div>

          <div>
            <h4 className="footer-title">Our Cakes</h4>
            <ul className="footer-links">
              <li><Link href="/categories">All Categories</Link></li>
              <li><Link href="/categories/birthday-cakes">Birthday Cakes</Link></li>
              <li><Link href="/categories/wedding-cakes">Wedding Cakes</Link></li>
              <li><Link href="/categories/sweet-sets">Sweet Sets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><Link href="/support/refund-policy">Refund Policy</Link></li>
              <li><Link href="/support/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/support/faq">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Contact Us</h4>
            <ul className="footer-links" style={{ color: "#a4978d" }}>
              <li style={{ marginBottom: "8px" }}>
                📞 <strong>Phone:</strong> <a href="tel:+971581988276" style={{ color: "white" }}>+971 58 198 8276</a>
              </li>
              <li style={{ marginBottom: "8px" }}>
                💬 <strong>WhatsApp:</strong> <a href="https://wa.me/971581988276" target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>Chat with us</a>
              </li>
              <li style={{ marginBottom: "8px" }}>
                ✉️ <strong>Email:</strong> <a href="mailto:info@sadafcakes.com" style={{ color: "white" }}>info@sadafcakes.com</a>
              </li>
              <li>
                ⏰ <strong>Hours:</strong> Daily 8:00 AM - 12:00 AM
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sadaf Cakes LLC. All rights reserved.</p>
          <p>Made with Next.js & MySQL</p>
        </div>
      </div>
    </footer>
  );
}
