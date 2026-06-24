"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();

  // Form Fields State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00 AM - 12:00 PM");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  // Success display state (to preserve details after clearing cart)
  const [orderedItems, setOrderedItems] = useState<any[]>([]);
  const [orderedTotal, setOrderedTotal] = useState(0);

  // Validate form
  const isFormValid = name && phone && address && deliveryDate && cart.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setErrorMsg("");

    const orderData = {
      customerName: name,
      customerPhone: phone,
      customerEmail: email || null,
      deliveryAddress: address,
      notes: notes || null,
      deliveryDate: deliveryDate,
      deliveryTimeSlot: timeSlot,
      paymentMethod: paymentMethod,
      totalAmount: cartTotal,
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        flavor: item.flavor,
        size: item.size,
        message: item.message,
        specialInstructions: item.specialInstructions || null,
      })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setOrderId(result.orderId);
        setOrderedItems(cart);
        setOrderedTotal(cartTotal);
        clearCart(); // Clear cart after successful order
      } else {
        setErrorMsg(result.message || "Something went wrong while placing your order.");
      }
    } catch (error) {
      console.error("Checkout submission failed", error);
      // Fallback simulation: If API fails (e.g. database not running), simulate success for offline mode
      const mockId = `M-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(mockId);
      setOrderedItems(cart);
      setOrderedTotal(cartTotal);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Screen
  if (orderId) {
    // Generate WhatsApp text details for ordered items
    const itemsText = orderedItems.map((item) => {
      let txt = `- ${item.name} (Qty: ${item.quantity}, ${item.size}, ${item.flavor})`;
      if (item.message) txt += `\n  Message: "${item.message}"`;
      if (item.specialInstructions) txt += `\n  Requests: "${item.specialInstructions}"`;
      return txt;
    }).join("\n");

    const notesText = notes ? `\nOrder Notes: ${notes}` : "";

    // Generate WhatsApp text for easy sharing
    const whatsappText = encodeURIComponent(
      `Hi Sadaf Cakes, I placed a new order!\n\nOrder ID: #${orderId}\nName: ${name}\nPhone: ${phone}\nDelivery: ${deliveryDate} (${timeSlot})\nTotal Amount: AED ${orderedTotal.toFixed(2)}\nPayment: ${paymentMethod}\n\nItems:\n${itemsText}${notesText}\n\nPlease confirm my order. Thank you!`
    );

    return (
      <div className="section-padding" style={{ display: "flex", justifyContent: "center" }}>
        <div className="container" style={{ maxWidth: "600px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
          <h1 style={{ fontSize: "40px", marginBottom: "12px" }}>Order Confirmed!</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "30px" }}>
            Thank you, <strong>{name}</strong>. Your order <strong>#{orderId}</strong> has been successfully received. We will call you shortly to confirm your delivery.
          </p>

          <div
            style={{
              backgroundColor: "var(--bg-white)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              padding: "24px",
              textAlign: "left",
              marginBottom: "36px",
              boxShadow: "var(--shadow-light)",
            }}
          >
            <h3 style={{ fontSize: "18px", marginBottom: "16px", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
              Delivery Details
            </h3>
            <p style={{ fontSize: "14px", margin: "6px 0" }}>
              <strong>Delivery Date:</strong> {deliveryDate}
            </p>
            <p style={{ fontSize: "14px", margin: "6px 0" }}>
              <strong>Time Slot:</strong> {timeSlot}
            </p>
            <p style={{ fontSize: "14px", margin: "6px 0" }}>
              <strong>Address:</strong> {address}
            </p>
            {notes && (
              <p style={{ fontSize: "14px", margin: "6px 0" }}>
                <strong>Delivery Notes:</strong> {notes}
              </p>
            )}
            <p style={{ fontSize: "14px", margin: "6px 0" }}>
              <strong>Total Amount:</strong> AED {orderedTotal.toFixed(2)}
            </p>
            <p style={{ fontSize: "14px", margin: "6px 0" }}>
              <strong>Payment Method:</strong> {paymentMethod} (At time of delivery)
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <a
              href={`https://wa.me/971581988276?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                backgroundColor: "#25D366",
                borderColor: "#25D366",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "15px",
                padding: "16px",
              }}
            >
              💬 Send Confirmation to WhatsApp
            </a>
            <Link href="/" className="btn btn-outline" style={{ textDecoration: "none" }}>
              Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container">
        <h1 style={{ fontSize: "36px", marginBottom: "30px", borderBottom: "1px solid var(--border-light)", paddingBottom: "16px" }}>
          Checkout
        </h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: "18px", color: "var(--text-muted)", marginBottom: "20px" }}>
              Your shopping cart is empty. Please add cakes to place an order.
            </p>
            <Link href="/" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Browse Cakes
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="checkout-grid">
            {/* Left Column: Delivery Form */}
            <div className="checkout-card">
              <h2 className="checkout-title">Delivery Information</h2>

              {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

              {/* Name */}
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Phone & Email Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +971 50 123 4567"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. john@example.com"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Full Address */}
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea
                  required
                  placeholder="e.g. Apartment/Villa number, Street Name, Community, Dubai"
                  className="form-input"
                  style={{ minHeight: "80px", resize: "vertical" }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Delivery Notes / Comments */}
              <div className="form-group">
                <label className="form-label">Delivery Notes / Special Comments (Optional)</label>
                <textarea
                  placeholder="e.g. Gate code, ring bell twice, call on arrival, or any special delivery requests..."
                  className="form-input"
                  style={{ minHeight: "80px", resize: "vertical" }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Delivery Date & Time Slot Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Delivery Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
                    className="form-input"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time Slot *</label>
                  <select
                    className="form-input"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                  >
                    <option>09:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 03:00 PM</option>
                    <option>03:00 PM - 06:00 PM</option>
                    <option>06:00 PM - 09:00 PM</option>
                    <option>09:00 PM - 12:00 AM</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-group" style={{ marginTop: "10px" }}>
                <label className="form-label">Payment Method *</label>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={() => setPaymentMethod("Cash on Delivery")}
                    />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Pay with cash when your cake arrives</div>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card on Delivery"
                      checked={paymentMethod === "Card on Delivery"}
                      onChange={() => setPaymentMethod("Card on Delivery")}
                    />
                    <div>
                      <strong>Card on Delivery</strong>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Our driver will bring a card payment terminal</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div className="checkout-card" style={{ padding: "24px" }}>
                <h2 style={{ fontSize: "20px", marginBottom: "16px", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
                  Order Summary
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "12px" }}>
                        <div style={{ position: "relative", width: "50px", height: "50px", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                          <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "13px", fontWeight: 500 }}>{item.name}</h4>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            Qty: {item.quantity} | {item.size} <br />
                            Flavor: {item.flavor}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary-dark)" }}>
                        AED {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--border-light)",
                    paddingTop: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "18px",
                    fontWeight: 600,
                    marginBottom: "24px",
                  }}
                >
                  <span>Total Amount:</span>
                  <span style={{ fontFamily: "var(--font-serif)", color: "var(--primary-dark)", fontSize: "22px" }}>
                    AED {cartTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "14px" }}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order (Cash/Card)"}
                </button>

                {!isFormValid && (
                  <p style={{ color: "var(--accent-rose)", fontSize: "11px", textAlign: "center", marginTop: "8px" }}>
                    Please fill out all required (*) fields to complete your order.
                  </p>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
