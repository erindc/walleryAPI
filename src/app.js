require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const healthCheck = require ('./controllers/health');
const imageController = require('./controllers/image/image_controller');

const port = process.env.PORT || 3000;
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(healthCheck);
app.use(imageController);


app.listen(port, () => {
  console.log(`server running on port ${port}`)
});