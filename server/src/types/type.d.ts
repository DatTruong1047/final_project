export type Product = {
  id: number;
  sku: string;
  name: string;
  slug?: string;
  short_description: string;
  images: {
    url: string;
  }[];
  category_id?: number;
  brand_id?: number;
  price?: number;
  sale_price?: number;
  attributes?: Record<string, string>;
  summary: string;
};

export type ProductDocument = {
  pageContent: string;
  metadata: Record<string, any>;
};


type CategoryJSONType = {
  id: string;
  name: string;
  description?: string;
};

type BrandJSONType = {
  id: string;
  name: string;
  originCountry?: string;
  description?: string;
};