require('dotenv').config()
import express from 'express';
import bodyParser from 'body-parser';
import pool from './db/db';

const port = process.env.PORT || 3000;
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get all todos
app.get('/api', (req, res) => {
  (async () => {
    const client = await pool.connect()
    try {
      const res = await client.query('SELECT * FROM images')
      res.status(200).send({
        body: res,
      })
    } finally {
      client.release()
    }
  })().catch(e => {
    console.log(e.stack)
    res.status(500).send({
      error: e,
    })
  })
});

app.listen(port, () => {
  console.log(`server running on port ${port}`)
});