DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
  search_query VARCHAR(255) PRIMARY KEY,
  formatted_address VARCHAR(255),
  latitude VARCHAR(255),
  longitude VARCHAR(255)
);