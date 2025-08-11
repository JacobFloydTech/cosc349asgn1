import express from "express"
import cors from "cors";
import mysql from "mysql2/promise"
import dotenv from 'dotenv';
import puppeteer from "puppeteer";
import jwt from 'jsonwebtoken'

dotenv.config({path: "../.env"})
const app = express()
app.use(cors())
app.use(express.json())
const port = 3000
const JWT_SECRET = process.env['JWT_SECRET'];



const connection = await mysql.createConnection({
    host: "localhost",
    database: "COSC349",
    user: process.env['SQL_USERNAME'],
    password: process.env['SQL_PASSWORD'],
    port: 3305 
})


app.get("/", (req,res) => {
    return res.send("Hello world")
})

app.post('/signIn', async (req, res) => { 
    const {username, password} = req.body;
    if (!username || !password) return res.status(500).send()
    const [results] = await connection.query('SELECT * FROM User where username = ? and password = ?', [username, password])

    if (results.length == 0) return res.status(404).send()
    const user = results[0]

    if (user.password == password && user.username == username) { 
        const token = jwt.sign({user}, JWT_SECRET, {expiresIn: '7d'})
        return res.status(202).json({token})
    } else { 
        return res.status(401).send()
    }
})

app.post('/decodeJWT', async (req, res) => { 
    const {token} = req.body;
    const data = jwt.decode(token, JWT_SECRET);
    return res.status(200).json({username: data.user.username})
})

app.get('/getUserWebsites', async (req, res) => { 
    const username = req.get("username");
    if (!username) return res.status(401).send()
    const [results] = await connection.query(
        'SELECT * from Website where uploader = ?',
        [username]
    )
    return res.status(200).json({results})
})

app.get('/query', async (req, res) => { 
    const query = req.get("query");
    if (!query) return res.json({results: []});
    const [results] = await connection.query(
        "SELECT * from Website where link LIKE CONCAT('%', ?, '%')  or summary LIKE CONCAT('%', ?, '%')  or name LIKE CONCAT('%', ?, '%')  or uploader LIKE CONCAT('%', ?, '%') ",
        [query, query, query, query, query]
    )
    return res.json({results})
})


app.post('/generateWebsiteSummary', async (req, res) => { 
    const {link, token} = req.body;
    const {username} = jwt.decode(token, JWT_SECRET);
    if (!link || !username) return res.status(403).send();
    try { 
        const browser = await puppeteer.launch({headless: 'new'})
        const page = await browser.newPage();
        await page.goto(link);
        const data = await page.evaluate(() => { 
            return document.body.innerText;
        })
        const summary = await generateAISummary(data);
        const faviconLink = await page.evaluate(() => { 
            const iconLink = document.querySelector("link[rel~='icon']");
            return iconLink ? iconLink.href : '/favicon.ico'; 
        })
        await connection.query(
            'INSERT INTO Website (link, name, summary, uploader, favicon) VALUES (?,?,?,?,?)',
            [link, page.title, summary, username, faviconLink]
        )
        return res.status(202).send()
    } catch (e) { 
        return res.status(500).send()
    }
})

const generateAISummary = async (text) => {
    const data = { 
        "contents": [
            {
                "parts": [
                    {"text": `I need you to generate a summary of this website. Just give me the actual review to immediately put in my database and nothing else like greetings or conclusion. Here is the body.innerText: \n ${text}`}
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



app.listen(port, () => console.log(`Listening on port ${port}`))