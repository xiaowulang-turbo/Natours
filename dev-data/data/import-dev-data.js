const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')

dotenv.config({ path: './config.env' })

// The mongondb create method needs a js object rather than a json file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8', () => {
        console.log('data loaded')
    })
)

// console.log(tours)

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

if (method === '--import') {
    Tour.create(tours)
        .then((docs) => {
            console.log(`${docs.length} tours added successfully`)
        })
        .catch((err) => {
            console.log(err)
        })
} else if (method === '--delete') {
    Tour.deleteMany()
        .then(() => {
            console.log('data deleted')
        })
        .catch((err) => {
            console.log(err)
        })
}
