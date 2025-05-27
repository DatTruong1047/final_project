import { Document } from 'langchain/document';

import { ProductMetadataType } from '@app/models';

export function mapProductDocumentToMetadata(document: Document): ProductMetadataType {
  return {
    name: document.metadata.product_name,
    slug: document.metadata.product_slug,
    sku: document.metadata.product_sku,
    image: document.metadata.product_image,
    short_description: document.metadata.product_short_description,
    price:
      typeof document.metadata.product_price === 'string'
        ? parseFloat(document.metadata.product_price) || 0
        : document.metadata.product_price ?? 0,
    category_name: document.metadata.category_name || '',
    brand_name: document.metadata.brand_name || '',
    attributes: document.metadata.product_attributes || {},
    summary: document.metadata.product_summary || '',
  };
}
