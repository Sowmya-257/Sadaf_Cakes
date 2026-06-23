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
  product: { name: string };
}

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string;
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

      <div className="table-card">
        {isDataLoading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>No orders placed yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Details</th>
                <th>Delivery Info</th>
                <th>Ordered Items</th>
                <th>Total Amount</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>#{order.id}</strong>
                  </td>
                  <td>
                    <strong>{order.customerName}</strong>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Phone: {order.customerPhone} <br />
                      Email: {order.customerEmail || "No Email"}
                    </div>
                  </td>
                  <td>
                    <div>
                      Date: {new Date(order.deliveryDate).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} <br />
                      Time: {order.deliveryTimeSlot}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", maxWidth: "250px" }}>
                      Address: {order.deliveryAddress}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {order.orderItems.map((item) => (
                        <div key={item.id} style={{ fontSize: "13px" }}>
                          <strong>{item.product?.name || "Cake"}</strong> x {item.quantity} <br />
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            ({item.size} / {item.flavor})
                            {item.message && <span> Msg: "{item.message}"</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: "var(--primary-dark)" }}>
                      AED {Number(order.totalAmount).toFixed(2)}
                    </span>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{order.paymentMethod}</div>
                  </td>
                  <td>
                    <select
                      className="form-input"
                      style={{
                        padding: "6px 12px",
                        fontSize: "13px",
                        width: "140px",
                        borderColor: "var(--primary-gold)",
                        backgroundColor: "white",
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
        )}
      </div>
    </div>
  );
}
