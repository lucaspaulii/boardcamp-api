import { Router } from "express";
import { deleteRent, endRent, getRentals, postRental } from "../controllers/rentalsControllers.js";
import { validateRental } from "../middlewares/validateRental.js";

const router = Router();

router.get("/rentals", getRentals);

router.post("/rentals", validateRental, postRental);

router.post("/rentals/:id/return", endRent);

router.delete("/rentals/:id", deleteRent);

export default router;
