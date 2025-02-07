const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            // this only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords are not the same!',
        },
    },
    photo: {
        type: String,
        default: 'default.jpg',
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
})

// It is a good idea to use pre middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)

    // This field is not necessary after the password has been hashed
    this.passwordConfirm = undefined

    next()
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()

    // This is ensure the passwordChangedAt time will be after the token was issued
    this.passwordChangedAt = Date.now() - 1000
    next()
})

// active: true
userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } })
    next()
})

// Instance methods: this object refers to the current document
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    // this.password is not available since we set select: false, so we need to use userPassword
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        )
        return JWTTimestamp < changedTimestamp
    }

    return false
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    // console.log({ resetToken }, { passwordResetToken: this.passwordResetToken })

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
