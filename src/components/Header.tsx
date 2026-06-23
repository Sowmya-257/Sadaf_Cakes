"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function Header() {
  const { cart, removeFromCart, cartCount, cartTotal, isCartOpen, setIsCartOpen } = useCart();

  return (
    <>
      <header className="header">
        <div className="container header-container">
          {/* Logo */}
          <Link href="/" className="logo">
            SADAF<span>CAKES</span>
          </Link>

          {/* Navigation Links */}
          <nav>
            <ul className="nav-links">
              <li>
                <Link href="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="nav-link">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#about" className="nav-link">
                  About Us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Actions (Cart) */}
          <div className="nav-actions">
            <button
              onClick={() => setIsCartOpen(true)}
              className="cart-icon-btn"
              aria-label="Open Shopping Cart"
            >
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <a href="tel:+971581988276" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "12px" }}>
              📞 Call Shop
            </a>
          </div>
        </div>
      </header>

      {/* Cart Drawer Overlay */}
      <div
        className={`cart-drawer-overlay ${isCartOpen ? "open" : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Drawer */}
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>My Cart</h2>
          <button className="close-drawer-btn" onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "40px" }}>
              <p style={{ fontSize: "18px", marginBottom: "12px" }}>Your cart is empty.</p>
              <button
                className="btn btn-outline"
                onClick={() => setIsCartOpen(false)}
                style={{ fontSize: "12px", padding: "8px 16px" }}
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="70px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="cart-item-details">
                  <div>
                    <h4 className="cart-item-title">{item.name}</h4>
                    <p className="cart-item-meta">
                      Size: {item.size} <br />
                      Flavor: {item.flavor}
                      {item.message && (
                        <>
                          <br />
                          <span style={{ fontStyle: "italic" }}>"{item.message}"</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">
                      AED {item.price.toFixed(2)} x {item.quantity}
                    </span>
                    <button
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal:</span>
              <span className="cart-subtotal-price">AED {cartTotal.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="btn btn-primary"
              onClick={() => setIsCartOpen(false)}
              style={{ width: "100%", textDecoration: "none", textAlign: "center" }}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
