'use strict'

require('dotenv').config();

const express = require('express');

const app = express();

let PORT = process.env.PORT;
if (PORT === null || PORT === '') {
  PORT = 46352;
}

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
