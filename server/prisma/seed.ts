import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Demo1234!';

const users = [
  {
    name: 'Demo User',
    email: 'demo@blademart.com',
    role: Role.USER,
  },
  {
    name: 'Admin User',
    email: 'admin@blademart.com',
    role: Role.ADMIN,
  },
];

const products = [
  {
    name: 'Damascus Chef Knife',
    slug: 'damascus-chef-knife',
    description:
      'Hand-forged Damascus steel chef knife with a full-tang rosewood handle. Razor-sharp 8-inch blade perfect for precision cutting, slicing, and dicing. Each knife features a unique Damascus pattern.',
    price: 189.99,
    category: 'Chef Knives',
    brand: 'BladeCraft',
    imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80',
    stock: 25,
    featured: true,
    rating: 4.8,
  },
  {
    name: 'Japanese Santoku Knife',
    slug: 'japanese-santoku-knife',
    description:
      'Authentic Japanese Santoku knife crafted from VG-10 high-carbon steel. Hollow-ground blade reduces food sticking. Ergonomic Pakkawood handle ensures comfortable all-day use.',
    price: 124.99,
    category: 'Chef Knives',
    brand: 'TokyoEdge',
    imageUrl: 'https://images.unsplash.com/photo-1588557132645-ff567110cafd?w=800&q=80',
    stock: 40,
    featured: true,
    rating: 4.7,
  },
  {
    name: 'Carbon Steel Bread Knife',
    slug: 'carbon-steel-bread-knife',
    description:
      'Professional 10-inch serrated bread knife made from high-carbon German steel. Offset handle design protects knuckles during cutting. Dishwasher safe with a lifetime warranty.',
    price: 79.99,
    category: 'Specialty Knives',
    brand: 'GermanForge',
    imageUrl: 'https://images.unsplash.com/photo-1569925660765-37dc2c2eef3b?w=800&q=80',
    stock: 60,
    featured: false,
    rating: 4.5,
  },
  {
    name: 'Tactical Folding Knife',
    slug: 'tactical-folding-knife',
    description:
      '3.5-inch drop-point blade in AUS-8 stainless steel with a titanium-coated finish. Frame-lock mechanism, pocket clip included. Built for EDC enthusiasts and outdoor adventurers.',
    price: 64.99,
    category: 'Folding Knives',
    brand: 'TactEdge',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    stock: 80,
    featured: true,
    rating: 4.6,
  },
  {
    name: 'Hunting & Field Knife',
    slug: 'hunting-field-knife',
    description:
      'Fixed-blade hunting knife with a 5-inch 420HC stainless steel blade. Rubberized grip with finger guard for safety. Includes genuine leather sheath with belt loop.',
    price: 94.99,
    category: 'Hunting Knives',
    brand: 'WildBlade',
    imageUrl: 'https://images.unsplash.com/photo-1585411622793-45bf60ddbdef?w=800&q=80',
    stock: 35,
    featured: false,
    rating: 4.4,
  },
  {
    name: 'Ceramic Paring Knife Set',
    slug: 'ceramic-paring-knife-set',
    description:
      'Set of 3 ultra-sharp ceramic paring knives in 3, 4, and 5-inch sizes. Zirconia ceramic blades never rust and hold their edge up to 10x longer than steel. Ergonomic color-coded handles.',
    price: 44.99,
    category: 'Specialty Knives',
    brand: 'PureCut',
    imageUrl: 'https://images.unsplash.com/photo-1571781565036-d3f759be73e4?w=800&q=80',
    stock: 55,
    featured: false,
    rating: 4.3,
  },
  {
    name: 'Professional Cleaver',
    slug: 'professional-cleaver',
    description:
      '7-inch heavy-duty cleaver forged from a single piece of 4116 German stainless steel. Thickened spine for chopping through bones. Ergonomic triple-riveted handle for maximum control.',
    price: 109.99,
    category: 'Chef Knives',
    brand: 'GermanForge',
    imageUrl: 'https://images.unsplash.com/photo-1615996001375-c7ef13294436?w=800&q=80',
    stock: 20,
    featured: false,
    rating: 4.6,
  },
  {
    name: 'Steak Knife Set (6-Piece)',
    slug: 'steak-knife-set-6-piece',
    description:
      'Elegant 6-piece steak knife set with serrated high-carbon stainless blades. Polished handles made from premium pakkawood. Comes in a handcrafted wooden gift box.',
    price: 149.99,
    category: 'Kitchen Sets',
    brand: 'TableCraft',
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80',
    stock: 30,
    featured: true,
    rating: 4.9,
  },
  {
    name: 'Bowie Survival Knife',
    slug: 'bowie-survival-knife',
    description:
      'Full-tang 9-inch Bowie knife with D2 tool steel blade. Includes fire starter, paracord, and molle-compatible sheath. Rated for extreme conditions. Built for survivalists.',
    price: 134.99,
    category: 'Hunting Knives',
    brand: 'WildBlade',
    imageUrl: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80',
    stock: 18,
    featured: false,
    rating: 4.7,
  },
  {
    name: 'Whetstone Sharpening Kit',
    slug: 'whetstone-sharpening-kit',
    description:
      'Professional dual-sided whetstone kit (400/1000 and 3000/8000 grit) with non-slip bamboo base, angle guide, flattening stone, and leather strop. Restore any blade to factory-sharp.',
    price: 54.99,
    category: 'Accessories',
    brand: 'SharpMaster',
    imageUrl: 'https://images.unsplash.com/photo-1628349065790-7ebbbfff5ac3?w=800&q=80',
    stock: 100,
    featured: false,
    rating: 4.8,
  },
  {
    name: 'Magnetic Knife Strip',
    slug: 'magnetic-knife-strip',
    description:
      '16-inch stainless steel magnetic knife strip with concealed mounting hardware. Holds up to 10 knives safely. Wall-mounted storage keeps blades sharp and accessible.',
    price: 39.99,
    category: 'Accessories',
    brand: 'KitchenPro',
    imageUrl: 'https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=800&q=80',
    stock: 75,
    featured: false,
    rating: 4.5,
  },
  {
    name: 'Damascus Pocket Knife',
    slug: 'damascus-pocket-knife',
    description:
      '2.8-inch Damascus steel blade with stunning twist pattern. Smooth ball-bearing pivot, G10 handle scales, and reversible clip. A collector-grade EDC knife that performs as beautifully as it looks.',
    price: 84.99,
    category: 'Folding Knives',
    brand: 'BladeCraft',
    imageUrl: 'https://images.unsplash.com/photo-1602524806372-dc1f8cb63ddd?w=800&q=80',
    stock: 45,
    featured: true,
    rating: 4.9,
  },
];

async function main() {
  console.info('🌱 Starting database seed...');

  // Clear existing data in correct order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.info('🗑️  Cleared existing records');

  // Hash password once for all demo users
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  // Create users
  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: { ...user, passwordHash },
      })
    )
  );

  console.info(`👤 Created ${createdUsers.length} users`);

  // Create products
  const createdProducts = await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          ...product,
          price: product.price,
        },
      })
    )
  );

  console.info(`🔪 Created ${createdProducts.length} products`);
  console.info('✅ Seed complete!');
  console.info('');
  console.info('Demo credentials:');
  console.info('  Email:    demo@blademart.com');
  console.info('  Password: Demo1234!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
