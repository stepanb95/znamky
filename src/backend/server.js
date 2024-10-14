const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});
