const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing database contents
  // Order matters because of foreign key constraints
  await db.orderItem.deleteMany({});
  await db.order.deleteMany({});
  await db.product.deleteMany({});
  await db.category.deleteMany({});
  await db.adminUser.deleteMany({});

  console.log("Cleared old database data.");

  // 2. Create default Admin User
  // Password: adminpassword (hashed using bcrypt)
  const hashedPassword = await bcrypt.hash("adminpassword", 10);
  await db.adminUser.create({
    data: {
      username: "admin",
      password: hashedPassword,
    },
  });
  console.log("Created Admin User: 'admin' / 'adminpassword'");

  // 3. Create Categories
  const birthdayCategory = await db.category.create({
    data: {
      name: "Birthday Cakes",
      slug: "birthday-cakes",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
    },
  });

  const weddingCategory = await db.category.create({
    data: {
      name: "Wedding Cakes",
      slug: "wedding-cakes",
      image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&auto=format&fit=crop&q=80",
    },
  });

  const genderCategory = await db.category.create({
    data: {
      name: "Gender Reveal Cakes",
      slug: "gender-reveal-cakes",
      image: "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=600&auto=format&fit=crop&q=80",
    },
  });

  const kidsCategory = await db.category.create({
    data: {
      name: "Kids Cakes",
      slug: "kids-cakes",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
    },
  });

  const sweetSetsCategory = await db.category.create({
    data: {
      name: "Sweet Sets",
      slug: "sweet-sets",
      image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80",
    },
  });

  console.log("Created Categories.");

  // 4. Create Products (Cakes)
  // Birthday Cakes
  await db.product.createMany({
    data: [
      {
        name: "Blue Butterfly Queen Cake",
        slug: "blue-butterfly-queen-cake",
        description: "A gorgeous multi-tiered cake decorated with delicate blue edible butterflies, gold accents, and a royal crown. Perfect for making any birthday girl feel like royalty.",
        price: 250.00,
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80",
        categoryId: birthdayCategory.id,
        flavors: "Chocolate Ferrero, Vanilla Raspberry, Pistachio, Red Velvet",
        sizes: "1kg (6-8 portions), 1.5kg (10-12 portions), 2kg (14-16 portions)",
      },
      {
        name: "Classic Chocolate Fudge Cake",
        slug: "classic-chocolate-fudge-cake",
        description: "Rich, dense chocolate sponge layered with creamy dark chocolate fudge frosting. A timeless classic that chocolate lovers dream about.",
        price: 180.00,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
        categoryId: birthdayCategory.id,
        flavors: "Chocolate Fudge, Chocolate Mint, Double Chocolate",
        sizes: "1kg (6-8 portions), 1.5kg (10-12 portions), 2kg (14-16 portions)",
      },
      {
        name: "Golden Drip Berry Cake",
        slug: "golden-drip-berry-cake",
        description: "Elegant vanilla bean cake topped with a luxury gold drip, fresh raspberries, blueberries, and edible gold leaf.",
        price: 210.00,
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80",
        categoryId: birthdayCategory.id,
        flavors: "Vanilla Raspberry, Strawberry Shortcake, Lemon Blueberry",
        sizes: "1kg (6-8 portions), 1.5kg (10-12 portions), 2kg (14-16 portions)",
      }
    ]
  });

  // Wedding Cakes
  await db.product.createMany({
    data: [
      {
        name: "Luxury White Lace Wedding Cake",
        slug: "luxury-white-lace-wedding-cake",
        description: "A three-tier masterpieces features hand-piped edible white lace detailing, luxury sugar roses, and a sleek modern white fondant finish.",
        price: 850.00,
        image: "https://images.unsplash.com/photo-1522814835520-22c608198f6d?w=600&auto=format&fit=crop&q=80",
        categoryId: weddingCategory.id,
        flavors: "Vanilla Raspberry, Red Velvet, Pistachio Rose",
        sizes: "3kg (3 tiers), 5kg (3 large tiers), 8kg (4 tiers)",
      },
      {
        name: "Ethereal Pastel Floral Cake",
        slug: "ethereal-pastel-floral-cake",
        description: "Romantic semi-naked cake adorned with fresh seasonal pastel blooms, Eucalyptus leaves, and brushed gold leaf edges.",
        price: 600.00,
        image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&auto=format&fit=crop&q=80",
        categoryId: weddingCategory.id,
        flavors: "Vanilla Buttercream, Coconut Lime, Hazelnut Praline",
        sizes: "2kg (2 tiers), 3kg (3 tiers), 5kg (3 large tiers)",
      }
    ]
  });

  // Gender Reveal Cakes
  await db.product.createMany({
    data: [
      {
        name: "Twinkle Little Star Gender Reveal Cake",
        slug: "twinkle-little-star-gender-reveal",
        description: "Is it a boy or a girl? Find out with this beautiful cake. Decorated with cute stars, clouds, and pink/blue balloons. Filled with colored candy or colored cream inside.",
        price: 240.00,
        image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80",
        categoryId: genderCategory.id,
        flavors: "Cream-filled Blue (Boy), Cream-filled Pink (Girl)",
        sizes: "1.5kg (10-12 portions), 2kg (14-16 portions)",
      }
    ]
  });

  // Kids Cakes
  await db.product.createMany({
    data: [
      {
        name: "Jungle Animals Safari Cake",
        slug: "jungle-animals-safari-cake",
        description: "Bring the wild to life! Features cute sugar-crafted lions, giraffes, and elephants sitting in a lush green jungle theme. Kids love it!",
        price: 280.00,
        image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80",
        categoryId: kidsCategory.id,
        flavors: "Milk Chocolate, Vanilla Rainbow, Cookies & Cream",
        sizes: "1.5kg (10-12 portions), 2kg (14-16 portions)",
      }
    ]
  });

  // Sweet Sets
  await db.product.createMany({
    data: [
      {
        name: "Luxury French Macaron Box",
        slug: "luxury-french-macaron-box",
        description: "A luxury box of 12 artisan French macarons. Assorted gourmet flavors including Pistachio, Salted Caramel, Dark Chocolate, and Raspberry.",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&auto=format&fit=crop&q=80",
        categoryId: sweetSetsCategory.id,
        flavors: "Assorted Box",
        sizes: "Box of 12 pcs, Box of 24 pcs",
      },
      {
        name: "Premium Cupcake Assortment",
        slug: "premium-cupcake-assortment",
        description: "A pack of 6 gourmet cupcakes decorated beautifully to match your party. Features Red Velvet, Ferrero, and Vanilla Funfetti.",
        price: 90.00,
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&auto=format&fit=crop&q=80",
        categoryId: sweetSetsCategory.id,
        flavors: "Assorted Box",
        sizes: "Box of 6 pcs, Box of 12 pcs",
      }
    ]
  });

  console.log("Created Products.");
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
