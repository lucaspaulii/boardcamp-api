import { connection } from "../database/db.js";

export async function getGames(req, res) {
  let searchInput = req.query.name;
  if (searchInput) {
    try {
      const gamesFound = await connection.query(
        `SELECT games.*, categories.name AS "categoryName" 
        FROM games JOIN categories ON games."categoryId" = categories.id 
        WHERE LOWER(games.name) LIKE LOWER($1)`, [(`%${searchInput}%`)]
      );
      return res.send(gamesFound.rows);
    } catch (error) {
      return res.sendStatus(400);
    }
  }
  try {
    const games = await connection.query(
      `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;`
    );
    return res.send(games.rows);
  } catch (error) {
    return res.sendStatus(400);
  }
}

export async function postGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.gameObj;
  try {
    await connection.query(
      `INSERT INTO 
      games ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(400);
  }
}
