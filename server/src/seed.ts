import fs from 'fs';
import path from 'path';

import prisma from './lib/prisma';

async function seedCategories(): Promise<void> {
  const categoriesPath = path.join(__dirname, '../data/categories.json');
  const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        description: category.name || null,
      },
    });
  }
  console.log('Seeded categories');
}

async function seedBrands(): Promise<void> {
  const brandsPath = path.join(__dirname, '../data/brands.json');
  const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf-8'));

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { name: brand.name },
      update: {},
      create: {
        name: brand.name,
        originCountry: null,
        description: brand.description || null,
      },
    });
  }
  console.log('Seeded brands');
}

async function seedProducts(): Promise<void> {
  const productsPath = path.join(__dirname, '../data/all_products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

  for (const product of products) {
    // Lấy categoryId và brandId thực tế từ DB (giả sử id trong JSON là số thứ tự, cần map sang id thực tế)
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    const category = categories[product.category_id - 1];
    const brand = brands[product.brand_id - 1];

    // Tạo product
    const createdProduct = await prisma.product.upsert({
      where: { code: product.sku },
      update: {},
      create: {
        name: product.name,
        code: product.sku,
        shortDescription: product.short_description || null,
        longDescription: product.long_description || null,
        price: product.sale_price || product.price,
        quantity: product.stock_quantity || 0,
        categoryId: category?.id,
        brandId: brand?.id,
      },
    });

    // Tạo media và productMedia
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        const media = await prisma.media.upsert({
          where: { url: img },
          update: {},
          create: {
            url: img,
            description: product.name,
          },
        });
        try {
          await prisma.productMedia.create({
            data: {
              productId: createdProduct.id,
              mediaId: media.id,
            },
          });
        } catch (e) {
          // Nếu đã tồn tại thì bỏ qua
        }
      }
    }

    // Tạo attributes
    if (product.attributes) {
      for (const [key, value] of Object.entries(product.attributes)) {
        await prisma.attributes.create({
          data: {
            attributeKey: key,
            attributeValue: value as string,
            productId: createdProduct.id,
          },
        });
      }
    }
  }
  console.log('Seeded products, media, productMedia, attributes');
}

async function rollbackSeed(): Promise<void> {
  // Xoá theo thứ tự phụ thuộc khoá ngoại
  await prisma.attributes.deleteMany({});
  await prisma.productMedia.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('Rollback: Đã xoá toàn bộ dữ liệu đã seed');
}

async function backUpdata(): Promise<void> {
  await rollbackSeed();

  await seedCategories();
  await seedBrands();
  await seedProducts();
}

async function main(): Promise<void> {
  await backUpdata();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
