import { Router } from "express";
import { authMiddleware, isAdminMiddleware } from "../middlewares/authMiddleware";
import { checkout, getUserOrders, getAllOrders } from '../controllers/orderController';

const router = Router();

// POST /checkout
router.post('/checkout', authMiddleware, checkout);

// GET /orders - get all orders for the authenticated user
router.get('/orders', authMiddleware, getUserOrders);

// GET /admin/orders (admin only) - get all orders
router.get('/admin/orders', authMiddleware, isAdminMiddleware, getAllOrders);

export default router;