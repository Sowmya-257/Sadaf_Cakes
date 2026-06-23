import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loadProductsFromStorage, saveProductsToStorage, loadCategoriesFromStorage } from "@/lib/data";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");
  if (token !== "Bearer admin-secure-token-12345") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await db.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.warn("Database failed to fetch products for admin. Falling back to mock products.", error);
    return NextResponse.json({ success: true, products: loadProductsFromStorage(), isDemoMode: true });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization");
  if (token !== "Bearer admin-secure-token-12345") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, price, image, categoryId, flavors, sizes } = body;

    if (!name || !price || !categoryId || !flavors || !sizes) {
      return NextResponse.json({ success: false, message: "Missing required product fields" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    try {
      const product = await db.product.create({
        data: {
          name,
          slug,
          description: description || "",
          price: parseFloat(price),
          image: image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
          categoryId: parseInt(categoryId),
          flavors,
          sizes,
        },
      });

      return NextResponse.json({ success: true, message: "Product created successfully", product });
    } catch (dbError) {
      console.warn("Database product insertion failed. Mocking success for demo mode.", dbError);
      const currentCategories = loadCategoriesFromStorage();
      const catId = parseInt(categoryId);
      const matchedCategory = currentCategories.find(c => c.id === catId);
      const catSlug = matchedCategory ? matchedCategory.slug : "birthday-cakes";
      
      const mockProduct = {
        id: Math.floor(1000 + Math.random() * 9000),
        name,
        slug,
        description: description || "",
        price: parseFloat(price),
        image: image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
        categoryId: catId,
        categorySlug: catSlug,
        flavors,
        sizes,
        isActive: true,
      };
      const currentProducts = loadProductsFromStorage();
      currentProducts.push(mockProduct);
      saveProductsToStorage(currentProducts);
      
      return NextResponse.json({
        success: true,
        message: "Product added in Demo Fallback Mode (DB Offline)",
        product: mockProduct,
      });
    }
  } catch (error) {
    console.error("Product creation API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization");
  if (token !== "Bearer admin-secure-token-12345") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    try {
      const numericId = parseInt(id);
      await db.product.delete({
        where: { id: isNaN(numericId) ? 0 : numericId },
      });

      return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (dbError) {
      console.warn(`Database product deletion failed for ID ${id}. Mock-succeeding.`, dbError);
      
      const numericId = parseInt(id);
      const currentProducts = loadProductsFromStorage();
      const index = currentProducts.findIndex((p: any) => p.id === numericId);
      if (index > -1) {
        currentProducts.splice(index, 1);
        saveProductsToStorage(currentProducts);
      }
      
      return NextResponse.json({
        success: true,
        message: "Product deleted in Demo Fallback Mode (DB Offline)",
        deletedId: id,
      });
    }
  } catch (error) {
    console.error("Product deletion API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("Authorization");
  if (token !== "Bearer admin-secure-token-12345") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, description, price, image, categoryId, flavors, sizes } = body;

    if (!id || !name || !price || !categoryId || !flavors || !sizes) {
      return NextResponse.json({ success: false, message: "Missing required fields for update" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    try {
      const numericId = parseInt(id);
      const product = await db.product.update({
        where: { id: isNaN(numericId) ? 0 : numericId },
        data: {
          name,
          slug,
          description: description || "",
          price: parseFloat(price),
          image: image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
          categoryId: parseInt(categoryId),
          flavors,
          sizes,
        },
      });

      return NextResponse.json({ success: true, message: "Product updated successfully", product });
    } catch (dbError) {
      console.warn("Database product update failed. Mocking success for demo mode.", dbError);

      const numericId = parseInt(id);
      const currentProducts = loadProductsFromStorage();
      const index = currentProducts.findIndex((p: any) => p.id === numericId);

      if (index > -1) {
        const currentCategories = loadCategoriesFromStorage();
        const catId = parseInt(categoryId);
        const matchedCategory = currentCategories.find(c => c.id === catId);
        const catSlug = matchedCategory ? matchedCategory.slug : "birthday-cakes";

        const updatedProduct = {
          ...currentProducts[index],
          name,
          slug,
          description: description || "",
          price: parseFloat(price),
          image: image || currentProducts[index].image,
          categoryId: catId,
          categorySlug: catSlug,
          flavors,
          sizes,
        };

        currentProducts[index] = updatedProduct;
        saveProductsToStorage(currentProducts);

        return NextResponse.json({
          success: true,
          message: "Product updated in Demo Fallback Mode (DB Offline)",
          product: updatedProduct,
        });
      }

      return NextResponse.json({ success: false, message: "Product not found for update" }, { status: 404 });
    }
  } catch (error) {
    console.error("Product update API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
