// review routes
const express = require('express')

const router = express.Router({ mergeParams: true })
const { protect, restrictTo } = require('../controllers/authController')

const {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    getReview,
    setTourUserIds,
} = require('../controllers/reviewController')

router
    .route('/')
    .get(protect, getAllReviews)
    .post(protect, restrictTo('user'), setTourUserIds, createReview)

router
    .route('/:id')
    .get(getReview)
    .delete(protect, restrictTo('user', 'admin'), deleteReview)
    .patch(protect, restrictTo('user'), updateReview)

module.exports = router
