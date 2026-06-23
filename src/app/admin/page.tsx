"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboardHome() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;

    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersRes = await fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = await ordersRes.json();
        const loadedOrders: Order[] = ordersData.success ? ordersData.orders : [];
        setOrders(loadedOrders);

        // Fetch products count
        const productsRes = await fetch("/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productsData = await productsRes.json();
        setProductsCount(productsData.success ? productsData.products.length : 0);

        // Fetch categories count
        const categoriesRes = await fetch("/api/admin/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const categoriesData = await categoriesRes.json();
        setCategoriesCount(categoriesData.success ? categoriesData.categories.length : 0);

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard metrics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const recentOrders = orders.slice(0, 5);

  if (isLoading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading metrics...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "4px" }}>Dashboard Summary</h1>
        <p style={{ color: "var(--text-muted)" }}>Welcome to the Sadaf Cakes management portal. Here is your business overview.</p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: "24px" }}>{error}</div>}

      {/* Metrics Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-light)" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Total Revenue</span>
          <h2 style={{ fontSize: "32px", color: "var(--primary-dark)", marginTop: "8px", marginBottom: "0" }}>AED {totalRevenue.toFixed(2)}</h2>
          <span style={{ fontSize: "11px", color: "#68a063", display: "block", marginTop: "4px" }}>Excluding cancelled orders</span>
        </div>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-light)" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Total Orders</span>
          <h2 style={{ fontSize: "32px", marginTop: "8px", marginBottom: "0" }}>{totalOrders}</h2>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Placed by customers</span>
        </div>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-light)" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Pending Orders</span>
          <h2 style={{ fontSize: "32px", color: "#d97706", marginTop: "8px", marginBottom: "0" }}>{pendingOrders}</h2>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Awaiting confirmation</span>
        </div>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-light)" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Cake Catalog</span>
          <h2 style={{ fontSize: "32px", marginTop: "8px", marginBottom: "0" }}>{productsCount}</h2>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Active products</span>
        </div>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "8px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-light)" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Categories</span>
          <h2 style={{ fontSize: "32px", marginTop: "8px", marginBottom: "0" }}>{categoriesCount}</h2>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>Active collections</span>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
        {/* Recent Orders */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-light)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", margin: 0 }}>Recent Orders</h3>
            <Link href="/admin/manage-orders" className="btn btn-outline" style={{ padding: "6px 12px", fontSize: "12px", textDecoration: "none" }}>
              View All Orders
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>No orders placed yet.</p>
          ) : (
            <table className="admin-table" style={{ fontSize: "14px" }}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>{order.customerName}</td>
                    <td style={{ fontWeight: 600, color: "var(--primary-dark)" }}>AED {Number(order.totalAmount).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, "-")}`} style={{ fontSize: "11px" }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Links Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-light)" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Quick Controls</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link href="/admin/cake-catalog" className="btn btn-primary" style={{ textAlign: "center", textDecoration: "none", padding: "12px" }}>
                Manage Cake Catalog
              </Link>
              <Link href="/admin/menu-categories" className="btn btn-outline" style={{ textAlign: "center", textDecoration: "none", padding: "12px" }}>
                Manage Categories
              </Link>
              <a
                href="/"
                target="_blank"
                className="btn btn-outline"
                style={{ textAlign: "center", textDecoration: "none", padding: "12px", borderColor: "var(--primary-dark)", color: "var(--primary-dark)" }}
              >
                View Storefront Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
