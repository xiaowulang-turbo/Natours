const express = require('express')
const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    checkID,
    checkBody,
    aliasTopTours,
} = require('../controllers/tourController')

const router = express.Router()

// router.param('id', checkID)

// Create a checkBody middleware
// Check if the body contains the name and price property
// If not, send back 400 (Bad Request)
// Add it to the post handler stack

// this must be ahead of the id route or it will not work
router.route('/top-5-cheap').get(aliasTopTours, getAllTours)

router.route('/').get(getAllTours).post(createTour)

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
