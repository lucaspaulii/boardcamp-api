import { connection } from "../database/db.js";

export async function validateCategory(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.sendStatus(400);
  }
  try {
    const nameExists = await connection.query(
      `SELECT * FROM categories WHERE name = $1`,
      [name]
    );
    console.log(nameExists.rows)
    if (nameExists.rows.length > 0) {
      return res.sendStatus(409);
    }
    req.categoryName = name;
    next();
    return;
  } catch (error) {
    return res.sendStatus(400);
  }
}
