const express = require('express')
const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan,
    getToursWithin,
    getDistances,
} = require('../controllers/tourController')
const { protect, restrictTo } = require('../controllers/authController')
const reviewRouter = require('./reviewRoutes')
// const {
//     // getAllReviews,
//     // createReview,
// } = require('../controllers/reviewController')

const router = express.Router()

// router.param('id', checkID)

// Create a checkBody middleware
// Check if the body contains the name and price property
// If not, send back 400 (Bad Request)
// Add it to the post handler stack

router.use('/:tourId/reviews', reviewRouter)

// this must be ahead of the id route or it will not work
router.route('/top-5-cheap').get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)

router.route('/monthly-plan/:year').get(getMonthlyPlan)

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin)

router.route('/distances/:latlng/unit/:unit').get(getDistances)

router.route('/').get(protect, getAllTours).post(protect, createTour)

router
    .route('/:id')
    .get(protect, getTour)
    .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/987654

// nested routes
// router.route('/:tourId/reviews').post(protect, restrictTo('user'), createReview)

module.exports = router
