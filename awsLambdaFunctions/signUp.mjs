import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", // or "http://localhost:5173"
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle preflight
  if (event.requestContext.http.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS preflight OK" }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Missing body params" }),
    };
  }

  let connection;
  try {
    const { username, password } = JSON.parse(event.body);
    if (!username || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Missing username or password" }),
      };
    }

    connection = await mysql.createConnection({
      host: "database-2.cxlcd5rpwuoe.us-east-1.rds.amazonaws.com",
      user: "admin",
      password: "karate2016Pasadena",
      database: "COSC349",
      port: 3306,
    });

    const hashedPassword = bcrypt.hashSync(password, 10);
    await connection.query("INSERT INTO User VALUES (?, ?)", [username, hashedPassword]);

    const token = jwt.sign({ user: { username } }, "MY_SECRET", { expiresIn: "7d" });

    return {
      statusCode: 201,
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
    if (connection) {
      await connection.end();
    }
  }
};
