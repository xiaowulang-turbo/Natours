const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
// const Tour = require('../../models/tourModel')
const Review = require('../../models/reviewModel')

dotenv.config({ path: './config.env' })

// The mongondb create method needs a js object rather than a json file
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8', () => {
        console.log('data loaded')
    })
)

// console.log(reviews)

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB connection successful')
    })

const method = process.argv[2]

const importData = async () => {
    try {
        await Review.create(reviews)
        console.log('Data successfully loaded!')
    } catch (err) {
        console.log(err)
    }
    process.exit() // Do not use this in big projects
}

const deleteData = async () => {
    try {
        await Review.deleteMany()
        console.log('Data successfully deleted!')
    } catch (err) {
        console.log(err)
    }
    process.exit()
}

if (method === '--import') {
    importData()
} else if (method === '--delete') {
    deleteData()
}
