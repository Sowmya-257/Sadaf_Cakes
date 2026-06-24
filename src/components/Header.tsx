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
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-bag">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <a href="tel:+971581988276" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "12px", display: "inline-flex", alignItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Call Shop
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
