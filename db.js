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

function inDB(city) {
  // select query on location
  const sql = 'select city, count(city) from locations where city = ($1) group by city';
  const safeVals = [city];
  client.query(sql, safeVals)
    .then(results => {
      if(Number(results.rows[0].count) > 0) {
        console.log('count greater than 0');
        return true;
      }
      else return false;
    })
    .catch(err => {return err;})
}

exports.client = client;
exports.putLocation = putLocation;
exports.inDB = inDB;
