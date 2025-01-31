const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// 1) GLOBAL MIDDLEWARES

// Secure HTTP HEADERS
// In app.use, we always need to pass in a function rather than a function call
// the result of helmet() is exactly a function
app.use(helmet())

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Middleware: function in the middle of request and response, can modify request and response

// Limit requests from same IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
})

app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))

app.use(express.static(`${__dirname}/public`))

// Test middleware
app.use((req, res, next) => {
    // console.log('Hello from the middleware 😀')
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

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`,
    // })
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
    // err.status = 'fail'
    // err.statusCode = 404
    // next(err)
    next(new AppError(`Can't find ${req.originalUrl} on this server!`))
})

app.use(globalErrorHandler)

module.exports = app
