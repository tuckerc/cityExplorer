DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
  city VARCHAR(255) PRIMARY KEY,
  formatted_address VARCHAR(255),
  lat VARCHAR(255),
  lon VARCHAR(255)
);