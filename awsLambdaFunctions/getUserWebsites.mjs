import mysql from 'mysql2/promise';


export const handler = async(event) => { 
  if (!event.body) return {statusCode: 404, body: "No body params"};
  const {username} = JSON.parse(event.body)
  if (!username) return {statusCode:404, body: "Missing token/link in body"};
  const connection = await mysql.createConnection({
      host: "database-2.cxlcd5rpwuoe.us-east-1.rds.amazonaws.com",
      user: "admin",
      password: process.env.SQL_PASSWORD,
      database: "COSC349",
      port: 3306
  });
  try { 
    const [results] = await connection.query(
      'SELECT * from Website where uploader = ?',
      [username]
    )
    return {statusCode: 202, body: JSON.stringify(results)}
  } catch (error) { 
    return {statusCode: 500, body: error.message}
  }
    

}