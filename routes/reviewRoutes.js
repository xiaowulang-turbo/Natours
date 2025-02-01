// review routes
const express = require('express')

const router = express.Router({ mergeParams: true })
const { protect, restrictTo } = require('../controllers/authController')

const {
    getAllReviews,
    createReview,
    // deleteReview,
    // updateReview,
} = require('../controllers/reviewController')

router
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), createReview)

// router.route('/:id').delete(deleteReview).patch(updateReview)

module.exports = router
