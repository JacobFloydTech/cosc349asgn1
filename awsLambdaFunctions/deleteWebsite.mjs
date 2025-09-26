import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';


export const handler = async(event) => { 
  if (!event.body) return {statusCode: 404, body: "No body params"};
  const {token, link} = JSON.parse(event.body)
  if (!token || !link) return {statusCode:404, body: "Missing token/link in body"};
  const data = jwt.decode(token, "MY_SECRET");
  if (!data) return {statusCode: 403, body: "Expired"}
  const username = data.user.username;
  connection = await mysql.createConnection({
      host: "database-2.cxlcd5rpwuoe.us-east-1.rds.amazonaws.com",
      user: "admin",
      password: process.env.databasepassword,
      database: "COSC349",
      port: 3306
  });
  try { 
    await connection.query(
      'DELETE From Website where link = ? and uploader = ?',
      [link, username]
    )
    return {statusCode: 202, body: "Success"}
  } catch (error) { 
    return {statusCode: 500, body: error.message}
  }
    

}