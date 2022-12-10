import { connection } from "../database/db.js";

export async function getCategories(req, res) {
  try {
    const categories = await connection.query(`SELECT * FROM categories;`);
    res.send(categories.rows);
  } catch (error) {
    res.sendStatus(400);
  }
}

export async function postCategories(req, res) {
  const categoryName = req.categoryName;
  console.log(categoryName);
  try {
    await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [
      categoryName,
    ]);
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(400);
  }
}
