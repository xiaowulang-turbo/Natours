const express = require('express')
const morgan = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

// 1) MIDDLEWARE

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Middleware: function in the middle of request and response, can modify request and response
app.use(express.json())

app.use(express.static(`${__dirname}/public`))

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
