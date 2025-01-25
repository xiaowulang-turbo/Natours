const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

exports.signup = catchAsync(async (req, res, next) => {
    // Specify the fields that are required are safer than using req.body, since req.body can be manipulated and some users can be created as a admin easily
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })

    const token = jwt.sign(
        {
            id: newUser._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    )

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    })
})
