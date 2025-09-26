import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",  
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

 
  if (event.requestContext.http.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS preflight OK" }),
    };
  }

  if (!event.body) {
    return { statusCode: 400, headers, body: "Missing body params" };
  }

  let connection;
  try {
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return { statusCode: 400, headers, body: "Missing username or password" };
    }

    connection = await mysql.createConnection({
      host: "database-2.cxlcd5rpwuoe.us-east-1.rds.amazonaws.com",
      user: "admin",
      password: process.env.databasepassword,
      database: "COSC349",
      port: 3306,
    });

    const [results] = await connection.query(
      "SELECT * FROM User WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      return { statusCode: 404, headers, body: "No user found" };
    }

    const hashCompare = bcrypt.compareSync(password, results[0].password);
    if (!hashCompare) {
      return { statusCode: 403, headers, body: "Unauthorized" };
    }

    const token = jwt.sign({ user: results[0] }, "MY_SECRET", { expiresIn: "7d" });

    return {
      statusCode: 202,  
      headers,
      body: JSON.stringify({ token }), 
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    if (connection) await connection.end();
  }
};
