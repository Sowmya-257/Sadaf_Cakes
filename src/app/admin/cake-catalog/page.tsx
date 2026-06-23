"use client";

import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  flavors: string;
  sizes: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export default function CakeCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataError, setDataError] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Modal State for Product (Create & Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductFlavors, setNewProductFlavors] = useState("Chocolate Ferrero, Vanilla Raspberry, Pistachio");
  const [newProductSizes, setNewProductSizes] = useState("1kg (6-8 portions), 1.5kg, 2kg");
  const [productModalError, setProductModalError] = useState("");
  const [isProductSubmitting, setIsProductSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchCatalogData = async (authToken: string) => {
    setIsDataLoading(true);
    setDataError("");
    try {
      // 1. Fetch categories for mapping and dropdowns
      const catRes = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const catData = await catRes.json();
      let loadedCategories: Category[] = [];
      if (catRes.ok && catData.success) {
        setCategories(catData.categories);
        loadedCategories = catData.categories;
      }

      // 2. Fetch products list
      const prodRes = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const prodData = await prodRes.json();
      if (prodRes.ok && prodData.success) {
        setProducts(prodData.products);
      } else {
        setDataError(prodData.message || "Failed to load products");
      }

      // Pre-set default category in form if empty
      if (loadedCategories.length > 0 && !newProductCategory) {
        setNewProductCategory(loadedCategories[0].id.toString());
      }
    } catch (err) {
      console.error("Failed to load catalog data", err);
      setDataError("Connection error while loading catalog data.");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      fetchCatalogData(token);
    }
  }, []);

  const handleRefresh = () => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      fetchCatalogData(token);
    }
  };

  // Handle Product Deletion
  const handleDeleteProduct = async (prodId: number) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;
    if (!confirm("Are you sure you want to delete this cake?")) return;

    try {
      const res = await fetch(`/api/admin/products?id=${prodId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== prodId));
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      alert("Failed to delete product due to network error.");
    }
  };

  // Handle Opening Product Modal (Add or Edit)
  const openProductModal = (productToEdit: Product | null = null) => {
    setProductModalError("");
    setEditingProduct(productToEdit);
    
    if (productToEdit) {
      setNewProductName(productToEdit.name);
      setNewProductDesc(productToEdit.description);
      setNewProductPrice(productToEdit.price.toString());
      setNewProductImage(productToEdit.image);
      setNewProductCategory(productToEdit.categoryId.toString());
      setNewProductFlavors(productToEdit.flavors);
      setNewProductSizes(productToEdit.sizes);
    } else {
      setNewProductName("");
      setNewProductDesc("");
      setNewProductPrice("");
      setNewProductImage("");
      if (categories.length > 0) {
        setNewProductCategory(categories[0].id.toString());
      }
      setNewProductFlavors("Chocolate Ferrero, Vanilla Raspberry, Pistachio");
      setNewProductSizes("1kg (6-8 portions), 1.5kg, 2kg");
    }
    
    setIsProductModalOpen(true);
  };

  // Handle Product Form Submit (Create or Update)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;
    setProductModalError("");

    if (!newProductName || !newProductPrice || !newProductCategory || !newProductFlavors || !newProductSizes) {
      setProductModalError("Please fill out all required fields.");
      return;
    }

    setIsProductSubmitting(true);

    const payload = {
      id: editingProduct?.id,
      name: newProductName,
      description: newProductDesc,
      price: parseFloat(newProductPrice),
      image: newProductImage,
      categoryId: parseInt(newProductCategory),
      flavors: newProductFlavors,
      sizes: newProductSizes,
    };

    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch("/api/admin/products", {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        fetchCatalogData(token);
      } else {
        setProductModalError(data.message || `Failed to ${editingProduct ? "update" : "add"} product`);
      }
    } catch (err) {
      setProductModalError(`Network error while ${editingProduct ? "updating" : "creating"} product.`);
    } finally {
      setIsProductSubmitting(false);
    }
  };

  // Handle Direct File Uploads for Product Images
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const token = sessionStorage.getItem("admin_token");
    if (!file || !token) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewProductImage(data.url);
      } else {
        alert(data.message || "Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed due to network error.");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to dynamically get category name from ID
  const getCategoryName = (catId: number) => {
    const category = categories.find((c) => c.id === catId);
    return category ? category.name : `Category #${catId}`;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "36px" }}>Cake Catalog</h1>
          <p style={{ color: "var(--text-muted)" }}>Create, edit, or delete cakes and sets on the website menu.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn btn-outline" onClick={handleRefresh}>
            Refresh
          </button>
          <button className="btn btn-primary" onClick={() => openProductModal(null)}>
            Add New Cake
          </button>
        </div>
      </div>

      {dataError && <div className="alert alert-error">{dataError}</div>}

      <div className="table-card">
        {isDataLoading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>No products created yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Cake Name</th>
                <th>Category</th>
                <th>Base Price</th>
                <th>Flavors & Sizes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <div style={{ width: "50px", height: "50px", position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
                      <img src={prod.image} alt={prod.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </td>
                  <td>
                    <strong>{prod.name}</strong>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {prod.description}
                    </div>
                  </td>
                  <td>
                    <span className="status-badge confirmed" style={{ fontSize: "11px" }}>
                      {getCategoryName(prod.categoryId)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--primary-dark)" }}>
                    AED {Number(prod.price).toFixed(2)}
                  </td>
                  <td>
                    <div style={{ fontSize: "12px" }}>
                      <strong>Flavors:</strong> {prod.flavors} <br />
                      <strong>Sizes:</strong> {prod.sizes}
                    </div>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => openProductModal(prod)}>
                      Edit
                    </button>
                    <button className="action-btn" style={{ color: "#c95d5d" }} onClick={() => handleDeleteProduct(prod.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form: Add or Edit Product */}
      {isProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--border-light)", paddingBottom: "12px" }}>
              <h2 style={{ fontSize: "24px" }}>{editingProduct ? "Edit Cake Design" : "Add New Cake Design"}</h2>
              <button
                type="button"
                onClick={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
                style={{ background: "transparent", border: "none", fontSize: "24px", cursor: "pointer", color: "var(--text-muted)" }}
              >
                ✕
              </button>
            </div>

            {productModalError && <div className="alert alert-error">{productModalError}</div>}

            <form onSubmit={handleProductSubmit}>
              {/* Product Name */}
              <div className="form-group">
                <label className="form-label">Cake Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Velvet Rose Cake"
                  className="form-input"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                />
              </div>

              {/* Price & Category Row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Base Price (AED) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="250.00"
                    className="form-input"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Menu Category *</label>
                  <select
                    className="form-input"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Input & Direct File Upload */}
              <div className="form-group">
                <label className="form-label">Cake Image URL / Upload *</label>
                <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or upload a file"
                    className="form-input"
                    value={newProductImage}
                    onChange={(e) => setNewProductImage(e.target.value)}
                    style={{ flex: "1", minWidth: "0" }}
                  />
                  <div style={{ position: "relative", overflow: "hidden", display: "inline-flex", flexShrink: 0 }}>
                    <button type="button" className="btn btn-outline" style={{ padding: "12px 20px", fontSize: "14px", whiteSpace: "nowrap" }}>
                      {isUploading ? "Uploading..." : "Upload file"}
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ position: "absolute", left: 0, top: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description / Details</label>
                <textarea
                  placeholder="Explain the design, ingredients, sponge base, layers, frosting style, etc."
                  className="form-input"
                  style={{ minHeight: "80px", resize: "vertical" }}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                />
              </div>

              {/* Flavors list */}
              <div className="form-group">
                <label className="form-label">Available Flavors (Comma-separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chocolate Ferrero, Vanilla Raspberry, Pistachio"
                  className="form-input"
                  value={newProductFlavors}
                  onChange={(e) => setNewProductFlavors(e.target.value)}
                />
              </div>

              {/* Sizes list */}
              <div className="form-group" style={{ marginBottom: "24px" }}>
                <label className="form-label">Available Sizes (Comma-separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1kg (6-8 portions), 1.5kg, 2kg"
                  className="form-input"
                  value={newProductSizes}
                  onChange={(e) => setNewProductSizes(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProductSubmitting}
                  className="btn btn-primary"
                >
                  {isProductSubmitting
                    ? editingProduct
                      ? "Saving..."
                      : "Adding..."
                    : editingProduct
                    ? "Save Changes"
                    : "Add Cake to Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
