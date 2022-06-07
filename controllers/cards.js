const Card = require('../models/card');
const { NotFoundError } = require('../error/NotFoundError');
const { BadRequestError } = require('../error/BadRequestError');
const { ForbiddenError } = require('../error/ForbiddenError');

module.exports.getCards = (req, res) => {
  Card.find({})
    // .then((cards) => res.send({ data: cards }))
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при получении карточек' }));
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

// old
// module.exports.deleteCard = (req, res, next) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .then((card) => {
//       if (!card) {
//         throw new NotFoundError('Карточка с указанным _id не найдена.');
//       }
//       if (card.owner._id.toString() !== req.user._id.toString()) {
//         throw new ForbiddenError('Эта карточка не Ваша и удалить ее не можете');
//       }
//       res.send({ data: card });
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Переданы некорректные данные'));
//       }
//       next(err);
//     });
// };

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .catch(() => new NotFoundError('Карточка с указанным _id нет.'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Эта не Ваша карточка');
      }
      Card.findByIdAndDelete(req.params.cardId)
        .then((cardData) => {
          // res.send({ data: cardData });
          res.send({ cardData });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('не удалось поставить лайк.'));
      }
      next(err);
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
      // res.send({ data: card });
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Карточка с указанным _id не найдена.'));
      }
      next(err);
    });
};
