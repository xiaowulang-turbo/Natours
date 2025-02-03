const mongoose = require('mongoose')
const slugify = require('slugify')
// const validator = require('validator')
// const User = require('./userModel')

// The second argument is the schema options
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [
                40,
                'A tour name must have less or equal than 40 characters',
            ],
            minlength: [
                10,
                'A tour name must have more or equal than 10 characters',
            ],
            // validate: [
            //     validator.isAlpha,
            //     'Tour name must only contain characters',
            // ],
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
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val) => Math.round(val * 10) / 10,
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
        priceDiscount: {
            type: Number,
            validate: [
                function (val) {
                    return val < this.price
                },
                'Discount price ({VALUE}) should be below regular price',
            ],
        },
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
        secretTour: {
            type: Boolean,
            default: false,
        },
        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
                required: [true, 'Coordinates are required'],
            },
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: {
                    type: [Number],
                    required: [true, 'Coordinates are required'],
                },
                address: String,
                description: String,
                day: Number,
            },
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' })

// The logic below is business logic rather than application logic, it's a good practice to put it here rather than in the controller
// The function inside will be called whenever a get request is made
tourSchema.virtual('durationWeeks').get(function () {
    // we need a normal function here because we need to use this keyword
    return this.duration / 7
})
// You cannot use query methods on virtual properties

// DOCUMENT MIDDLEWARE: method of save only runs before .save() and .create()
// The this keyword here is the document object
tourSchema.pre('save', function (next) {
    // console.log('This will run before save')
    // console.log(this)
    this.slug = slugify(this.name, { lower: true })
    next()
})

// VIRTUAL POPULATE
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
})

// import guides from the user model
// tourSchema.pre('save', async function (next) {
//     const guides = this.guides.map((id) => User.findById(id))
//     this.guides = await Promise.all(guides)

//     next()
// })

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

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    })
    next()
})

// tourSchema.post(/^find/, function (docs, next) {
//     console.log(`Query took ${Date.now() - this.start} milliseconds`)
//     next()
// })

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    // 只有在不是 geoNear 操作时才添加 secretTour 过滤
    const pipeline = this.pipeline()
    if (!(pipeline.length > 0 && '$geoNear' in pipeline[0])) {
        pipeline.unshift({ $match: { secretTour: { $ne: true } } })
    }
    next()
})

module.exports = mongoose.model('Tour', tourSchema)
