import { customerSchema } from "../modules/customerSchema.js";

export async function validateCustomer(req, res, next) {
  const customer = req.body;
  const { error } = customerSchema.validate(customer, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }
  req.customerObj = customer;
  next();
  return;
}
