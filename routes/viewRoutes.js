const express = require('express')

const router = express.Router()
const { isLoggedIn } = require('../controllers/authController')
const { protect } = require('../controllers/authController')

const {
    getOverview,
    getTour,
    getLoginForm,
    getAccount,
    // updateUserData,
} = require('../controllers/viewController')

// router.use(isLoggedIn)

router.get('/', isLoggedIn, getOverview)
router.get('/tour/:slug', isLoggedIn, getTour)
router.get('/login', isLoggedIn, getLoginForm)
router.get('/me', protect, getAccount)
// router.post('/submit-user-data', protect, updateUserData)
// router.post('/submit-user-data', protect, updateUserData)

module.exports = router
