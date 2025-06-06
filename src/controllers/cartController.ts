import { PrismaClient } from '../generated/prisma';
import { Request, Response } from 'express';
import { z } from 'zod';

const prisma = new PrismaClient();

const addToCartSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1).optional(),
});

const updateCartQuantitySchema = z.object({
  quantity: z.number().min(1),
});

// Cart Controllers
export async function getCartItems(req: Request, res: Response) {
  const userId = (req as any).userId;
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
}

export async function addToCart(req: Request, res: Response) {
  const result = addToCartSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const userId = (req as any).userId;
  const { productId, quantity = 1 } = result.data;
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (product.stock !== undefined && product.stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock' });
    }
    const cartItem = await prisma.cartItem.create({
      data: { userId, productId, quantity },
    });
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
}

export async function updateCartItem(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid cart item ID' });
  }
  const result = updateCartQuantitySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const userId = (req as any).userId;
  const { quantity } = result.data;
  try {
    const cartItem = await prisma.cartItem.findUnique({ where: { id } });
    if (!cartItem || cartItem.userId !== userId) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
}

export async function deleteCartItem(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid cart item ID' });
  }
  const userId = (req as any).userId;
  try {
    const cartItem = await prisma.cartItem.findUnique({ where: { id } });
    if (!cartItem || cartItem.userId !== userId) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    await prisma.cartItem.delete({ where: { id } });
    res.json({ message: 'Cart item deleted successfully', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
}
