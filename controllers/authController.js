const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })

exports.signup = catchAsync(async (req, res, next) => {
    // Specify the fields that are required are safer than using req.body, since req.body can be manipulated and some users can be created as a admin easily
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password')
    // We cannot use the sentence below since the user might not exist
    // const correct = await user.correctPassword(password, user.password)

    if (!user || !(await user.correctPassword(password, user.password))) {
        // The error message is a little bit vague so it's good for security
        return next(new AppError('Incorrect email or password', 401))
        // 401: unauthorized
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id)

    res.status(200).json({
        status: 'success',
        token,
    })
})
