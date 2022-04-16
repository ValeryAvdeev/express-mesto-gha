const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '625840f4b877e8ce06cc1356',
  };

  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

// module.exports.createCard = (req, res) => {
//   console.log(req.user._id); // _id станет доступен
// };

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
