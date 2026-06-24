import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loadOrdersFromStorage, saveOrdersToStorage } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      deliveryDate,
      deliveryTimeSlot,
      paymentMethod,
      notes,
      totalAmount,
      items,
    } = body;

    // Validate request
    if (!customerName || !customerPhone || !deliveryAddress || !deliveryDate || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required order fields" },
        { status: 400 }
      );
    }

    try {
      // Try to create the order in the MySQL database via Prisma
      const order = await db.order.create({
        data: {
          customerName,
          customerPhone,
          customerEmail,
          deliveryAddress,
          deliveryDate: new Date(deliveryDate),
          deliveryTimeSlot,
          paymentMethod,
          notes: notes || null,
          totalAmount,
          status: "Pending",
          orderItems: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              flavor: item.flavor,
              size: item.size,
              message: item.message || null,
              specialInstructions: item.specialInstructions || null,
            })),
          },
        },
      });
      
      // Mirror database order to mock storage as backup
      try {
        const currentOrders = loadOrdersFromStorage();
        const newOrder = {
          id: order.id,
          customerName,
          customerPhone,
          customerEmail,
          deliveryAddress,
          deliveryDate,
          deliveryTimeSlot,
          paymentMethod,
          notes: notes || null,
          totalAmount,
          status: "Pending",
          createdAt: order.createdAt.toISOString(),
          orderItems: items.map((item: any, index: number) => ({
            id: index + 1,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            flavor: item.flavor,
            size: item.size,
            message: item.message || null,
            specialInstructions: item.specialInstructions || null,
            product: { name: item.name || "Cake" }
          }))
        };
        currentOrders.unshift(newOrder);
        saveOrdersToStorage(currentOrders);
      } catch (mockErr) {
        console.error("Failed to mirror DB order to mock storage:", mockErr);
      }

      return NextResponse.json({
        success: true,
        message: "Order placed successfully in database",
        orderId: order.id.toString(),
      });
    } catch (dbError) {
      console.error("MySQL Database save failed. Running in demo fallback mode.", dbError);

      const currentOrders = loadOrdersFromStorage();
      const nextId = currentOrders.length > 0 ? Math.max(...currentOrders.map((o: any) => o.id)) + 1 : 101;
      
      const newOrder = {
        id: nextId,
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        deliveryDate,
        deliveryTimeSlot,
        paymentMethod,
        notes: notes || null,
        totalAmount,
        status: "Pending",
        createdAt: new Date().toISOString(),
        orderItems: items.map((item: any, index: number) => ({
          id: index + 1,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          flavor: item.flavor,
          size: item.size,
          message: item.message || null,
          specialInstructions: item.specialInstructions || null,
          product: { name: item.name || "Cake" }
        }))
      };

      currentOrders.unshift(newOrder); // Add to the beginning of the list
      saveOrdersToStorage(currentOrders);

      return NextResponse.json({
        success: true,
        message: "Order placed in Demo Fallback Mode (DB Offline)",
        orderId: nextId.toString(),
      });
    }
  } catch (error) {
    console.error("API Orders error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
