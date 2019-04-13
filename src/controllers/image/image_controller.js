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

var s3  = new AWS.S3({
  accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

router.get('/images', async function(req, res) {
  (async () => {
    try {
      // var params = {
      //   Key: 'public/',
      //   Bucket: process.env.BUCKETEER_BUCKET_NAME
      // };

      // let awsErr = null;
      // let images;

      // s3.getObject(params, function put(err, data) {
      //   if (err) {
      //     console.error(err, err.stack);
      //     awsErr = err;
      //   }
      //   images = data;
      //   console.log(data);
      //   console.log(data.Body.toString());
      // });

      // console.log('images', images);

      // if (awsErr) {
      //   res.status(500).json({error: 'Internal error occured'});
      //   return;
      // }

      // const client = await pool.connect()
      // const data = await client.query('SELECT * from images')
      res.status(200).json({ images: images });
  } 
  finally {
    // client.release()
  }
})().catch(e => console.log(e.stack))
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

    await new Promise((resolve, reject) => {
      s3.upload(params, function put(err, data) {
        if (err) {
          console.error(err, err.stack);
          reject(err);
        }
        resolve(data);
      });
    })

    pool.connect(async (err, client, done) => {
      if (err) {
        console.error('Error connecting to pool: ', err);
        throw err
      }

      const query = {
        text: 'INSERT INTO images(user_id, image_tag, purchased, likes, flags) VALUES($1, $2, $3, $4, $5)',
        values: [uuidv4(), `public/${uuid}${file.originalname}`, false, 0, 0],
      }

      await client.query(query);
      done();
    })
    res.sendStatus(201);
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




