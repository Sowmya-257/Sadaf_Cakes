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
        name: "Vintage Candelabra Eid Cake",
        slug: "vintage-candelabra-eid-cake",
        description: "A majestic teal vintage cake featuring detailed piping, an elegant candelabra topper with functional candles, and a custom Eid Mubarak greeting.",
        price: 290.00,
        image: "/images/vintage_candelabra_cake.png",
        categoryId: birthdayCategory.id,
        flavors: "Chocolate Ferrero, Vanilla Raspberry, Pistachio, Red Velvet",
        sizes: "1kg (6-8 portions), 1.5kg (10-12 portions), 2kg (14-16 portions)",
      },
      {
        name: "Grey Gold Boss Cake",
        slug: "grey-gold-boss-cake",
        description: "A sleek grey textured buttercream cake embellished with gold leaf, gourmet blackberries, chocolate shards, and custom Happy Birthday Boss lettering.",
        price: 270.00,
        image: "/images/grey_gold_cake.png",
        categoryId: birthdayCategory.id,
        flavors: "Chocolate Fudge, Chocolate Mint, Double Chocolate",
        sizes: "1kg (6-8 portions), 1.5kg (10-12 portions), 2kg (14-16 portions)",
      },
      {
        name: "Navy Modern Cake",
        slug: "navy-modern-cake",
        description: "An elegant deep navy blue cake detailed with modern gold stroke textures and sleek styling, perfect for sophisticated celebrations.",
        price: 249.00,
        image: "/images/navy_modern_cake.png",
        categoryId: birthdayCategory.id,
        flavors: "Chocolate Ferrero, Vanilla Raspberry, Pistachio, Red Velvet",
        sizes: "1kg (6-8 portions), 1.5kg (10-12 portions), 2kg (14-16 portions)",
      },
      {
        name: "Beer Mug Cake",
        slug: "beer-mug-cake",
        description: "A fun and incredibly detailed novelty cake designed to look like a foaming mug of beer. A crowd-favorite for birthdays and celebrations.",
        price: 280.00,
        image: "/images/beer_mug_cake.png",
        categoryId: birthdayCategory.id,
        flavors: "Chocolate Fudge, Chocolate Mint, Double Chocolate",
        sizes: "1.3kg (6-8 portions), 1.5kg (10-12 portions)",
      }
    ]
  });

  // Wedding Cakes
  await db.product.createMany({
    data: [
      {
        name: "Luxury White Lace Wedding Cake",
        slug: "luxury-white-lace-wedding-cake",
        description: "A three-tier masterpiece features hand-piped edible white lace detailing, luxury sugar roses, and a sleek modern white fondant finish.",
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
        name: "Teddy Bear Gender Reveal Cake",
        slug: "teddy-bear-gender-reveal-cake",
        description: "Is it a boy or a girl? Find out with this beautiful cake. Decorated with a cute teddy bear holding balloons, baby clothes washing line accents, and pink/blue details.",
        price: 240.00,
        image: "/images/teddy_bear_gender_reveal.png",
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
        name: "Dinosaur Adventure Cake",
        slug: "dinosaur-adventure-cake",
        description: "A thrilling prehistoric dinosaur adventure cake detailed with custom dinosaur toppers, grass buttercream frosting, and personalized HBD lettering.",
        price: 280.00,
        image: "/images/dinosaur_cake.png",
        categoryId: kidsCategory.id,
        flavors: "Milk Chocolate, Vanilla Rainbow, Cookies & Cream",
        sizes: "1.5kg (10-12 portions), 2kg (14-16 portions)",
      },
      {
        name: "Minnie Mouse Hearts Cake",
        slug: "minnie-mouse-hearts-cake",
        description: "An adorable Minnie Mouse themed custom kids cake detailed with red hearts, red and white topper spheres, and personalized name lettering.",
        price: 259.00,
        image: "/images/minnie_mouse_cake.png",
        categoryId: kidsCategory.id,
        flavors: "Milk Chocolate, Vanilla Rainbow, Cookies & Cream",
        sizes: "1.5kg (10-12 portions), 2kg (14-16 portions)",
      },
      {
        name: "Stitch Birthday Cake",
        slug: "stitch-birthday-cake",
        description: "Bring the magic of Stitch to your birthday! Adorned with beautiful blue buttercream, tropical flowers, and a detailed Stitch figure topper.",
        price: 259.00,
        image: "/images/stitch_birthday_cake.png",
        categoryId: kidsCategory.id,
        flavors: "Milk Chocolate, Vanilla Rainbow, Cookies & Cream",
        sizes: "1.5kg (10-12 portions), 2kg (14-16 portions)",
      },
      {
        name: "Paw Patrol Cake",
        slug: "paw-patrol-cake",
        description: "A colorful, vibrant cake featuring paw patrol prints, bone details, and custom themed toppers. Perfect for young fans of the series.",
        price: 259.00,
        image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80",
        categoryId: kidsCategory.id,
        flavors: "Milk Chocolate, Vanilla Rainbow, Cookies & Cream",
        sizes: "1.5kg (10-12 portions), 2kg (14-16 portions)",
      },
      {
        name: "Frozen Birthday Cake",
        slug: "frozen-birthday-cake",
        description: "An enchanting winter wonderland cake detailed with delicate edible snowflakes, ice blue gradients, and custom Elsa & Anna toppers.",
        price: 259.00,
        image: "/images/frozen_birthday_cake.png",
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
        name: "Ramadan Truffle Dessert Box",
        slug: "ramadan-truffle-dessert-box",
        description: "A premium, festive box of 35 assorted gourmet chocolate truffles. Perfect for sharing with friends and family during holy celebrations.",
        price: 159.00,
        image: "/images/ramadan_truffle_box.png",
        categoryId: sweetSetsCategory.id,
        flavors: "Assorted Box",
        sizes: "Box of 35 pcs",
      },
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
