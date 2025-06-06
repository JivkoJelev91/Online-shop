import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getCartItems, addToCart, updateCartItem, deleteCartItem } from '../controllers/cartController';

const router = Router();

// GET /cart - get all cart items for the authenticated user
router.get('/', authMiddleware, getCartItems);

// POST /cart - add a product to the cart
router.post('/', authMiddleware, addToCart);

// PUT /cart/:id - update a cart item - change quantity
router.put('/:id', authMiddleware, updateCartItem);

// DELETE /cart/:id
router.delete('/:id', authMiddleware, deleteCartItem);

export default router;
