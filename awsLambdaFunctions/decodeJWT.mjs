import jwt from 'jsonwebtoken';

export const handler = async(event) => { 
  if (!event.body) return {statusCode: 404, body: "No body params"};
  const {token} = JSON.parse(event.body);
  if (!token) return {statusCode:404, body: "Missing token in body"};
  const data = jwt.decode(token, "MY_SECRET");
  if (!data) return {statusCode: 403, body: "Expired"}
  return {statusCode: 202, body: data.user.username}
}