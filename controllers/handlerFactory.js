// Handler Factory
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.deleteOne = (Model) =>
    // Closure: 闭包是指函数可以访问其词法作用域中的变量，即使这个函数在其词法作用域之外被调用
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id)
        if (!doc)
            return next(new AppError('No document found with that ID', 404))

        res.status(204).json({
            status: 'success',
            data: null,
        })
    })

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, // This is to make sure the data we are updating is valid
        })
        if (!doc)
            return next(new AppError('No document found with that ID', 404))

        res.status(200).json({
            status: 'success',
            data: { doc },
        })
    })
