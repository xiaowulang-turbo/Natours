const mongoose = require('mongoose')
const slugify = require('slugify')

// The second argument is the schema options
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
        },
        secretTour: {
            type: Boolean,
            default: false,
        },
        slug: String,
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

// DOCUMENT MIDDLEWARE: method of save only runs before .save() and .create()
tourSchema.pre('save', function (next) {
    // console.log('This will run before save')
    // console.log(this)
    this.slug = slugify(this.name, { lower: true })
    next()
})

// Post method executes after all the pre methods execute
// tourSchema.post('save', function (doc, next) {
//     console.log(doc)
//     next()
// })

// QUERY MIDDLEWARE: this object is the query object
tourSchema.pre(/^find/, function (next) {
    // this.start = Date.now()
    this.find({ secretTour: { $ne: true } })
    next()
})

// tourSchema.post(/^find/, function (docs, next) {
//     console.log(`Query took ${Date.now() - this.start} milliseconds`)
//     next()
// })

module.exports = mongoose.model('Tour', tourSchema)
