import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';




const headers = {
  "Access-Control-Allow-Origin": "*",  
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
  const {token, link} = JSON.parse(event.body)
  if (!token || !link) return {statusCode:404, headers, body: "Missing token/link in body"};
  const data = jwt.decode(token, "MY_SECRET");
  if (!data) return {statusCode: 403, headers, body: "Expired"}
  const username = data.user.username;
  const connection = await mysql.createConnection({
      host: "database-4.cxlcd5rpwuoe.us-east-1.rds.amazonaws.com",
      user: "admin",
      password: "password",
      database: "cosc349",
      port: 3306
  });
  try { 
    await connection.query(
      'DELETE From Website where link = ? and uploader = ?',
      [link, username]
    )
    return {statusCode: 202, headers, body: "Success"}
  } catch (error) { 
    return {statusCode: 500, headers, body: error.message}
  }
    

}