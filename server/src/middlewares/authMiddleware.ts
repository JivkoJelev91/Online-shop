import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';

const JWT_SECRET = process.env.JWT_SECRET!;
const prisma = new PrismaClient();

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      (req as any).userId = decoded.userId;
      next();
    });
  } catch (err) {
    next(err);
  }
}

export async function isAdminMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden: Admins only' });
    next();
  } catch (err) {
    next(err);
  }
}
