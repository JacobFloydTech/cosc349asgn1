import jwt from 'jsonwebtoken';


const headers = {
  "Access-Control-Allow-Origin": "*",  // change * to http://localhost:5173 for dev
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
  const {token} = JSON.parse(event.body);
  if (!token) return {statusCode:404, headers, body: "Missing token in body"};
  const data = jwt.decode(token, "MY_SECRET");
  if (!data) return {statusCode: 403, body: "Expired"}
  return {statusCode: 202, headers,  body: JSON.stringify({username: data.user.username})}
}