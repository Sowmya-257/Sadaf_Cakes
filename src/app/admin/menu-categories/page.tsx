"use client";

import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export default function MenuCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataError, setDataError] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Modal State for Category (Create & Edit)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState("");
  const [categoryModalError, setCategoryModalError] = useState("");
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchCategories = async (authToken: string) => {
    setIsDataLoading(true);
    setDataError("");
    try {
      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(data.categories);
      } else {
        setDataError(data.message || "Failed to load categories");
      }
    } catch (err) {
      console.error("Failed to load categories", err);
      setDataError("Connection error while loading categories.");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      fetchCategories(token);
    }
  }, []);

  const handleRefresh = () => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      fetchCategories(token);
    }
  };

  // Open Category Modal (Add or Edit)
  const openCategoryModal = (categoryToEdit: Category | null = null) => {
    setCategoryModalError("");
    setEditingCategory(categoryToEdit);
    
    if (categoryToEdit) {
      setNewCategoryName(categoryToEdit.name);
      setNewCategoryImage(categoryToEdit.image);
    } else {
      setNewCategoryName("");
      setNewCategoryImage("");
    }
    setIsCategoryModalOpen(true);
  };

  // Delete Category
  const handleDeleteCategory = async (catId: number) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;
    if (!confirm("Are you sure you want to delete this category? WARNING: This will also delete all cakes under this category.")) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${catId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== catId));
      } else {
        alert(data.message || "Failed to delete category");
      }
    } catch (err) {
      alert("Failed to delete category due to network error.");
    }
  };

  // Submit Category Form (Create or Update)
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;
    setCategoryModalError("");

    if (!newCategoryName) {
      setCategoryModalError("Category name is required.");
      return;
    }

    setIsCategorySubmitting(true);

    const payload = {
      id: editingCategory?.id,
      name: newCategoryName,
      image: newCategoryImage,
    };

    const method = editingCategory ? "PUT" : "POST";

    try {
      const res = await fetch("/api/admin/categories", {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        setNewCategoryName("");
        setNewCategoryImage("");
        fetchCategories(token);
      } else {
        setCategoryModalError(data.message || `Failed to ${editingCategory ? "update" : "add"} category`);
      }
    } catch (err) {
      setCategoryModalError(`Network error while ${editingCategory ? "updating" : "creating"} category.`);
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  // Upload Category Banner Photo
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
        setNewCategoryImage(data.url);
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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "36px" }}>Menu Categories</h1>
          <p style={{ color: "var(--text-muted)" }}>View, customize, or create new sections for your cake collections.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn btn-outline" onClick={handleRefresh}>
            Refresh
          </button>
          <button className="btn btn-primary" onClick={() => openCategoryModal(null)}>
            Add New Category
          </button>
        </div>
      </div>

      {dataError && <div className="alert alert-error">{dataError}</div>}

      <div className="table-card">
        {isDataLoading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading categories...</div>
        ) : categories.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>No categories configured.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Category Name</th>
                <th>Slug (URL Path)</th>
                <th>System ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div style={{ width: "50px", height: "50px", position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border-light)" }}>
                      <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </td>
                  <td>
                    <strong>{cat.name}</strong>
                  </td>
                  <td>
                    <code>/categories/{cat.slug}</code>
                  </td>
                  <td>
                    <code>{cat.id}</code>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => openCategoryModal(cat)}>
                      Edit
                    </button>
                    <button className="action-btn" style={{ color: "#c95d5d" }} onClick={() => handleDeleteCategory(cat.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form: Add or Edit Category */}
      {isCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--border-light)", paddingBottom: "12px" }}>
              <h2 style={{ fontSize: "24px" }}>{editingCategory ? "Edit Menu Category" : "Add New Menu Category"}</h2>
              <button
                type="button"
                onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
                style={{ background: "transparent", border: "none", fontSize: "24px", cursor: "pointer", color: "var(--text-muted)" }}
              >
                ✕
              </button>
            </div>

            {categoryModalError && <div className="alert alert-error">{categoryModalError}</div>}

            <form onSubmit={handleCategorySubmit}>
              {/* Category Name */}
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cupcakes & Muffins"
                  className="form-input"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>

              {/* Category Image URL & Upload */}
              <div className="form-group" style={{ marginBottom: "24px" }}>
                <label className="form-label">Category Banner Image URL / Upload</label>
                <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or upload a file"
                    className="form-input"
                    value={newCategoryImage}
                    onChange={(e) => setNewCategoryImage(e.target.value)}
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

              <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCategorySubmitting}
                  className="btn btn-primary"
                >
                  {isCategorySubmitting
                    ? editingCategory
                      ? "Saving..."
                      : "Adding..."
                    : editingCategory
                    ? "Save Changes"
                    : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
