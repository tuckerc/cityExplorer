'use strict';

// dependencies
const pg = require('pg');

let conURL = `${process.env.DATABASE_URL}`;
const client = new pg.Client(conURL);
client.on('err', err => {throw err;});

function putLocation(location) {
  
  console.log(location);
  
  // insert query to db
  const sql = 'insert into locations (search_query, formatted_address, latitude, longitude) values ($1, $2, $3, $4) returning *';
  const safeVals = [location.search_query, location.formatted_query, location.latitude, location.longitude];
  return client.query(sql, safeVals);
}

function getCity(city) {
  // select query on location
  const sql = 'select * from locations where search_query = ($1)';
  const safeVals = [city];
  return client.query(sql, safeVals);
}

exports.client = client;
exports.putLocation = putLocation;
exports.getCity = getCity;
