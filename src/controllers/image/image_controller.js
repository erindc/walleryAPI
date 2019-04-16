const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

var storage = multer.diskStorage({
  destination: './public/images/uploads',
  filename: (req, file, cb) => {
    cb(null, uuidv4() + file.originalname)
  }
});
var upload = multer({storage: storage});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

router.get('/images', async function(req, res) {
    try {
      const images = await pool.query('SELECT * FROM images ORDER BY likes DESC');
      res.status(200).json(images.rows);
    } catch (err) {
      console.error('Error getting images: ', err);
      res.status(500).json({error: 'Internal error occured'});
    }
})

router.put('/images/:id', async function(req, res) {
  try {
    if (req.body.likes) {
      await pool.query('UPDATE images set likes=likes+1 WHERE image_tag=$1',
      [req.params.id]);
    } else if (req.body.flags) {
      await pool.query('UPDATE images set flags=flags+1 WHERE image_tag=$1',
      [req.params.id]);
    }
    res.sendStatus(204);
  } catch (err) {
    console.error('Error during upload: ', err);
    res.status(500).json({error: 'Internal error occured'});
  }
})

router.post('/images', upload.single('walleryImage'), async function(req, res) {
  try {
    const file = req.file
    const validTypes = ['image/png', 'image/pdf', 'image/jpeg']

    if (!validTypes.includes(file.mimetype)) {
      res.status(400).json({msg: 'Invalid file type'});
      return;
    }

    await pool.query('INSERT INTO images(user_id, image_tag, purchased, likes, flags, location) VALUES($1, $2, $3, $4, $5, $6)',
    [uuidv4(), uuidv4(), false, 0, 0, `/images/uploads/${file.filename}`]);

    res.sendStatus(201);
 } catch (err) {
    console.error('Error during upload: ', err);
    res.status(500).json({error: 'Internal error occured'});
  }
})

module.exports = router;




