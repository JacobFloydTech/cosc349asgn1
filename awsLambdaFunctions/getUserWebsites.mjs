import mysql from 'mysql2/promise';
const headers = {
  "Access-Control-Allow-Origin": "*",  // or "http://localhost:5173"
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler = async(event) => { 
  
  if (event.requestContext.http.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS preflight OK" }),
    };
  }

  if (!event.body) return {statusCode: 404, headers, body: "No body params"};
  const {username} = JSON.parse(event.body)
  if (!username) return {statusCode:404, headers, body: "Missing token/link in body"};
  const connection = await mysql.createConnection({
      host: "database-2.cxlcd5rpwuoe.us-east-1.rds.amazonaws.com",
      user: "admin",
      password: process.env.databasepassword,
      database: "COSC349",
      port: 3306
  });
  try { 
    const [results] = await connection.query(
      'SELECT * from Website where uploader = ?',
      [username]
    )
    return {statusCode: 202, headers,body: JSON.stringify(results)}
  } catch (error) { 
    return {statusCode: 500, headers, body: error.message}
  }
    

}