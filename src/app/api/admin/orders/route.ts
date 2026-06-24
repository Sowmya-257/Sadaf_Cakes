import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loadOrdersFromStorage, saveOrdersToStorage } from "@/lib/data";

async function syncDatabaseAndMock() {
  try {
    // 1. Load mock orders
    const mockOrders = loadOrdersFromStorage();
    
    // 2. Fetch database orders
    const dbOrders = await db.order.findMany({
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

    // Case 1: Database has 0 orders, but mock has orders.
    // This is a fresh database setup. We should import all mock orders to MySQL.
    if (dbOrders.length === 0 && mockOrders.length > 0) {
      for (const mockOrder of mockOrders) {
        try {
          await db.order.create({
            data: {
              id: mockOrder.id,
              customerName: mockOrder.customerName,
              customerPhone: mockOrder.customerPhone,
              customerEmail: mockOrder.customerEmail,
              deliveryAddress: mockOrder.deliveryAddress,
              deliveryDate: new Date(mockOrder.deliveryDate),
              deliveryTimeSlot: mockOrder.deliveryTimeSlot,
              paymentMethod: mockOrder.paymentMethod,
              notes: mockOrder.notes,
              totalAmount: mockOrder.totalAmount,
              status: mockOrder.status,
              createdAt: new Date(mockOrder.createdAt),
              orderItems: {
                create: mockOrder.orderItems.map((item: any) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                  flavor: item.flavor,
                  size: item.size,
                  message: item.message || null,
                  specialInstructions: item.specialInstructions || null,
                }))
              }
            }
          });
        } catch (dbErr) {
          console.error(`Failed to import mock order #${mockOrder.id} to MySQL:`, dbErr);
        }
      }
      // Re-fetch dbOrders after seeding
      return await db.order.findMany({
        include: { orderItems: { include: { product: true } } },
        orderBy: { createdAt: "desc" }
      });
    }

    // Case 2: Database has orders. We need to synchronize them.
    if (dbOrders.length > 0) {
      let mockOrdersChanged = false;
      const updatedMockOrders = [...mockOrders];

      // Find the latest DB order creation time
      const latestDbOrderTime = new Date(dbOrders[0].createdAt).getTime();

      // Check if there are any orders in the database that are NOT in mock_orders.json, and add them
      for (const dbOrder of dbOrders) {
        const inMock = mockOrders.some(mo => mo.id === dbOrder.id);
        if (!inMock) {
          // Add DB order to mock orders
          updatedMockOrders.unshift({
            id: dbOrder.id,
            customerName: dbOrder.customerName,
            customerPhone: dbOrder.customerPhone,
            customerEmail: dbOrder.customerEmail,
            deliveryAddress: dbOrder.deliveryAddress,
            deliveryDate: dbOrder.deliveryDate.toISOString().split("T")[0],
            deliveryTimeSlot: dbOrder.deliveryTimeSlot,
            paymentMethod: dbOrder.paymentMethod,
            notes: dbOrder.notes,
            totalAmount: Number(dbOrder.totalAmount),
            status: dbOrder.status,
            createdAt: dbOrder.createdAt.toISOString(),
            orderItems: dbOrder.orderItems.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              price: Number(item.price),
              flavor: item.flavor,
              size: item.size,
              message: item.message,
              specialInstructions: item.specialInstructions,
              product: { name: item.product?.name || "Cake" }
            }))
          });
          mockOrdersChanged = true;
        }
      }

      // Check if there are orders in mock_orders.json that are NOT in the database
      // If mockOrder was created BEFORE or AT the latest DB order, it means it was deleted from DB, so we delete it from mock.
      // If mockOrder was created AFTER the latest DB order, it means it was created in mock mode and needs to be imported to DB.
      const mockOrdersToKeep: any[] = [];
      for (const mockOrder of updatedMockOrders) {
        const inDb = dbOrders.some(dbo => dbo.id === mockOrder.id);
        if (inDb) {
          mockOrdersToKeep.push(mockOrder);
        } else {
          // Not in DB. Check when it was created.
          const mockTime = new Date(mockOrder.createdAt).getTime();
          if (mockTime > latestDbOrderTime) {
            // Created after latest DB order (placed while DB was offline). Import to DB!
            try {
              const importedOrder = await db.order.create({
                data: {
                  customerName: mockOrder.customerName,
                  customerPhone: mockOrder.customerPhone,
                  customerEmail: mockOrder.customerEmail,
                  deliveryAddress: mockOrder.deliveryAddress,
                  deliveryDate: new Date(mockOrder.deliveryDate),
                  deliveryTimeSlot: mockOrder.deliveryTimeSlot,
                  paymentMethod: mockOrder.paymentMethod,
                  notes: mockOrder.notes,
                  totalAmount: mockOrder.totalAmount,
                  status: mockOrder.status,
                  createdAt: new Date(mockOrder.createdAt),
                  orderItems: {
                    create: mockOrder.orderItems.map((item: any) => ({
                      productId: item.productId,
                      quantity: item.quantity,
                      price: item.price,
                      flavor: item.flavor,
                      size: item.size,
                      message: item.message || null,
                      specialInstructions: item.specialInstructions || null,
                    }))
                  }
                }
              });
              // Update mock order ID to match the newly generated DB ID
              mockOrder.id = importedOrder.id;
              mockOrdersToKeep.push(mockOrder);
              mockOrdersChanged = true;
            } catch (err) {
              console.error(`Failed to import offline order #${mockOrder.id}`, err);
              mockOrdersToKeep.push(mockOrder); // Keep it to retry later
            }
          } else {
            // Created before latest DB order. This means it was deleted from the DB! Delete it from mock.
            mockOrdersChanged = true;
          }
        }
      }

      if (mockOrdersChanged) {
        // Sort mock orders descending by id
        mockOrdersToKeep.sort((a, b) => b.id - a.id);
        saveOrdersToStorage(mockOrdersToKeep);
      }

      // Re-fetch dbOrders to return the latest updated database list
      return await db.order.findMany({
        include: { orderItems: { include: { product: true } } },
        orderBy: { createdAt: "desc" }
      });
    }

    return dbOrders;
  } catch (error) {
    console.error("syncDatabaseAndMock error:", error);
    return loadOrdersFromStorage();
  }
}

export async function GET(req: NextRequest) {
  // Check authorization header
  const token = req.headers.get("Authorization");
  if (token !== "Bearer admin-secure-token-12345") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await syncDatabaseAndMock();
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

      // Synchronize update to mock storage
      try {
        const currentOrders = loadOrdersFromStorage();
        const index = currentOrders.findIndex(o => o.id === numericId);
        if (index > -1) {
          currentOrders[index].status = status;
          saveOrdersToStorage(currentOrders);
        }
      } catch (err) {
        console.error("Failed to update status in mock storage:", err);
      }

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

