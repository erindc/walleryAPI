const express = require('express')
const router = express.Router()
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

router.get('/images', function(req, res) {
  (async () => {
    const client = await pool.connect()
    try {
      //TODO: determine if api will retrieve images from AWS S3
      const data = await client.query('SELECT * from images')
      res.status(200).json({ images: data.rows });
    } finally {
      client.release()
    }
  })().catch(e => {
    console.log(e.stack)
    res.status(500).json({ error: e });
  });
})

//TODO uploads
router.post('/images', function(req, res) {
  res.status(200).json({ images: 'TODO' });
})

//TODO flag and like endpoint  (not working need to fix)
router.post('/images', function(req, res) {
  //req.body.id
  res.status(200);
})

module.exports = router;




