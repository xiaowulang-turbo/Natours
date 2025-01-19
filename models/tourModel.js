const mongoose = require('mongoose')

// The second argument is the schema options
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            //Validators
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 4.5,
            //Validators
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price'],
        },
        priceDiscount: Number,
        summary: {
            type: String,
            trim: true, // Only work for strings, removes white spaces from the beginning and end
            required: [true, 'A tour must have a summary'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        startDates: [Date],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

// The logic below is business logic rather than application logic, it's a good practice to put it here rather than in the controller
// The function inside will be called whenever a get request is made
tourSchema.virtual('durationWeeks').get(function () {
    // we need a normal function here because we need to use this keyword
    return this.duration / 7
})
// You cannot use query methods on virtual properties

module.exports = mongoose.model('Tour', tourSchema)
