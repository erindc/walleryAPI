const aws = require('aws-sdk');

aws.config.region = 'es-east-2';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

module.exports = {
  aws,
  S3_BUCKET_NAME
};