const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
const port = 3000


app.get("/", (req,res) => {
    return res.send("Hello world")
})

app.post("/", (req, res) => { 
    console.log(req.body);
    return res.send(JSON.stringify(req.body))
})

app.listen(port, () => console.log(`Listening on port ${port}`))