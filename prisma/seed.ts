import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  // Optional: Add clearing logic if executing multiple times in development
  
  console.log('Seeding categories...');
  const categories = [
    { name: 'Jewelry Sets', slug: 'jewelry-sets' },
    { name: 'Hair Scrunchies', slug: 'hair-scrunchies' },
    { name: 'Hair Clips', slug: 'hair-clips' },
    { name: 'Hair Claws', slug: 'hair-claws' },
    { name: 'Bracelets', slug: 'bracelets' },
    { name: 'Accessories', slug: 'accessories' },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    });
    categoryMap[cat.name] = createdCat.id;
  }

  console.log('Seeding products...');
  const products = [
    {
      name: 'Champagne Crystal Jewelry Set',
      sku: 'ISLO-20180',
      price: 850,
      categoryName: 'Jewelry Sets',
      description: 'Elegant champagne crystal jewelry set perfect for weddings and formal events.',
      badge: null
    },
    {
      name: 'Silver Floral Pastel Jewelry Set',
      sku: 'HH-20100',
      price: 720,
      categoryName: 'Jewelry Sets',
      description: 'Delicate silver set with pastel floral details.',
      badge: 'New'
    },
    {
      name: 'Rose Gold Fringe Jewelry Set',
      sku: 'HK-20105',
      price: 680,
      categoryName: 'Jewelry Sets',
      description: 'Stunning rose gold tone set with fringe chain details.',
      badge: 'Bestseller'
    },
    {
      name: 'Neutral Tone Scrunchie Box Set',
      sku: 'BB-SCR-001',
      price: 420,
      categoryName: 'Hair Scrunchies',
      description: 'Soft and stretchy scrunchies in earth tones.',
      badge: null
    },
    {
      name: 'Pastel Pearl Scrunchie Box Set',
      sku: 'BB-SCR-002',
      price: 390,
      categoryName: 'Hair Scrunchies',
      description: 'Scrunchies adorned with embedded pearls in pastel hues.',
      badge: 'Hot'
    },
    {
      name: 'Floral Tulip Hair Claw Set',
      sku: 'UC-108-C',
      price: 310,
      categoryName: 'Hair Claws',
      description: 'Beautifully sculpted hair claw clips in shape of tulips.',
      badge: null
    },
    {
      name: 'Neutral Tulip Hair Claw Set',
      sku: 'UC-108-N',
      price: 310,
      categoryName: 'Hair Claws',
      description: 'Tulip hair claws in versatile neutral colors.',
      badge: null
    },
    {
      name: 'Oriental Print Hair Clip Set',
      sku: 'BOC-364',
      price: 280,
      categoryName: 'Hair Clips',
      description: 'Premium clips with oriental designs.',
      badge: null
    },
    {
      name: 'Crystal Tennis Bracelet',
      sku: 'BR-001',
      price: 450,
      categoryName: 'Bracelets',
      description: 'Sparkling crystal tennis bracelet, highly durable.',
      badge: 'Bestseller'
    },
    {
      name: 'Mixed Accessories Bundle',
      sku: 'BUNDLE-001',
      price: 1200,
      categoryName: 'Accessories',
      description: 'A curated mix of top selling accessories.',
      badge: null
    }
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {},
      create: {
        name: prod.name,
        sku: prod.sku,
        description: prod.description,
        price: prod.price,
        moq: 12,
        stock: 500,
        images: [],
        isActive: true,
        isFeatured: true,
        badge: prod.badge,
        category: {
          connect: { id: categoryMap[prod.categoryName] }
        }
      }
    });
  }

  console.log('Seeding admin user...');
  const adminEmail = 'admin@glamwholesale.com';
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
      isApproved: true,
    }
  });

  console.log('Seeding Site Settings...');
  const settingsCount = await prisma.siteSettings.count();
  if (settingsCount === 0) {
    await prisma.siteSettings.create({
      data: {
        whatsapp: '+919876543210',
        phone: '+919876543210',
        email: 'contact@glamwholesale.com',
        address: '123 Fashion Street, Mumbai, India',
        instagram: 'https://instagram.com/glamwholesale',
        facebook: 'https://facebook.com/glamwholesale',
        aboutText: 'India’s Premier Wholesale Accessories Supplier ensuring MOQ 12pcs for high quality products.'
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
