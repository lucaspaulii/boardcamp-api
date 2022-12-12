import dayjs from "dayjs";
import { connection } from "../database/db.js";
import { rentalSchema } from "../modules/rentalSchema.js";

export async function validateRental(req, res, next) {
  const rentalBody = req.body;

  const { error } = rentalSchema.validate(rentalBody, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }
  const { customerId, gameId, daysRented } = req.body;
  let originalPrice = 0;
  try {
    const gameFound = await connection.query(
      `SELECT "pricePerDay" FROM games WHERE id=$1`,
      [gameId]
    );
    if (gameFound.rows.length === 0) return res.sendStatus(400);
    originalPrice = gameFound.rows[0].pricePerDay * daysRented;
    const customerFound = await connection.query(
      `SELECT * FROM customers WHERE id=$1`,
      [customerId]
    );
    if (customerFound.rows.length === 0) return res.sendStatus(400);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }

  const rentDate = dayjs().format("YYYY-MM-DD");
  const returnDate = null;
  const delayFee = null;

  req.rentalObj = {
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee,
  };
  next();
  return;
}
