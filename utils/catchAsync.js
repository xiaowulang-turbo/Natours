// recieve a function and return a function. If error occurs, it will be passed to the error handling middleware
module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next)
