import { connection } from "../database/db.js";
import { gameSchema } from "../modules/gameSchema.js";

export async function validateGame(req, res, next) {
  const game = req.body;
  const { error } = gameSchema.validate(game, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const nameExists = await connection.query(
      `SELECT * FROM games WHERE name=$1`,
      [game.name]
    );
    if (nameExists.rows.length > 0) {
      return res.sendStatus(409);
    }
    const categoryExists = await connection.query(
      `SELECT * FROM categories WHERE id=$1`,
      [game.categoryId]
    );
    if (categoryExists.rows.length === 0) {
      return res.sendStatus(409);
    }
    req.gameObj = game;
    next();
    return;
  } catch (error) {
    return res.sendStatus(400);
  }
}
