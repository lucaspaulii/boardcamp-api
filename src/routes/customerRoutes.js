import { Router } from "express";
import {
  getCustomers,
  getCustomersByID,
  postCustomer,
  putCustomer,
} from "../controllers/customersControllers.js";
import { validateCustomer } from "../middlewares/validateCustomer.js";

const router = Router();

router.get("/customers", getCustomers);

router.get("/customers/:customerID", getCustomersByID);

router.post("/customers", validateCustomer, postCustomer);

router.put("/customers/:id", validateCustomer, putCustomer);

export default router;
