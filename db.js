'use strict';

// dependencies
const pg = require('pg');

let conURL = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
const client = new pg.Client(conURL);
client.on('err', err => {throw err;});

function putLocation(location) {
  // insert query to db
  const sql = 'insert into locations (city, formatted_address, lat, lon) values ($1, $2, $3, $4) returning *';
  const safeVals = [location.search_query, location.formatted_query, location.latitude, location.longitude];
  client.query(sql, safeVals)
    .then(results => {
      return results;
    })
    .catch(err => {return err;})
}

exports.client = client;
exports.putLocation = putLocation;
