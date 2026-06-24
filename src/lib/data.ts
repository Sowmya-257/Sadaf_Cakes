import { db } from "./db";
import fs from "fs";
import path from "path";

// File path for in-memory simulation database
const MOCK_DB_PATH = path.join(process.cwd(), "src/lib/mock_db.json");
const MOCK_CATEGORIES_PATH = path.join(process.cwd(), "src/lib/mock_categories.json");

export const MOCK_CATEGORIES = [
  {
    id: 1,
    name: "Birthday Cakes",
    slug: "birthday-cakes",
    image: "/images/birthday_collection_bg.png",
  },
  {
    id: 2,
    name: "Wedding Cakes",
    slug: "wedding-cakes",
    image: "/images/wedding_collection_bg.png",
  },
  {
    id: 3,
    name: "Gender Reveal Cakes",
    slug: "gender-reveal-cakes",
    image: "/images/gender_reveal_collection_bg.png",
  },
  {
    id: 4,
    name: "Kids Cakes",
    slug: "kids-cakes",
    image: "/images/kids_collection_bg.png",
  },
  {
    id: 5,
    name: "Sweet Sets",
    slug: "sweet-sets",
    image: "/images/sweet_sets_collection_bg.png",
  },
];

// Initial mock products list
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Blue Butterfly Queen Cake",
    slug: "blue-butterfly-queen-cake",
    description: "A gorgeous multi-tiered cake decorated with delicate blue edible butterflies, gold accents, and a royal crown. Perfect for making any birthday girl feel like royalty.",
    price: 250.00,
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80",
    categoryId: 1,
    categorySlug: "birthday-cakes",
    flavors: "Chocolate Ferrero, Vanilla Raspberry, Pistachio, Red Velvet",
    sizes: "1kg (6-8 portions), 1.5kg (10-12 portions), 2kg (14-16 portions)",
    isActive: true,
  },
  {
    id: 2,
    name: "Classic Chocolate Fudge Cake",
    slug: "classic-chocolate-fudge-cake",
    description: "Rich, dense chocolate sponge layered with creamy dark chocolate fudge frosting. A timeless classic that chocolate lovers dream about.",
    price: 180.00,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    categoryId: 1,
    categorySlug: "birthday-cakes",
    flavors: "Chocolate Fudge, Chocolate Mint, Double Chocolate",
    sizes: "1kg (6-8 portions), 1.5kg (10-12 portions), 2kg (14-16 portions)",
    isActive: true,
  },
  {
    id: 3,
    name: "Golden Drip Berry Cake",
    slug: "golden-drip-berry-cake",
    description: "Elegant vanilla bean cake topped with a luxury gold drip, fresh raspberries, blueberries, and edible gold leaf.",
    price: 210.00,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80",
    categoryId: 1,
    categorySlug: "birthday-cakes",
    flavors: "Vanilla Raspberry, Strawberry Shortcake, Lemon Blueberry",
    sizes: "1kg (6-8 portions), 1.5kg (10-12 portions), 2kg (14-16 portions)",
    isActive: true,
  },
  {
    id: 4,
    name: "Luxury White Lace Wedding Cake",
    slug: "luxury-white-lace-wedding-cake",
    description: "A three-tier masterpiece features hand-piped edible white lace detailing, luxury sugar roses, and a sleek modern white fondant finish.",
    price: 850.00,
    image: "https://images.unsplash.com/photo-1522814835520-22c608198f6d?w=600&auto=format&fit=crop&q=80",
    categoryId: 2,
    categorySlug: "wedding-cakes",
    flavors: "Vanilla Raspberry, Red Velvet, Pistachio Rose",
    sizes: "3kg (3 tiers), 5kg (3 large tiers), 8kg (4 tiers)",
    isActive: true,
  },
  {
    id: 5,
    name: "Ethereal Pastel Floral Cake",
    slug: "ethereal-pastel-floral-cake",
    description: "Romantic semi-naked cake adorned with fresh seasonal pastel blooms, Eucalyptus leaves, and brushed gold leaf edges.",
    price: 600.00,
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&auto=format&fit=crop&q=80",
    categoryId: 2,
    categorySlug: "wedding-cakes",
    flavors: "Vanilla Buttercream, Coconut Lime, Hazelnut Praline",
    sizes: "2kg (2 tiers), 3kg (3 tiers), 5kg (3 large tiers)",
    isActive: true,
  },
  {
    id: 6,
    name: "Twinkle Little Star Gender Reveal Cake",
    slug: "twinkle-little-star-gender-reveal",
    description: "Is it a boy or a girl? Find out with this beautiful cake. Decorated with cute stars, clouds, and pink/blue balloons. Filled with colored candy or colored cream inside.",
    price: 240.00,
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80",
    categoryId: 3,
    categorySlug: "gender-reveal-cakes",
    flavors: "Cream-filled Blue (Boy), Cream-filled Pink (Girl)",
    sizes: "1.5kg (10-12 portions), 2kg (14-16 portions)",
    isActive: true,
  },
  {
    id: 7,
    name: "Jungle Animals Safari Cake",
    slug: "jungle-animals-safari-cake",
    description: "Bring the wild to life! Features cute sugar-crafted lions, giraffes, and elephants sitting in a lush green jungle theme. Kids love it!",
    price: 280.00,
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80",
    categoryId: 4,
    categorySlug: "kids-cakes",
    flavors: "Milk Chocolate, Vanilla Rainbow, Cookies & Cream",
    sizes: "1.5kg (10-12 portions), 2kg (14-16 portions)",
    isActive: true,
  },
  {
    id: 8,
    name: "Luxury French Macaron Box",
    slug: "luxury-french-macaron-box",
    description: "A luxury box of 12 artisan French macarons. Assorted gourmet flavors including Pistachio, Salted Caramel, Dark Chocolate, and Raspberry.",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&auto=format&fit=crop&q=80",
    categoryId: 5,
    categorySlug: "sweet-sets",
    flavors: "Assorted Box",
    sizes: "Box of 12 pcs, Box of 24 pcs",
    isActive: true,
  },
];

// Helper to load products from JSON file database
export function loadProductsFromStorage(): any[] {
  try {
    if (!fs.existsSync(MOCK_DB_PATH)) {
      const dir = path.dirname(MOCK_DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(INITIAL_PRODUCTS, null, 2), "utf-8");
      return INITIAL_PRODUCTS;
    }
    const data = fs.readFileSync(MOCK_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read mock_db.json, using static fallback", error);
    return INITIAL_PRODUCTS;
  }
}

// Helper to save products to JSON file database
export function saveProductsToStorage(products: any[]) {
  try {
    const dir = path.dirname(MOCK_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(products, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to mock_db.json", error);
  }
}

// Helper to load categories from JSON file database
export function loadCategoriesFromStorage(): any[] {
  try {
    if (!fs.existsSync(MOCK_CATEGORIES_PATH)) {
      const dir = path.dirname(MOCK_CATEGORIES_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(MOCK_CATEGORIES_PATH, JSON.stringify(MOCK_CATEGORIES, null, 2), "utf-8");
      return MOCK_CATEGORIES;
    }
    const data = fs.readFileSync(MOCK_CATEGORIES_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read mock_categories.json, using static fallback", error);
    return MOCK_CATEGORIES;
  }
}

// Helper to save categories to JSON file database
export function saveCategoriesToStorage(categories: any[]) {
  try {
    const dir = path.dirname(MOCK_CATEGORIES_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MOCK_CATEGORIES_PATH, JSON.stringify(categories, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to mock_categories.json", error);
  }
}

// 1. Fetch all categories
export async function getCategories() {
  try {
    return await db.category.findMany();
  } catch (error) {
    console.warn("Database connection failed. Falling back to mock categories.", error);
    return loadCategoriesFromStorage();
  }
}

// 2. Fetch products by category slug
export async function getProductsByCategory(categorySlug: string) {
  try {
    const category = await db.category.findUnique({
      where: { slug: categorySlug },
      include: { products: true },
    });
    return category ? category.products : [];
  } catch (error) {
    console.warn(`Database connection failed. Falling back to mock products for category '${categorySlug}'.`);
    
    // Read categories and products dynamically
    const currentCategories = loadCategoriesFromStorage();
    const category = currentCategories.find((c) => c.slug === categorySlug);
    if (!category) return [];
    
    const currentProducts = loadProductsFromStorage();
    return currentProducts.filter((p) => p.categoryId === category.id && p.isActive);
  }
}

// 3. Fetch single product by slug
export async function getProductBySlug(slug: string) {
  try {
    return await db.product.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch (error) {
    console.warn(`Database connection failed. Falling back to mock product '${slug}'.`);
    
    // Read products dynamically
    const currentProducts = loadProductsFromStorage();
    const product = currentProducts.find((p) => p.slug === slug);
    if (!product) return null;
    
    const currentCategories = loadCategoriesFromStorage();
    const category = currentCategories.find((c) => c.id === product.categoryId);
    return {
      ...product,
      category: category || { name: "Cakes", slug: "cakes", id: 0, image: "" },
    };
  }
}

// 4. Fetch featured products (e.g. first 4 products)
export async function getFeaturedProducts() {
  try {
    return await db.product.findMany({
      take: 4,
      where: { isActive: true },
    });
  } catch (error) {
    console.warn("Database connection failed. Falling back to mock featured products.");
    
    // Read products dynamically
    const currentProducts = loadProductsFromStorage();
    return currentProducts.filter(p => p.isActive).slice(0, 4);
  }
}

// File path for in-memory simulated orders
const MOCK_ORDERS_PATH = path.join(process.cwd(), "src/lib/mock_orders.json");

const INITIAL_ORDERS = [
  {
    id: 101,
    customerName: "Sarah Connor",
    customerPhone: "+971 50 123 4567",
    customerEmail: "sarah@example.com",
    deliveryAddress: "Apartment 1402, Marina Heights, Dubai Marina, Dubai",
    deliveryDate: new Date().toISOString().split("T")[0],
    deliveryTimeSlot: "12:00 PM - 03:00 PM",
    paymentMethod: "Cash on Delivery",
    totalAmount: 250.00,
    status: "Pending",
    createdAt: new Date().toISOString(),
    orderItems: [
      {
        id: 1,
        productId: 1,
        quantity: 1,
        price: 250.00,
        flavor: "Chocolate Ferrero",
        size: "1kg (6-8 portions)",
        message: "Happy Birthday Sarah!",
        product: { name: "Blue Butterfly Queen Cake" }
      }
    ]
  },
  {
    id: 102,
    customerName: "Aisha Salem",
    customerPhone: "+971 56 987 6543",
    customerEmail: "aisha@example.com",
    deliveryAddress: "Villa 22, Al Barsha 2, Dubai",
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    deliveryTimeSlot: "03:00 PM - 06:00 PM",
    paymentMethod: "Card on Delivery",
    totalAmount: 600.00,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
    orderItems: [
      {
        id: 2,
        productId: 5,
        quantity: 1,
        price: 600.00,
        flavor: "Vanilla Buttercream",
        size: "2kg (2 tiers)",
        message: "Happy Anniversary Mom & Dad",
        product: { name: "Ethereal Pastel Floral Cake" }
      }
    ]
  }
];

export function loadOrdersFromStorage(): any[] {
  try {
    if (!fs.existsSync(MOCK_ORDERS_PATH)) {
      const dir = path.dirname(MOCK_ORDERS_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(MOCK_ORDERS_PATH, JSON.stringify(INITIAL_ORDERS, null, 2), "utf-8");
      return INITIAL_ORDERS;
    }
    const data = fs.readFileSync(MOCK_ORDERS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read mock_orders.json, using static fallback", error);
    return INITIAL_ORDERS;
  }
}

export function saveOrdersToStorage(orders: any[]) {
  try {
    const dir = path.dirname(MOCK_ORDERS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MOCK_ORDERS_PATH, JSON.stringify(orders, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to mock_orders.json", error);
  }
}

