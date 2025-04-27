import { Product } from '@/domain/entities/products';

export const productPresenter = (product: Product) => {
  return {
    id: product.id.toString(),
    name: product.name,
    category: product.category,
    available: product.available,
  };
};
