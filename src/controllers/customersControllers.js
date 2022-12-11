import { connection } from "../database/db.js";

export async function getCustomers(req, res) {
  let searchInput = req.query.cpf;
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

export async function postCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.customerObj;
  try {
    await connection.query(
      `INSERT INTO 
      customers ("name", "phone", "cpf", "birthday" ) VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(400);
  }
}
