import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '../generated/prisma';
import { z } from 'zod';

const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
});

export async function getProducts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const min = req.query.min ? parseFloat(req.query.min as string) : undefined;
    const max = req.query.max ? parseFloat(req.query.max as string) : undefined;
    const search = req.query.search as string;

    const where: Prisma.ProductWhereInput = {};
    if (min !== undefined || max !== undefined) {
      where.price = {};
      if (min !== undefined) where.price.gte = min;
      if (max !== undefined) where.price.lte = max;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: limit }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function getProductById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid product ID' });
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

export async function createProduct(req: Request, res: Response) {
  const result = productSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { name, price, description, stock } = result.data;
  try {
    const product = await prisma.product.create({ data: { name, price, description, stock } });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid product ID' });
  const result = productSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  try {
    const product = await prisma.product.update({
      where: { id },
      data: result.data,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid product ID' });
  try {
    const product = await prisma.product.delete({ where: { id } });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
}