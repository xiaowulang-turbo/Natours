const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')

const app = express()

app.set('view engine', 'pug')
// This help us to forget about whether the route has slash or not already
app.set('views', path.join(__dirname, 'views'))

// 1) GLOBAL MIDDLEWARES

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Secure HTTP HEADERS
// In app.use, we always need to pass in a function rather than a function call
// the result of helmet() is exactly a function
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
                baseUri: ["'self'"],
                fontSrc: ["'self'", 'https:', 'http:', 'data:'],
                scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
                styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
                imgSrc: ["'self'", 'data:', 'blob:'],
            },
        },
    })
)

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
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())
// This middleware will remove the dollar sign and dot from the request body and query string

// Data sanitization against XSS
app.use(xss())
// This middleware will clean any user input from malicious HTML code

// Prevent parameter pollution
app.use(
    hpp({
        // the parameters that we want to allow to be passed multiple times
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
)
// This middleware will prevent parameter pollution, which means that if the same parameter is passed multiple times, the last value will be used

// Test middleware
app.use((req, res, next) => {
    // console.log('Hello from the middleware 😀')
    // console.log(req.cookies)
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

// Only the callback function is running in event loop

// 3) ROUTES

app.use('/', viewRouter)

// Mounting a new router on a route
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

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
