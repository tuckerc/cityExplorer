DROP TABLE IF EXISTS movieResponses;

CREATE TABLE movieResponses (
  search_query TEXT PRIMARY KEY,
  formatted_address VARCHAR(255),
  latitude VARCHAR(255),
  longitude VARCHAR(255)
);

-- this.title = movie.title;
--   this.overview = movie.overview;
--   this.average_votes = movie.vote_average;
--   this.total_votes = movie.vote_count;
--   this.image_url = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
--   this.popularity = movie.popularity;
--   this.released_on = movie.release_date;