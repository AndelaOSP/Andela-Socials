const path = require('path');
const express = require('express');
const dotenv = require('dotenv');


dotenv.config();

const PORT = process.env.PORT || 9000;
const app = express();

app.use(express.static(path.join(__dirname, './dist')));

app.get('*', (req, res) => res
  .sendFile('index.html', { root: path.join(__dirname, '/dist') }));


app.listen(PORT, (error) => {
  if (error) {
    console.log(error.message); // eslint-disable-line no-console
  } else {
    console.log(`You are live on PORT ${PORT}`); // eslint-disable-line no-console
  }
});
