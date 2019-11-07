'use strict'

require('dotenv').config();

// app dependencies
const express = require('express');
const cors = require('cors');
const handlers = require('./handlers.js');
const db = require('./db.js');

// initializers
const app = express();
app.use(cors());
let PORT = process.env.PORT;
if (PORT === null || PORT === '') {
  PORT = 46352;
}

// route declarations
app.get('/location', handlers.locationHandler);
app.get('/weather', handlers.weatherHandler);
app.get('/trails', handlers.trailHandler);
app.use('*', handlers.notFoundHandler);
app.use(handlers.errorHandler);

db.client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on http://localhost:${PORT}`);
    })
  })
  .catch(err => {throw err;})
