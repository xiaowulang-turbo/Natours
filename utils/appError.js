class AppError extends Error {
    constructor(message, statusCode) {
        super(message) // the parent constructor only takes a message

        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true // this is a custom field

        Error.captureStackTrace(this, this.constructor) // this is a method that captures the stack trace of the error
    }
}
module.exports = AppError
