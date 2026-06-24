"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Auth state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Check for saved token on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoadingAuth(false);
  }, []);

  // Handle Login Form Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setToken(data.token);
        sessionStorage.setItem("admin_token", data.token);
      } else {
        setAuthError(data.message || "Invalid username or password");
      }
    } catch (err) {
      setAuthError("Failed to connect to the authentication server.");
    }
  };

  // Handle Log Out
  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem("admin_token");
    router.push("/admin");
  };

  if (isLoadingAuth) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // Auth Guard Login View
  if (!token) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "var(--bg-cream)" }}>
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-light)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1 style={{ fontSize: "28px", letterSpacing: "1px" }}>SADAF CAKES</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Admin Dashboard Portal</p>
          </div>

          {authError && <div className="alert alert-error" style={{ marginBottom: "20px" }}>{authError}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px" }}>
              Login to Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Layout with Left Sidebar
  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div>
          <h2 style={{ color: "white", fontSize: "20px", marginBottom: "4px" }}>SADAF CAKES</h2>
          <span style={{ fontSize: "11px", color: "#a4978d" }}>Management Portal</span>
        </div>

        <nav style={{ marginTop: "30px" }}>
          <ul className="admin-menu">
            <li>
              <Link
                href="/admin"
                className={`admin-menu-item ${pathname === "/admin" ? "active" : ""}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                Dashboard Summary
              </Link>
            </li>
            <li>
              <Link
                href="/admin/manage-orders"
                className={`admin-menu-item ${pathname === "/admin/manage-orders" ? "active" : ""}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                Customer Orders
              </Link>
            </li>
            <li>
              <Link
                href="/admin/cake-catalog"
                className={`admin-menu-item ${pathname === "/admin/cake-catalog" ? "active" : ""}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                Cake Catalog
              </Link>
            </li>
            <li>
              <Link
                href="/admin/menu-categories"
                className={`admin-menu-item ${pathname === "/admin/menu-categories" ? "active" : ""}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                Menu Categories
              </Link>
            </li>
          </ul>
        </nav>

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ width: "100%", color: "white", borderColor: "#c95d5d", backgroundColor: "#c95d5d", padding: "10px" }}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
