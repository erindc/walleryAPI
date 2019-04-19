require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const healthCheck = require ('./controllers/health');
const imageController = require('./controllers/image_controller');

const port = process.env.PORT || 3000;
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

app.use(express.static('public'))
app.use(healthCheck);
app.use(imageController);


app.listen(port, () => {
  console.log(`server running on port ${port}`)
});

//to prevent heroku instance from sleeping
setInterval(function() {
  https.get('https://wallery-api.herokuapp.com');
}, 300000);

module.exports = app;