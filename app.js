require('dotenv').config()
const { SECRET_KEY, MONGO_SERVER_ADDRESS } = require('./utils/constants')
const { PORT = 3000 } = process.env
const SECRET_JWT =
  process.env.NODE_ENV !== 'production' ? SECRET_KEY : process.env.SECRET_JWT
const express = require('express')
const usersRouter = require('./routes/users')
const articlesRouter = require('./routes/articles')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const NotFoundError = require('./utils/errors/NotFoundError')
const auth = require('./middlewares/auth')
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const {createUser, login} = require('./controllers/users')

const app = express()
mongoose.connect(MONGO_SERVER_ADDRESS)

app.use(cors())
app.options('*', cors())
app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/', usersRouter)
app.use('/', articlesRouter)
app.use((req, res, next) => {
  const err = new NotFoundError(`Route ${req.url} is not supported in this app`);
  next(err);
});
app.use(centralizedErrorHandler);



app.listen(PORT, () => {
  console.log(`App is now listening to port ${PORT}, JWT key is ${SECRET_JWT}`)
})
