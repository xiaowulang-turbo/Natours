// const fs = require('fs')
const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

// console.log(tours)

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// )

// Use middlewares to deal with extra logics, this is also the philosophy of express

exports.checkID = (req, res, next, val) => {
    console.log(`Tour ID is: ${val}`)

    if (req.params.id * 1 >= tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }
    next()
}

exports.checkBody = (req, res, next) => {
    console.log(req.body)

    if (!req.body.name || !req.body.price) {
        // 400: bad request
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price',
        })
    }
    // Never miss the next() function
    next()
}

// Keep the handlers function pure

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

exports.getAllTours = async (req, res) => {
    try {
        // Another way to get query
        // const tours = await Tour.find()
        //     .where('difficulty')
        //     .equals('easy')
        //     .where('duration')
        //     .lt(5)

        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
        const tours = await features.query

        res.status(200).json({
            status: 'success',
            // only count when we have an array
            requestedAt: req.requestTime,
            results: tours.length || 1,
            data: {
                tours,
            },
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.getTour = async (req, res) => {
    try {
        // a nice trick to convert string to number
        const tour = await Tour.findById(req.params.id)
        // const tour = await Tour.findOne({ _id: req.params.id })

        // variables made by const and let cannot be accessed before where they are declared

        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        // In restful API, we use 204 to indicate that the request is successful but there is no content to return
        await Tour.findByIdAndDelete(req.params.id)
        // 204: no content
        res.status(204).json({
            status: 'success',
            data: null,
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    // _id: '$ratingsAverage',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
            // {
            //     // We can repeat such stages as many times as we want
            //     $match: { _id: { $ne: 'EASY' } },
            // },
        ])
        res.status(200).json({
            status: 'success',
            data: {
                stats,
            },
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        })
    }
}
