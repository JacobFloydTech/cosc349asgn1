import express from "express"
import cors from "cors";
import mysql from "mysql2/promise"
import dotenv from 'dotenv';
import puppeteer from "puppeteer";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
const port = 3000
const JWT_SECRET = process.env.JWT_SECRET;



const connection = await mysql.createConnection({
    host: "database-4.cxlcd5rpwuoe.us-east-1.rds.amazonaws.com",
    database: "cosc349",
    user: "admin",
    password: "password",
    port: 3306 
})

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})





app.post('/generateWebsiteSummary', async (req, res) => { 
    const {link, token} = req.body;
    const userdata = jwt.decode(token, JWT_SECRET);
    const username = userdata.user.username;
    if (!link || !username) return res.status(403).send();
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
        [link, title, summary, username, faviconLink]
    )
    return res.status(202).send()
})



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
        {method: "POST", body: JSON.stringify(data), headers: { 'Content-Type':'application/json', 'X-goog-api-key': process.env['GEMINI_KEY']}}
    )
    const response = await request.json();

    return response.candidates[0].content.parts[0].text;
}



app.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}`))