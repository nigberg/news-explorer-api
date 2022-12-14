require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const { createUser, login } = require('./controllers/users');
const { signinValidator, signupValidator } = require('./utils/celebrateValidators');
const auth = require('./middlewares/auth');
const NotFoundError = require('./utils/errors/NotFoundError');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_SERVER_ADDRESS, RATE_LIMITER_CONFIGURATIONS } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const limiter = rateLimit(RATE_LIMITER_CONFIGURATIONS);

const app = express();
mongoose.connect(MONGO_SERVER_ADDRESS);

app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.post('/signup', signupValidator, createUser);
app.post('/signin', signinValidator, login);
app.use(auth);
app.use('/', usersRouter);
app.use('/', articlesRouter);
app.use((req, res, next) => {
  const err = new NotFoundError(`Route ${req.url} is not supported in this app`);
  next(err);
});
app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandler);

app.listen(PORT);
