const express = require('express')
const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController')
const { signup, login, protect } = require('../controllers/authController')

const router = express.Router()

// this route is not a good restful api practice, but it is a good way to sign up a user
router.post('/signup', signup)

router.post('/login', login)

router.route('/').get(protect, getAllUsers).post(createUser)

router
    .route('/:id')
    .get(protect, getUser)
    .patch(protect, updateUser)
    .delete(protect, deleteUser)

module.exports = router
