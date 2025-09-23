import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const handler = async (event) => {
  let connection;
  if (!event.body) return {statusCode: 404, body: "Missing body params"};
  try {
    const {username, password} = JSON.parse(event.body);
    if (!username || !password) return { statusCode: 400, body: 'Missing username or password' };
    connection = await mysql.createConnection({
      host: "database-2.cxlcd5rpwuoe.us-east-1.rds.amazonaws.com",
      user: "admin",
      password: process.env.SQL_PASSWORD,
      database: "COSC349",
      port: 3306
    });

    const [results] = await connection.query("SELECT * FROM User where username = ?",[username]);
    if (results.length == 0) return {statusCode: 404, body: "No user found"}
    const hashCompare = bcrypt.compareSync(password, results[0].password);
    if (!hashCompare) return {statusCode: 403, body: "Unauthorized"}  
    const token = jwt.sign({user: results[0]}, "MY_SECRET", { expiresIn: '7d'});
    return {status: 202, token: token};
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    if (connection) await connection.end();
  }
};


