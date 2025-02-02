const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')
const { deleteOne, updateOne, createOne, getOne } = require('./handlerFactory')

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const reviews = await Review.find(filter)

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: { reviews },
    })
})

exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user.id
    next()
}

exports.getReview = getOne(Review)
exports.createReview = createOne(Review)
exports.updateReview = updateOne(Review)
exports.deleteReview = deleteOne(Review)
