import express from "express"
import cors from "cors";
import mysql from "mysql2/promise"
import dotenv from 'dotenv';

dotenv.config({path: "../.env"})
const app = express()
app.use(cors())
app.use(express.json())
const port = 3000



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
        return res.status(202).send()
    } else { 
        return res.status(401).send()
    }
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




app.listen(port, () => console.log(`Listening on port ${port}`))