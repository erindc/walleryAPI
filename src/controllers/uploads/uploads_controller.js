const express = require('express')
const router = express.Router()
const aws = require('../../utils/aws_config');

router.get('/sign-s3', async (req, res) => {
  try {
    console.log('here');
    const s3 = new aws.aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];

    if (fileType !== 'application/pdf') {
      res.status(404).json({error: 'Invalid file type: ', fileType});
      return;
    }

    const s3Params = {
      Bucket: aws.S3_BUCKET_NAME,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };
  
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.error(err);
        return res.end();
      }
      console.log(data);
      const returnData = {
        signedRequest: data,
        url: `https://${aws.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
})

module.exports = router;