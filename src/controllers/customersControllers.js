import { connection } from "../database/db.js";

export async function getCustomers(req, res) {
  const searchInput = req.query.cpf;
  if (searchInput) {
    try {
      const customersFound = await connection.query(
        `SELECT id, name, phone, cpf, TO_CHAR(birthday, 'yyyy-mm-dd') AS "birthday" FROM customers 
            WHERE LOWER(customers.cpf) LIKE ($1);`,
        [`${searchInput}%`]
      );
      return res.send(customersFound.rows);
    } catch (error) {
      return res.sendStatus(400);
    }
  }
  try {
    const customers = await connection.query(
      `SELECT id, name, phone, cpf, TO_CHAR(birthday, 'yyyy-mm-dd') AS "birthday" FROM customers;`
    );
    return res.send(customers.rows);
  } catch (error) {
    return res.sendStatus(400);
  }
}

export async function getCustomersByID(req, res) {
  let customerID = req.params.customerID;
  if (customerID) {
    try {
      const customerIDFound = await connection.query(
        `SELECT id, name, phone, cpf, TO_CHAR(birthday, 'yyyy-mm-dd') AS "birthday" FROM customers 
            WHERE customers.id = $1;`,
        [customerID]
      );
      if (customerIDFound.rows.length === 0) {
        return res.sendStatus(404);
      }
      return res.send(customerIDFound.rows[0]);
    } catch (error) {
      return res.sendStatus(400);
    }
  }
}

export async function postCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.customerObj;
  try {
    const cpfExists = await connection.query(
      `SELECT * FROM customers WHERE cpf=$1;`,
      [cpf]
    );
    if (cpfExists.rows.length > 0) {
      return res.sendStatus(409);
    }
  } catch (error) {
    return res.sendStatus(400);
  }
  try {
    await connection.query(
      `INSERT INTO 
      customers ("name", "phone", "cpf", "birthday" ) VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(400);
  }
}

export async function putCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.customerObj;
  const customerID = req.params.customerID;
  try {
    await connection.query(
      `UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5`,
      [name, phone, cpf, birthday, customerID]
    );
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(400);
  }
}
