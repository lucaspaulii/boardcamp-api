import { Router } from 'express';

const router = Router();

router.get("/customers");

router.get("/customers/:customerID");

router.post("/customers");

router.put("/customers/:id");

export default router;