const express = require('express')
const router = express.Router()
const { Pool } = require('pg')
const multer = require('multer');
const upload = multer();
var AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

router.get('/images', async function(req, res) {
    try {
      const data = await pool.query('SELECT * FROM images ORDER BY likes DESC')
      console.log(data);
      res.status(200).json(data.rows);
    } catch (err) {
      console.error('Error during upload: ', err);
      res.status(500).json({error: 'Internal error occured'});
    }
})

router.post('/images', upload.single('walleryImage'), async function(req, res) {
  try {
    const file = req.file

    let uuid = uuidv4();

    var params = {
      Key: `public/${uuid}${file.originalname}`,
      Bucket: process.env.BUCKETEER_BUCKET_NAME,
      Body: file.buffer
    };

    var s3  = new AWS.S3({
      accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1',
    });

    const location = await new Promise((resolve, reject) => {
      s3.upload(params, function put(err, data) {
        if (err) {
          console.error(err, err.stack);
          reject(err);
        }
        resolve(data.Location);
      });
    })

    const image = await pool.query('INSERT INTO images(user_id, image_tag, purchased, likes, flags, location) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
    [uuidv4(), `public/${uuid}${file.originalname}`, false, 0, 0, location]);

    res.status(201).json(image.rows);
 } catch (err) {
    console.error('Error during upload: ', err);
    res.status(500).json({error: 'Internal error occured'});
  }
})


//TODO flag and like endpoint  (not working need to fix)
router.patch('/images', function(req, res) {
  //req.body.id
  res.status(200);
})

module.exports = router;




