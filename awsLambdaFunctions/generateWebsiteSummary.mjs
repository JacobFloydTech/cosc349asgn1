import jwt from 'jsonwebtoken'
import mysql from "mysql2/promise"

export const handler = async (event) => { 
  if (event.requestContext.http.method === "OPTIONS") {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "CORS preflight OK" }),
    };
  }
  if (!event.body) return {statusCode: 404,body: JSON.stringify({message: "No body params"})};
  const generateAISummary = async (text) => {
    const data = { 
            "contents": [
                {
                    "parts": [
                        {"text": `You are given the document.body.textContent of a website. You are to generate just a paragraph summarizing what the website/product/company is about. Do not give any sort of intro or conclusion about the prompt, only the paragraph \n ${text}`}
                    ]
                }
            ]
        } 
        const request = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
            {method: "POST", body: JSON.stringify(data), headers: { 'Content-Type':'application/json', 'X-goog-api-key': "AIzaSyASc9NdXUEnVFSjpR_l0IpNmX3aVs8pBBg"}}
        )
        const response = await request.json();

        return response.candidates[0].content.parts[0].text;
    }

  const connection = await mysql.createConnection({
      host: "database-4.cxlcd5rpwuoe.us-east-1.rds.amazonaws.com",
      database: "cosc349",
      user: "admin",
      password: "password",
      port: 3306 
  })
  const {link, token} = JSON.parse(event.body);
  const userdata = jwt.decode(token, "MY_SECRET");
  if(userdata == null) return {statusCode: 403,  body: "No auth"}
  const request = await fetch(link);
  const html = await request.text();
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : link
  const faviconMatch = html.match(/<link[^>]*(rel=["'](?:shortcut )?icon["'])[^>]*href=["']([^"']+)["']/i);
  const faviconLink = faviconMatch ? faviconMatch[2] : '/favicon.ico';
  const bodyText = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
                       .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
                       .replace(/<[^>]+>/g, ' ')
                       .replace(/\s+/g, ' ')
                       .trim();
  const summary = await generateAISummary(bodyText);
  console.log(summary);
  await connection.query(
      'INSERT INTO Website (link, name, summary, uploader, favicon) VALUES (?,?,?,?,?)',
      [link, title, summary, userdata.user.username, faviconLink]
  )
  return {statusCode: 202, body: JSON.stringify({message: "Success"})}
}
