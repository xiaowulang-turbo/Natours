const express = require('express')

const router = express.Router()
const { isLoggedIn } = require('../controllers/authController')

const {
    getOverview,
    getTour,
    getLoginForm,
} = require('../controllers/viewController')

router.use(isLoggedIn)

router.get('/', getOverview)
router.get('/tour/:slug', getTour)
router.get('/login', getLoginForm)

module.exports = router
