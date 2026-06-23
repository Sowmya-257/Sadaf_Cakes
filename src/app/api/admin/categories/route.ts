import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  loadCategoriesFromStorage,
  saveCategoriesToStorage,
  loadProductsFromStorage,
  saveProductsToStorage,
} from "@/lib/data";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization");
  if (token !== "Bearer admin-secure-token-12345") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await db.category.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.warn("Database failed to fetch categories. Falling back to mock categories.", error);
    return NextResponse.json({ success: true, categories: loadCategoriesFromStorage(), isDemoMode: true });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization");
  if (token !== "Bearer admin-secure-token-12345") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, image } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: "Category name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const imageUrl = image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80";

    try {
      const category = await db.category.create({
        data: { name, slug, image: imageUrl },
      });
      return NextResponse.json({ success: true, message: "Category created successfully", category });
    } catch (dbError) {
      console.warn("Database category insertion failed. Mocking success for demo mode.", dbError);

      const currentCategories = loadCategoriesFromStorage();
      const mockCategory = {
        id: currentCategories.length > 0 ? Math.max(...currentCategories.map(c => c.id)) + 1 : 1,
        name,
        slug,
        image: imageUrl,
      };

      currentCategories.push(mockCategory);
      saveCategoriesToStorage(currentCategories);

      return NextResponse.json({
        success: true,
        message: "Category added in Demo Fallback Mode (DB Offline)",
        category: mockCategory,
      });
    }
  } catch (error) {
    console.error("Category creation API Error:", error);
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
    const { id, name, image } = body;

    if (!id || !name) {
      return NextResponse.json({ success: false, message: "Category ID and name are required" }, { status: 400 });
    }

    const numericId = parseInt(id);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    try {
      const category = await db.category.update({
        where: { id: numericId },
        data: { name, slug, image },
      });
      return NextResponse.json({ success: true, message: "Category updated successfully", category });
    } catch (dbError) {
      console.warn("Database category update failed. Falling back to mock storage.", dbError);

      const currentCategories = loadCategoriesFromStorage();
      const index = currentCategories.findIndex((c) => c.id === numericId);

      if (index > -1) {
        const oldSlug = currentCategories[index].slug;
        const updatedCategory = {
          ...currentCategories[index],
          name,
          slug,
          image: image || currentCategories[index].image,
        };

        currentCategories[index] = updatedCategory;
        saveCategoriesToStorage(currentCategories);

        // Update product categorySlugs inside mock database fallback if it changed
        if (oldSlug !== slug) {
          const currentProducts = loadProductsFromStorage();
          const updatedProducts = currentProducts.map((p) => {
            if (p.categoryId === numericId) {
              return { ...p, categorySlug: slug };
            }
            return p;
          });
          saveProductsToStorage(updatedProducts);
        }

        return NextResponse.json({
          success: true,
          message: "Category updated in Demo Fallback Mode (DB Offline)",
          category: updatedCategory,
        });
      }

      return NextResponse.json({ success: false, message: "Category not found for update" }, { status: 404 });
    }
  } catch (error) {
    console.error("Category update API Error:", error);
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
      return NextResponse.json({ success: false, message: "Category ID is required" }, { status: 400 });
    }

    const numericId = parseInt(id);

    try {
      // 1. Delete associated products first to avoid foreign key violations
      await db.product.deleteMany({
        where: { categoryId: numericId },
      });

      // 2. Delete the category itself
      await db.category.delete({
        where: { id: numericId },
      });

      return NextResponse.json({ success: true, message: "Category and associated products deleted successfully" });
    } catch (dbError) {
      console.warn("Database category deletion failed. Falling back to mock storage.", dbError);

      // 1. Delete category from fallback storage
      const currentCategories = loadCategoriesFromStorage();
      const filteredCategories = currentCategories.filter((c) => c.id !== numericId);
      saveCategoriesToStorage(filteredCategories);

      // 2. Delete products from fallback storage
      const currentProducts = loadProductsFromStorage();
      const filteredProducts = currentProducts.filter((p) => p.categoryId !== numericId);
      saveProductsToStorage(filteredProducts);

      return NextResponse.json({
        success: true,
        message: "Category deleted in Demo Fallback Mode (DB Offline)",
        deletedId: id,
      });
    }
  } catch (error) {
    console.error("Category deletion API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

