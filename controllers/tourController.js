// const fs = require('fs')
const multer = require('multer')
const sharp = require('sharp')
const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const { deleteOne, updateOne, createOne, getOne } = require('./handlerFactory')

// console.log(tours)

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

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload an image.', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
})

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
])

exports.resizeTourImages = catchAsync(async (req, res, next) => {
    next()
})

exports.getTour = getOne(Tour, { path: 'reviews' })
exports.createTour = createOne(Tour)
exports.deleteTour = deleteOne(Tour)
exports.updateTour = updateOne(Tour)

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

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lng',
                400
            )
        )
    }

    const tours = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [[lng * 1, lat * 1], radius],
            },
        },
    })

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours },
    })
})

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')

    // 1 mile = 1609.34 meters
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001

    const distances = await Tour.aggregate([
        {
            // Since we only have one geoSpatial index, it will be used automatically
            $geoNear: {
                near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },
        },
    ])

    res.status(200).json({
        status: 'success',
        data: { distances },
    })
})
