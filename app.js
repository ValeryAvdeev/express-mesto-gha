const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/error');

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

app.use(errorHandler);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'страница не найдена' });
});
// module.exports.createCard = (req, res) => {
//   console.log(req.user._id); // _id станет доступен
// };

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
