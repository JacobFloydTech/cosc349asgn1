import mysql from 'mysql2/promise';


export const handler = async(event) => { 
  const headers = {
    "Access-Control-Allow-Origin": "*",  // or "http://localhost:5173"
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
  if (!event.body) return {statusCode: 404, headers, body: JSON.stringify({message: "No body params"})};
  const {query} = JSON.parse(event.body)
  if (!query) return {statusCode:404, headers, body: JSON.stringify({message: "Missing query in body"})};
  const connection = await mysql.createConnection({
      host: "database-2.cxlcd5rpwuoe.us-east-1.rds.amazonaws.com",
      user: "admin",
      password: process.env.databasepassword,
      database: "COSC349",
      port: 3306
  });
  try { 
    const [results] = await connection.query(
        "SELECT * from Website where link LIKE CONCAT('%', ?, '%')  or summary LIKE CONCAT('%', ?, '%')  or name LIKE CONCAT('%', ?, '%')  or uploader LIKE CONCAT('%', ?, '%') ",
        [query, query, query, query, query]
    )
    return {statusCode: 202, headers, body: JSON.stringify({results: results})}
  } catch (error) { 
    return {statusCode: 500, headers, body: JSON.stringify({messsage: error.message})}
  }
    

}