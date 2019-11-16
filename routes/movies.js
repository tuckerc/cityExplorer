'use strict';

/////////////////////////////////////////////////////////////////////////
/// dependencies
/////////////////////////////////////////////////////////////////////////
const superagent = require('superagent');
const db = require('../db/db.js');
const handlers = require('./handlers.js');

/////////////////////////////////////////////////////////////////////////
/// constructors
/////////////////////////////////////////////////////////////////////////
function Movie(movie) {
  this.title = movie.title;
  this.overview = movie.overview;
  this.average_votes = movie.vote_average;
  this.total_votes = movie.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  this.popularity = movie.popularity;
  this.released_on = movie.release_date;
}

/////////////////////////////////////////////////////////////////////////
/// movie handler
/////////////////////////////////////////////////////////////////////////
function movieHandler(req, res) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${req.query.data.search_query}&api_key=${process.env.THE_MOVIE_DB_KEY}&language=en-US&page=1`;

  superagent.get(url)
    .then(data => {
      let movies = [];
      data.body.results.forEach(movie => {
        movies.push(new Movie(movie));
      });
      res.status(200).json(movies);
    })
    .catch(err => handlers.errorHandler(err, req, res));
}

/////////////////////////////////////////////////////////////////////////
/// export declarations
/////////////////////////////////////////////////////////////////////////
exports.movieHandler = movieHandler;
