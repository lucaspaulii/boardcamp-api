import { Router } from 'express';
import { getCategories, postCategories } from '../controllers/categoryControllers.js';
import { validateCategory } from '../middlewares/validateCategory.js';

const router = Router();

router.get("/categories", getCategories);

router.post("/categories", validateCategory, postCategories);

export default router;