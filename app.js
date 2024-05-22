const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth')
const testRoutes = require('./routes/test')
const questionRoutes = require('./routes/question')
const answerOptionRoutes = require('./routes/answerOption')
const possibleResultRoutes = require('./routes/possibleResult')
const userTestResultRoutes = require('./routes/userTestResult')
const commentRoutes = require('./routes/comment')

const app = express()



mongoose.connect('mongodb+srv://boichukmykhailo:mI5Tf48IfFM3XpzJ@cluster0.lpwehne.mongodb.net/diplomaDB?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB connected.'))
    .catch(error => console.log(error));

app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use(morgan('dev'))
app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.use('/api/auth', authRoutes)
app.use('/api/test', testRoutes)
app.use('/api/possibleResult', possibleResultRoutes)
app.use('/api/question', questionRoutes)
app.use('/api/answerOption', answerOptionRoutes)
app.use('/api/userTestResult', userTestResultRoutes)
app.use('/api/comment', commentRoutes)


module.exports = app