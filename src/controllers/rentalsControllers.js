import dayjs from "dayjs";
import { connection } from "../database/db.js";

export async function getRentals(req, res) {
  const customerID = req.query.customerId;
  const gameID = req.query.gameId;
  const query = `
  SELECT
      rentals.id,
      rentals."customerId",
      rentals."gameId",
      rentals."rentDate"::text,
      rentals."daysRented",
      rentals."returnDate"::text,
      rentals."originalPrice",
      rentals."delayFee",
      JSON_BUILD_OBJECT(
          'id', customers.id,
          'name', customers.name
          ) AS customer,
      JSON_BUILD_OBJECT(
          'id', games.id,
          'name', games.name,
          'categoryId', games."categoryId",
          'categoryName', categories.name
      ) AS game
      FROM customers JOIN rentals ON customers.id = rentals."customerId"
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON games."categoryId" = categories.id`;
  if (customerID) {
    const customerQuery = query + ` WHERE customers.id = $1`;
    const customerRentals = await connection.query(customerQuery, [customerID]);
    return res.send(customerRentals.rows);
  }
  if (gameID) {
    const gamesQuery = query + ` WHERE games.id = $1`;
    const gamesRentals = await connection.query(gamesQuery, [gameID]);
    return res.send(gamesRentals.rows);
  }
  try {
    const rentals = await connection.query(query);
    res.send(rentals.rows);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export async function postRental(req, res) {
  const {
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee,
  } = req.rentalObj;
  try {
    const gamesRented = await connection.query(
      `SELECT rentals.*, games."stockTotal" FROM rentals JOIN games ON rentals."gameId" = games.id WHERE games.id = $1`, [gameId]
    );
    const stockTotal = gamesRented.rows[0]?.stockTotal;
    console.log(gamesRented.rows.length)
    if (gamesRented.rows.length >= stockTotal) return res.sendStatus(400);
    await connection.query(
      `
    INSERT INTO rentals 
    ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
    VALUES ($1, $2, $3, $4, $5, $6, $7);
    `,
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export async function endRent(req, res) {
  const { id } = req.params;
  const returnDateToFill = dayjs().format("YYYY-MM-DD");
  try {
    const rentalByID = await connection.query(
      `SELECT * FROM rentals WHERE id=$1`,
      [id]
    );
    if (rentalByID.rows.length === 0) return res.sendStatus(404);
    const { rentDate, daysRented, originalPrice, returnDate } =
      rentalByID.rows[0];
    if (returnDate !== null) return res.sendStatus(400);
    const daysReturn = Math.ceil(
      (new Date(returnDateToFill) - rentDate) / (1000 * 3600 * 24)
    );
    const delay = daysReturn - daysRented;
    let delayFee;
    if (delay <= 0) {
      delayFee = 0;
    }
    if (delay > 0) {
      const pricePerDay = originalPrice / daysRented;
      delayFee = pricePerDay * delay;
    }
    await connection.query(
      `UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`,
      [returnDateToFill, delayFee, id]
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export async function deleteRent(req, res) {
  const { id } = req.params;

  try {
    const rentalByID = await connection.query(
      `SELECT * FROM rentals WHERE id=$1`,
      [id]
    );
    if (rentalByID.rows.length === 0) return res.sendStatus(404);
    if (rentalByID.rows[0].returnDate === null) return res.sendStatus(400);

    await connection.query(`DELETE FROM rentals WHERE id=$1`, [id]);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}
