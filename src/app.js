require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})


const port = process.env.PORT || 3000;
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// test db
app.get('/api', (req, res) => {
  (async () => {
    const client = await pool.connect()
    try {
      const data = await client.query('SELECT * from images')
      console.log(data)
      res.status(200).json({ data:data.rows });
    } finally {
      client.release()
    }
  })().catch(e => {
    console.log(e.stack)
    res.status(500).json({ error: e });
  });
});

app.get('/', (req, res) => {
    try {
      res.status(200).json({ message: 'ok' });
    } catch (e) {
      res.status(500).json({ error: e });
    }
});
app.listen(port, () => {
  console.log(`server running on port ${port}`)
});