const express = require('express')
const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController')
const { signup } = require('../controllers/authController')

const router = express.Router()

// this route is not a good restful api practice, but it is a good way to sign up a user
router.post('/signup', signup)

router.route('/').get(getAllUsers).post(createUser)

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
