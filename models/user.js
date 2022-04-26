const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'введен не верный email.'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

// userSchema.statics.findUserByCredentials = async function (req, res, next) {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       throw new NotFoundError('неверный логин или пароль');
//     }
//     const matched = await bcrypt.compare(password, user.password);
//     if (!matched) {
//       throw new NotFoundError('неверный логин или пароль');
//     }
//     // console.log(matched);
//     // console.log(user);
//     return user;
//   } catch (e) {
//     next(e);
//   }
// };

module.exports = mongoose.model('user', userSchema);
