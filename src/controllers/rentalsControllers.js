import { connection } from "../database/db.js";

export async function getRentals(req, res) {
  // const customerID = req.query.customerId;
  // const gameID = req.query.gameId;
  try {
    const rentals = await connection.query(`
    SELECT rentals.id AS "id", rentals."customerId", rentals."gameId", rentals."rentDate",
    rentals."daysRented", rentals."returnDate", rentals."originalPrice", rentals."delayFee",
    customers.name AS "customerName", games.name AS "gameName", categories.name AS "gameCategory"
    FROM customers JOIN rentals ON customers.id = rentals."customerId"
    JOIN games ON rentals."gameId" = games.id
    JOIN categories ON games."categoryId" = categories.id`);
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
