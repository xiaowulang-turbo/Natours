const express = require('express')

const router = express.Router()

const { getOverview, getTour } = require('../controllers/viewController')

router.get('/', getOverview)
router.get('/tour/:slug', getTour)

module.exports = router
