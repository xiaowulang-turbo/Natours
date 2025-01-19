// const fs = require('fs')
const Tour = require('../models/tourModel')

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

class APIFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        const queryObj = { ...this.queryString }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach((el) => delete queryObj[el])

        // 1B) Advanced filtering
        // we cannot use await here because we need to deal with other queries like sort, limit, page later
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        )
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 100
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)

        if (this.queryString.page) {
            const numTours = Tour.countDocuments()
            if (skip >= numTours) throw new Error('This page does not exist')
        }

        return this
    }
}

exports.getAllTours = async (req, res) => {
    try {
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
