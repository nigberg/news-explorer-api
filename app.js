require('dotenv').config()
const { SECRET_KEY } = require('./utils/constants')
const { PORT = 3000 } = process.env
const SECRET_JWT =
  process.env.NODE_ENV !== 'production' ? SECRET_KEY : process.env.SECRET_JWT
const express = require('express')
const usersRouter = require('./routes/users')
const articlesRouter = require('./routes/articles')
const helmet = require('helmet')
const cors = require('cors')
const NotFoundError = require('./utils/errors/NotFoundError')
const auth = require('./middlewares/auth')
const {createUser, login} = require('./controllers/users')
const app = express()

app.use(cors())
app.options('*', cors())
app.use(helmet)
app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/', usersRouter)
app.use('/', articlesRouter)
app.use((req, res, next) => {
  const err = new NotFoundError(`Route ${req.url} not found`);
  next(err);
});



app.listen(PORT, () => {
  console.log(`App is now listening to port ${PORT}, JWT key is ${SECRET_JWT}`)
})
