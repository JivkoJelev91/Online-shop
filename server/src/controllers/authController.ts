import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Auth Controllers
export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { email, password, name } = result.data;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
      select: { id: true, email: true, name: true, role: true },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { email, password } = result.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function getProfile(req: Request, res: Response) {
  const userId = (req as any).userId;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}
