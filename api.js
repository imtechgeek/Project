const express = require('express')
const server = express()
const port = 4000
const db = require('./connection')
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

server.use(cors(corsOptions))
server.get('/', async (req, res) => {
    res.send('Hello! Welcome to the Project Seminar')
})
server.get('/results', async (req, res) => {
    const title = req.query.title;
    const sqlQuery = "SELECT DISTINCT publication.doi,\ title,publisher,publication_types,language,url,first_author,second_author\
     FROM publication JOIN authors ON publication.doi = authors.doi JOIN types ON publication.doi = types.doi \
     WHERE UPPER(title) LIKE UPPER(?) OR UPPER(first_author) LIKE UPPER(?) "
    db.query(sqlQuery,[`%${title}%`,`%${title}%`], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})
server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

