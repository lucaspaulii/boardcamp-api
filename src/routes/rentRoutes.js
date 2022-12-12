import { Router } from "express";
import { getRentals, postRental } from "../controllers/rentalsControllers.js";
import { validateRental } from "../middlewares/validateRental.js";

const router = Router();

router.get("/rentals", getRentals);

router.post("/rentals", validateRental, postRental);

router.put("/rentals/:id/return");

router.delete("/rentals/:id");

export default router;
