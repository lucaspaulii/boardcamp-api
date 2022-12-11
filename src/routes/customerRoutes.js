import { Router } from 'express';
import { getCustomers, postCustomer } from '../controllers/customersControllers.js';
import { validateCustomer } from '../middlewares/validateCustomer.js';

const router = Router();

router.get("/customers", getCustomers);

router.get("/customers/:customerID");

router.post("/customers", validateCustomer, postCustomer);

router.put("/customers/:id");

export default router;