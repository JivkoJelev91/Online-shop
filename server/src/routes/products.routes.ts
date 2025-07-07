import { Router } from 'express';
import { authMiddleware, isAdminMiddleware } from '../middlewares/authMiddleware';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productsController';

const router = Router();

// GET /products - public, supports pagination and filtering
router.get('/', getProducts);

// GET /products/:id - public
router.get('/:id', getProductById);

// POST /products (admin only)
router.post('/', authMiddleware, isAdminMiddleware, createProduct);

//PUT /products/:id (admin)
router.put('/:id', authMiddleware, isAdminMiddleware, updateProduct);

//DELETE /products/:id (admin)
router.delete('/:id', authMiddleware, isAdminMiddleware, deleteProduct);

export default router;
