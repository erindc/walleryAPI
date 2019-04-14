const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const multer = require('multer');
// var AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

var storage = multer.diskStorage({
  destination: './public/images/uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
var upload = multer({storage: storage});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

router.get('/images', async function(req, res) {
    try {
      // var s3  = new AWS.S3({
      //   accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
      //   secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
      //   region: 'us-east-1',
      // });

      const images = await pool.query('SELECT * FROM images ORDER BY likes DESC');

      // const fullImages = await new Promise((resolve, reject) => {
      //   const imageWithLocs = images.rows.reduce((acc, image) => {
      //       const params = {Bucket: process.env.BUCKETEER_BUCKET_NAME, Key: image.image_tag, Expires: 86400};
      //       try {
      //           const url = s3.getSignedUrl('getObject', params);
      //           acc.push({...image, url});
      //           return acc;
      //       } catch (err) {
      //           reject(err);
      //       }
      //   }, []);
      //   resolve(imageWithLocs);
      // });
      res.status(200).json(images.rows);
    } catch (err) {
      console.error('Error getting images: ', err);
      res.status(500).json({error: 'Internal error occured'});
    }
})

router.post('/images', upload.single('walleryImage'), async function(req, res) {
  console.log('here');
  try {
    const file = req.file

    // let uuid = uuidv4();

    // var params = {
    //   ACL: 'public-read-write',
    //   Key: `public/${uuid}${file.originalname}`,
    //   Bucket: process.env.BUCKETEER_BUCKET_NAME,
    //   Body: file.buffer,
    //   ContentType: 'image/png'
    // };

    // var s3  = new AWS.S3({
    //   accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
    //   region: 'us-east-1',
    // });

    // const result = await new Promise((resolve, reject) => {
    //   s3.putObject(params, function put(err, data) {
    //     if (err) {
    //       console.error(err, err.stack);
    //       reject(err);
    //     } else {
    //       s3.getObject({Key:`public/${uuid}${file.originalname}`, Bucket: process.env.BUCKETEER_BUCKET_NAME}, function put(err, img) {
    //         if (err) {
    //           console.log(err, err.stack);
    //           reject(err);
    //         } else {
    //           resolve(img);
    //         }
    //       });
    //     }
    //   });
    // })

    // console.log('result', result.Body);
    // console.log('result', result.Body.toString('base64'));

    await pool.query('INSERT INTO images(user_id, image_tag, purchased, likes, flags, location) VALUES($1, $2, $3, $4, $5, $6)',
    [uuidv4(), uuidv4(), false, 0, 0, `/images/uploads/${file.originalname}`]);

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




