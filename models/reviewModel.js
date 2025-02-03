// review / rating / createdAt / tour / user
const mongoose = require('mongoose')
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review cannot be empty'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Rating cannot be empty'],
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a tour'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ])

    console.log(stats)

    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
    })
}

// Query middleware
reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name',
    // }).populate({
    //     path: 'user',
    //     select: 'name photo',
    // })

    this.populate({
        path: 'user',
        select: 'name photo',
    })

    next()
})

reviewSchema.post('save', async function () {
    await this.constructor.calcAverageRatings(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne()
    next()
})

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.tour)
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
