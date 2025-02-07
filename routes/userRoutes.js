const express = require('express')
const {
    getAllUsers,
    createUser,
    getMe,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    uploadUserPhoto,
    resizeUserPhoto,
} = require('../controllers/userController')
const {
    signup,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword,
    logout,
} = require('../controllers/authController')

const router = express.Router()

// this route is not a good restful api practice, but it is a good way to sign up a user
router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)
router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
router.patch('/updateMyPassword', protect, updatePassword)
router.patch('/updateMe', protect, uploadUserPhoto, resizeUserPhoto, updateMe)
router.delete('/deleteMe', protect, deleteMe)

router.route('/me').get(protect, getMe, getUser)
router.route('/').get(protect, getAllUsers).post(createUser)

router
    .route('/:id')
    .get(protect, getUser)
    .patch(protect, restrictTo('admin'), updateUser)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteUser)

module.exports = router
