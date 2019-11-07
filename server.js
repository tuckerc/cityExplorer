'use strict'

require('dotenv').config();

// app dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const handlers = require('./handlers.js');

// initializers
const app = express();
app.use(cors());
let PORT = process.env.PORT;
if (PORT === null || PORT === '') {
  PORT = 46352;
}

let conURL = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
const client = new pg.Client(conURL);
client.on('err', err => {throw err;});

// route declarations
app.get('/location', handlers.locationHandler);
app.get('/weather', handlers.weatherHandler);
app.get('/trails', handlers.trailHandler);
app.use('*', handlers.notFoundHandler);
app.use(handlers.errorHandler);

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on http://localhost:${PORT}`);
    })
  })
  .catch(err => {throw err;})
