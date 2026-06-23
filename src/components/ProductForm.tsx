"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ProductType {
  id: number;
  name: string;
  price: number;
  image: string;
  flavors: string;
  sizes: string;
}

export default function ProductForm({ product }: { product: ProductType }) {
  const { addToCart } = useCart();

  // Parse comma-separated flavors and sizes
  const flavorOptions = product.flavors.split(",").map((s) => s.trim());
  const sizeOptions = product.sizes.split(",").map((s) => s.trim());

  // Local state for selectors
  const [selectedFlavor, setSelectedFlavor] = useState(flavorOptions[0] || "");
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] || "");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      flavor: selectedFlavor,
      size: selectedSize,
      message: message,
      quantity: quantity,
    });
  };

  return (
    <div className="customization-section">
      {/* 1. Flavor Selector */}
      <div className="selector-group">
        <label className="selector-label">Select Flavor</label>
        <div className="option-chips">
          {flavorOptions.map((flavor) => (
            <button
              key={flavor}
              className={`option-chip ${selectedFlavor === flavor ? "selected" : ""}`}
              onClick={() => setSelectedFlavor(flavor)}
              type="button"
            >
              {flavor}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Size Selector */}
      <div className="selector-group">
        <label className="selector-label">Select Size / Portions</label>
        <div className="option-chips">
          {sizeOptions.map((size) => (
            <button
              key={size}
              className={`option-chip ${selectedSize === size ? "selected" : ""}`}
              onClick={() => setSelectedSize(size)}
              type="button"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Text Message to Write on Cake */}
      <div className="selector-group">
        <label className="selector-label">Message on Cake (Optional)</label>
        <input
          type="text"
          className="custom-text-input"
          placeholder="e.g. Happy Birthday Sarah!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={60}
        />
        <span style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "right" }}>
          Maximum 60 characters
        </span>
      </div>

      {/* 4. Quantity Selector */}
      <div className="selector-group" style={{ maxWidth: "120px" }}>
        <label className="selector-label">Quantity</label>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", backgroundColor: "white", overflow: "hidden" }}>
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            style={{ width: "36px", height: "36px", background: "transparent", border: "none", cursor: "pointer", fontSize: "16px" }}
          >
            -
          </button>
          <span style={{ flexGrow: 1, textAlign: "center", fontSize: "14px", fontWeight: 500 }}>
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(q => q + 1)}
            style={{ width: "36px", height: "36px", background: "transparent", border: "none", cursor: "pointer", fontSize: "16px" }}
          >
            +
          </button>
        </div>
      </div>

      {/* 5. Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="btn btn-primary"
        style={{ width: "100%", padding: "16px", marginTop: "10px", fontSize: "16px" }}
      >
        Add to Shopping Cart
      </button>

      {/* Call Shop Help Text */}
      <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", marginTop: "10px" }}>
        Need help or want to customize this cake further? <br />
        <a href="tel:+971581988276" style={{ color: "var(--primary-dark)", fontWeight: 600 }}>Call 058 198 8276</a> or{" "}
        <a href={`https://wa.me/971581988276?text=Hi%2C%20I%20am%20interested%20in%20customizing%20the%20${product.name}%20cake.`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-dark)", fontWeight: 600 }}>WhatsApp us</a>.
      </p>
    </div>
  );
}
