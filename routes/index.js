const mainRoute = require('express').Router();
const usersRoute = require('./users');
const articlesRoute = require('./articles');

mainRoute.use(usersRoute);
mainRoute.use(articlesRoute);

module.exports = mainRoute;
