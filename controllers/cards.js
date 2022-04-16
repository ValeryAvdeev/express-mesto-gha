const Card = require('../models/card');
const { NotFoundError } = require('../error/NotFoundError');
const { ValidationError } = require('../error/ValidationError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении карточек' }));
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.post({ name, link })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      }
      next('Произошла ошибка');
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
      next('Произошла ошибка');
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'Validation') {
        next(new ValidationError('Карточка с указанным _id не найдена.'));
      }
      next('Произошла ошибка');
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'Validation') {
        next(new ValidationError('Карточка с указанным _id не найдена.'));
      }
      next('Произошла ошибка');
    });
};
