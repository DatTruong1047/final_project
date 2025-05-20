import { Product, ProductDocument } from '@app/types/type';
import fs from 'fs/promises';
import path from 'path';
import { Document } from '@langchain/core/documents';
import { v4 as uuidv4 } from 'uuid';

export const createProductDocument = async (
  product: Product,
  brand_name: string,
  category_name: string
): Promise<Document[]> => {
  const baseInfo = [`Danh mục: ${category_name}`, `Tên sản phẩm: ${product.name}`, `Thương hiệu: ${brand_name} `,`${product.summary} ${product.short_description}`]
    .filter(Boolean)
    .join(' ');

  const metadata = {
    product_id: product.id,
    product_name: product.name,
    product_slug: product.slug,
    product_sku: product.sku,
    product_price: product.price,
    product_image: product.images,
    product_short_description: product.short_description,
    product_attributes: product.attributes,
    category_name: category_name,
    brand_name: brand_name,
    product_summary: product.summary,
  };

  const documents: Document[] = [];
  const groupId = uuidv4();

  documents.push(
    new Document({
      pageContent: baseInfo,
      metadata: { ...metadata, type: 'base_info', group_id: groupId },
      id: uuidv4(),
    })
  );

  return documents;
};

export const createProductEmbedding = async (): Promise<Document[]> => {
  try {
    const productPath = path.join(__dirname, '../../data/summarized_products.json');
    const categoriesPath = path.join(__dirname, '../../data/categories.json');
    const brandsPath = path.join(__dirname, '../../data/brands.json');

    const products = JSON.parse(await fs.readFile(productPath, 'utf-8'));
    const categories = JSON.parse(await fs.readFile(categoriesPath, 'utf-8'));
    const brands = JSON.parse(await fs.readFile(brandsPath, 'utf-8'));

    const productDocuments: Document[] = [];

    for (const p of products) {
      const category = categories.find((c: any) => c.id === p.category_id);
      const brand = brands.find((b: any) => b.id == p.brand_id);

      const product: Product = {
        ...p,
        summary: p.summary || p.long_description,
      };

      const productDocument = await createProductDocument(product, brand.name, category.name);
      productDocuments.push(...productDocument);
    }

    await fs.writeFile(
      path.join(__dirname, '../../data/product_documents.json'),
      JSON.stringify(productDocuments, null, 2)
    );

    return productDocuments;
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};
