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
} = require('../controllers/tourController')
const { protect } = require('../controllers/authController')

const router = express.Router()

// router.param('id', checkID)

// Create a checkBody middleware
// Check if the body contains the name and price property
// If not, send back 400 (Bad Request)
// Add it to the post handler stack

// this must be ahead of the id route or it will not work
router.route('/top-5-cheap').get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)

router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.route('/').get(protect, getAllTours).post(protect, createTour)

router
    .route('/:id')
    .get(protect, getTour)
    .patch(protect, updateTour)
    .delete(protect, deleteTour)

module.exports = router
