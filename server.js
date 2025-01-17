const dotenv = require('dotenv')
const app = require('./app')
const mongoose = require('mongoose')

// This config should be ahead of app.js. Otherwise it will not work in other files
dotenv.config({
    path: './config.env',
})

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
})

// This env is set by express
// console.log(app.get('env'))

// Everything has nothing to do with express should be done outside app.js
// console.log(process.env)
// this process is set by node.js

const tourSchema = require('./models/tourModel')

const testTour = new tourSchema({
    name: 'The Forest Hiker',
    rating: 4.7,
    price: 497,
})
console.log(testTour)

testTour
    .save()
    .then((doc) => {
        console.log(doc)
    })
    .catch((err) => {
        console.log(err)
    })

const port = 3000
app.listen(port, () => {
    console.log('Server is running on port 3000...')
})
