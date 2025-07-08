import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CartItem } from '../types';

const prisma = new PrismaClient();

// Order Controllers
export async function checkout(req: Request, res: Response) {
  const userId = (req as any).userId;
  const cartItems: CartItem[] = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  for (const item of cartItems) {
    if (item.product.stock !== undefined && item.product.stock < item.quantity) {
      return res.status(400).json({ error: `Not enough stock for product ${item.product.name}` });
    }
  }
  const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0);
  try {
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cartItems.map((item: CartItem) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: true },
    });
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    await prisma.cartItem.deleteMany({ where: { userId } });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to checkout' });
  }
}

export async function getUserOrders(req: Request, res: Response) {
  const userId = (req as any).userId;
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export async function getAllOrders(req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
