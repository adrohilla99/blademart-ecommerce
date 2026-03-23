import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { ProductQuery } from '../validators/product.validator';

export interface PaginatedProducts {
  products: ProductListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  imageUrl: string;
  stock: number;
  featured: boolean;
  rating: number | null;
  createdAt: Date;
}

export async function getProducts(query: ProductQuery): Promise<PaginatedProducts> {
  const { search, category, sort, page, limit, featured } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(category && { category: { equals: category, mode: 'insensitive' } }),
    ...(featured && { featured: true }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
    switch (sort) {
      case 'price_asc':
        return { price: 'asc' };
      case 'price_desc':
        return { price: 'desc' };
      case 'rating':
        return { rating: 'desc' };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  })();

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        category: true,
        brand: true,
        imageUrl: true,
        stock: true,
        featured: true,
        rating: true,
        createdAt: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => ({ ...p, price: p.price.toString() })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      category: true,
      brand: true,
      imageUrl: true,
      stock: true,
      featured: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return { ...product, price: product.price.toString() };
}

export async function getCategories(): Promise<string[]> {
  const result = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  });

  return result.map((r) => r.category);
}
