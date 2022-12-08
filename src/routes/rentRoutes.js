import { Router } from 'express';

const router = Router();

router.get("/rentals");

router.post("/rentals");

router.put("/rentals/:id/return");

router.delete("/rentals/:id");

export default router;