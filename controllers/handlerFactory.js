// Handler Factory
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const APIFeatures = require('../utils/apiFeatures')

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

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body)

        res.status(201).json({
            status: 'success',
            data: { doc },
        })
    })

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id)
        if (popOptions) query = query.populate(popOptions)

        const doc = await query

        if (!doc)
            return next(new AppError('No document found with that ID', 404))

        res.status(200).json({
            status: 'success',
            data: { doc },
        })
    })

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        let filter = {}
        if (req.params.tourId) filter = { tour: req.params.tourId }

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        // Explain(.explain()): means that we want to see the query statistics
        const doc = await features.query

        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: { doc },
        })
    })
