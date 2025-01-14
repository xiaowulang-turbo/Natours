const express = require('express')
const fs = require('fs')
const morgan = require('morgan')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// 1) MIDDLEWARE

app.use(morgan('dev'))

// Middleware: function in the middle of request and response, can modify request and response
app.use(express.json())

app.use((req, res, next) => {
    console.log('Hello from the middleware 😀')
    //console.log(req.headers);
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

// Only the callback function is running in event loop

// 3) ROUTES

// Mounting a new router on a route
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app
