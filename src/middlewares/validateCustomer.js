import { connection } from "../database/db.js";
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

  try {
    const cpfExists = await connection.query(`SELECT * FROM customers WHERE cpf=$1`, [customer.cpf]);
    if (cpfExists.rows.length > 0) {
        return res.sendStatus(409);
    }
  } catch (error) {
    
  }
  req.customerObj = customer;
  next();
  return;
}