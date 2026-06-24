"use client";

import { useState, useEffect } from "react";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  flavor: string;
  size: string;
  message: string | null;
  specialInstructions: string | null;
  product: { name: string };
}

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string;
  notes: string | null;
  deliveryDate: string;
  deliveryTimeSlot: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataError, setDataError] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchOrders = async (authToken: string) => {
    setIsDataLoading(true);
    setDataError("");
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders);
      } else {
        setDataError(data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setDataError("Connection error while loading orders.");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      fetchOrders(token);
    }
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: orderId.toString(), status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert(data.message || "Failed to update order status");
      }
    } catch (err) {
      alert("Failed to update status due to network error.");
    }
  };

  const handleRefresh = () => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      fetchOrders(token);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      order.id.toString().includes(term) ||
      order.customerName.toLowerCase().includes(term) ||
      order.customerPhone.toLowerCase().includes(term) ||
      (order.customerEmail && order.customerEmail.toLowerCase().includes(term)) ||
      (order.notes && order.notes.toLowerCase().includes(term)) ||
      order.orderItems.some(item => 
        (item.product?.name && item.product.name.toLowerCase().includes(term)) ||
        (item.flavor && item.flavor.toLowerCase().includes(term)) ||
        (item.size && item.size.toLowerCase().includes(term)) ||
        (item.specialInstructions && item.specialInstructions.toLowerCase().includes(term))
      );

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    let matchesDate = true;
    if (dateFilter) {
      try {
        const orderDateStr = order.deliveryDate.includes("T")
          ? order.deliveryDate.split("T")[0]
          : new Date(order.deliveryDate).toISOString().split("T")[0];
        matchesDate = orderDateStr === dateFilter;
      } catch (e) {
        matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "36px" }}>Customer Orders</h1>
          <p style={{ color: "var(--text-muted)" }}>View and update cake orders and delivery statuses.</p>
        </div>
        <button className="btn btn-outline" onClick={handleRefresh}>
          Refresh
        </button>
      </div>

      {dataError && <div className="alert alert-error">{dataError}</div>}

      {/* Search & Filter Bar */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "24px",
        backgroundColor: "white",
        padding: "16px 20px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-light)",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        {/* Search */}
        <div style={{ flex: "2", minWidth: "250px" }}>
          <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 600 }}>Search Orders</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>🔍</span>
            <input
              type="text"
              placeholder="Search name, phone, order ID, or special requests..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: "40px", margin: 0 }}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div style={{ flex: "1", minWidth: "150px" }}>
          <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 600 }}>Order Status</label>
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            style={{ margin: 0 }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Filter */}
        <div style={{ flex: "1", minWidth: "150px" }}>
          <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 600 }}>Delivery Date</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="date"
              className="form-input"
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              style={{ margin: 0 }}
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => { setDateFilter(""); setCurrentPage(1); }}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  fontWeight: "bold"
                }}
                title="Clear date"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Items per Page */}
        <div style={{ minWidth: "120px" }}>
          <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "block", marginBottom: "6px", fontWeight: 600 }}>Show Entries</label>
          <select
            className="form-input"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
            style={{ margin: 0 }}
          >
            <option value={5}>5 entries</option>
            <option value={10}>10 entries</option>
            <option value={20}>20 entries</option>
            <option value={50}>50 entries</option>
          </select>
        </div>
      </div>

      <div className="table-card">
        {isDataLoading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>No orders placed yet.</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>No orders match your search/filters.</div>
        ) : (
          <>
            <table className="admin-table" style={{ tableLayout: "fixed", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>Order ID</th>
                  <th style={{ width: "230px" }}>Customer Details</th>
                  <th style={{ width: "240px" }}>Delivery Info</th>
                  <th style={{ width: "280px" }}>Ordered Items</th>
                  <th style={{ width: "140px" }}>Total Amount</th>
                  <th style={{ width: "160px" }}>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order) => (
                  <tr key={order.id}>
                    <td style={{ verticalAlign: "top", padding: "16px 12px" }}>
                      <strong style={{ fontSize: "14px", color: "var(--text-main)" }}>#{order.id}</strong>
                    </td>
                    <td style={{ verticalAlign: "top", padding: "16px 12px", wordBreak: "break-word" }}>
                      <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "14px", marginBottom: "6px", lineHeight: "1.3" }}>
                        {order.customerName}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "var(--text-muted)" }}>
                        <div style={{ userSelect: "all" }}>
                          Phone: {order.customerPhone}
                        </div>
                        <div style={{ userSelect: "all", wordBreak: "break-all", lineHeight: "1.3" }}>
                          Email: {order.customerEmail || "No Email"}
                        </div>
                      </div>
                    </td>
                    <td style={{ verticalAlign: "top", padding: "16px 12px", wordBreak: "break-word" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "var(--text-main)" }}>
                        <div style={{ fontWeight: 600 }}>
                          Date: {new Date(order.deliveryDate).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          Time: {order.deliveryTimeSlot}
                        </div>
                        <div style={{ 
                          fontSize: "11px", 
                          color: "var(--text-muted)", 
                          marginTop: "4px", 
                          wordBreak: "break-word",
                          lineHeight: "1.4"
                        }}>
                          Address: {order.deliveryAddress}
                        </div>
                      </div>
                      {order.notes && (
                        <div style={{ 
                          fontSize: "11px", 
                          color: "#78350f", 
                          marginTop: "8px", 
                          backgroundColor: "#fef3c7", 
                          padding: "8px 10px", 
                          borderRadius: "6px", 
                          borderLeft: "3px solid var(--primary-gold)", 
                          wordBreak: "break-word",
                          lineHeight: "1.4" 
                        }}>
                          <strong>Note:</strong> "{order.notes}"
                        </div>
                      )}
                    </td>
                    <td style={{ verticalAlign: "top", padding: "16px 12px", wordBreak: "break-word" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {order.orderItems.map((item) => (
                          <div key={item.id} style={{ fontSize: "13px", wordBreak: "break-word" }}>
                            <div style={{ fontWeight: 600, marginBottom: "2px" }}>
                              {item.product?.name || "Cake"} <span style={{ color: "var(--primary-dark)" }}>x{item.quantity}</span>
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.4" }}>
                              Size: {item.size} / Flavor: {item.flavor}
                              {item.message && (
                                <div style={{ marginTop: "4px", color: "var(--text-main)", fontSize: "11px" }}>
                                  Msg: "{item.message}"
                                </div>
                              )}
                              {item.specialInstructions && (
                                <div style={{ color: "#b45309", fontWeight: 500, marginTop: "4px", fontSize: "11px" }}>
                                  Request: "{item.specialInstructions}"
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ verticalAlign: "top", padding: "16px 12px" }}>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--primary-dark)" }}>
                        AED {Number(order.totalAmount).toFixed(2)}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                        {order.paymentMethod}
                      </div>
                    </td>
                    <td style={{ verticalAlign: "top", padding: "16px 12px" }}>
                      <select
                        className="form-input"
                        style={{
                          padding: "6px 12px",
                          fontSize: "13px",
                          width: "100%",
                          borderColor: "var(--primary-gold)",
                          backgroundColor: "white",
                          margin: 0
                        }}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Footer */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderTop: "1px solid var(--border-light)",
              backgroundColor: "#fafafa",
              flexWrap: "wrap",
              gap: "12px"
            }}>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, filteredOrders.length)}</strong> of <strong>{filteredOrders.length}</strong> entries
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-light)",
                    backgroundColor: activePage === 1 ? "#f3f3f3" : "white",
                    color: activePage === 1 ? "var(--text-muted)" : "var(--text-main)",
                    cursor: activePage === 1 ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: 500
                  }}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isActive = pageNum === activePage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        minWidth: "32px",
                        height: "32px",
                        borderRadius: "4px",
                        border: "1px solid",
                        borderColor: isActive ? "var(--primary-gold)" : "var(--border-light)",
                        backgroundColor: isActive ? "var(--primary-gold)" : "white",
                        color: isActive ? "white" : "var(--text-main)",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === totalPages || totalPages === 0}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-light)",
                    backgroundColor: (activePage === totalPages || totalPages === 0) ? "#f3f3f3" : "white",
                    color: (activePage === totalPages || totalPages === 0) ? "var(--text-muted)" : "var(--text-main)",
                    cursor: (activePage === totalPages || totalPages === 0) ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: 500
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
