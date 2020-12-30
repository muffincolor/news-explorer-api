require('dotenv').config({ path: './vars.env' });

const {
  NODE_ENV, JWT_SECRET, DATABASE_ADRESS, PORT,
} = process.env;

const devSecret = 'dev-secret';
const devDbLink = 'mongodb://localhost:27017/diploma';
const devServerPort = 3000;

module.exports.SECRET = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : devSecret;
module.exports.DB = NODE_ENV === 'production' && DATABASE_ADRESS ? DATABASE_ADRESS : devDbLink;
module.exports.SERVER_PORT = NODE_ENV === 'production' && PORT ? PORT : devServerPort;

module.exports.incorrectData = 'Переданы некорректные данные';
module.exports.notAuthorized = 'Необходима авторизация';
module.exports.notFoundCard = 'Запрашиваемая карточка не найдена';
module.exports.notFoundUser = 'Запрашиваемая карточка не найдена';
module.exports.notFoundPage = 'Запрашиваемый ресурс не найден';
module.exports.canNotDeleteCard = 'Вы не можете удалить карточку другого пользователя';
module.exports.dataIncorrect = 'Проверьте правильность введенных данных';
module.exports.userAlreadyRegistered = 'Данный пользователь уже зарегистрирован';
module.exports.serverError = 'На сервере произошла ошибка';
module.exports.tooManyRequests = 'Вы отправили очень много запросов с одного IP адреса.';
module.exports.linkIncorrect = 'Ошибка валидации ссылки';
module.exports.emailIncorrect = 'Ошибка валидации Email';
