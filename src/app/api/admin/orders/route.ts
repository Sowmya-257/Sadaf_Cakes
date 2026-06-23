import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loadOrdersFromStorage, saveOrdersToStorage } from "@/lib/data";

export async function GET(req: NextRequest) {
  // Check authorization header
  const token = req.headers.get("Authorization");
  if (token !== "Bearer admin-secure-token-12345") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await db.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.warn("Database failed to fetch orders. Falling back to mock orders.", error);
    // Load orders dynamically from mock_orders.json
    return NextResponse.json({ success: true, orders: loadOrdersFromStorage(), isDemoMode: true });
  }
}

export async function PATCH(req: NextRequest) {
  // Check authorization header
  const token = req.headers.get("Authorization");
  if (token !== "Bearer admin-secure-token-12345") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: "OrderId and Status are required" }, { status: 400 });
    }

    try {
      const numericId = parseInt(orderId);
      
      const updatedOrder = await db.order.update({
        where: { id: isNaN(numericId) ? 0 : numericId },
        data: { status },
      });

      return NextResponse.json({
        success: true,
        message: `Order status updated to '${status}'`,
        order: updatedOrder,
      });
    } catch (dbError) {
      console.warn(`Database order status update failed for ID ${orderId}. Falling back to mock storage.`, dbError);
      
      const numericId = parseInt(orderId);
      const currentOrders = loadOrdersFromStorage();
      const index = currentOrders.findIndex(o => o.id === numericId);
      
      if (index > -1) {
        currentOrders[index].status = status;
        saveOrdersToStorage(currentOrders);
        
        return NextResponse.json({
          success: true,
          message: `Order status updated to '${status}' (DB Offline)`,
          order: currentOrders[index],
        });
      }
      
      return NextResponse.json({ success: false, message: "Order not found in mock storage" }, { status: 404 });
    }
  } catch (error) {
    console.error("Orders status update API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
