const AppError = require('../utils/appError')

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    })
}

const sendErrorProd = (err, res) => {
    // All errors that we create are operational errors
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
        // Programming or other unknown error: don't leak error details
    } else {
        // 1) Log error
        // console.error('ERROR 💥', err)

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        })
    }
}

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
    // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const value = err.keyValue.name
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400)
}

module.exports = (err, req, res, next) => {
    // console.log(err)
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }

        // User error.name cannot work now since CastError is not a valid error name
        if (error.kind === 'ObjectId') error = handleCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        if (error._message && error._message.includes('validation failed')) {
            error = handleValidationErrorDB(error)
        }
        sendErrorProd(error, res)
    }
}
