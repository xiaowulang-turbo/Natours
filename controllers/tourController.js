// const fs = require('fs')
const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')

// console.log(tours)

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// )

// Use middlewares to deal with extra logics, this is also the philosophy of express

/*
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
    */

// Keep the handlers function pure

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

exports.getAllTours = catchAsync(async (req, res, next) => {
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
})

exports.getTour = catchAsync(async (req, res, next) => {
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
})

exports.createTour = catchAsync(async (req, res, next) => {
    // async function will return a promise
    const newTour = await Tour.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    })
})

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true, // This is to make sure the data we are updating is valid
    })
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    // In restful API, we use 204 to indicate that the request is successful but there is no content to return
    await Tour.findByIdAndDelete(req.params.id)
    // 204: no content
    res.status(204).json({
        status: 'success',
        data: null,
    })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
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
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { numTourStarts: -1 },
        },
        {
            $limit: 6,
        },
    ])

    res.status(200).json({
        status: 'success',
        results: plan.length,
        data: { plan },
    })
})
