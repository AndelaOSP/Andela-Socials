const express = require('express');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.static(path.join(__dirname, './dist')));

app.get('*', (req, res) => res
  .sendFile('index.html', { root: path.join(__dirname, '/dist') }));


app.listen(PORT, (err) => {
  if (err) {
    console.log('error ==>', err.message); // eslint-disable-line no-console
    return false;
  }
  console.log(`Server running on PORT ${PORT}`); // eslint-disable-line no-console
});
