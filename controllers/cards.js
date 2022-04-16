const Card = require('../models/card');
const { NotFoundError } = require('../error/NotFoundError');
const { BadRequestError } = require('../error/BadRequestError');

//cards
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении карточек' }));
};

//cards
module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
      // console.log(err.name);
    });
};
// cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));};
      // } else if (err.name === 'CastError') {
      //   next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      // }
      next(err);
      // console.log(err.name);
    });
};

// /cards/:cardId/likes
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      // if (!card) {
      //   throw new NotFoundError('Передан несуществующий _id карточки.');
      // }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Карточка с указанным _id не найдена.'));
        // res.status(400).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      next(err);
      // res.status(500).send({ message: 'произошла ошибка' });
    });
};

// /cards/:cardId/likes
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      // if (!card) {
      //   throw new NotFoundError('Передан несуществующий _id карточки.');
      // }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Карточка с указанным _id не найдена.'));
      }
      next(err);
    });
};
