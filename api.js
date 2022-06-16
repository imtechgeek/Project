const express = require('express')
const server = express()
const port = 4000
const db = require('./connection')

server.get('/', async (req, res) => {
    res.send('Hello! Welcome to the Project Seminar')
})
server.get('/results', async (req, res) => {
    db.query("SELECT * FROM publication", function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})
server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

