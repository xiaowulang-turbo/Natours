const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = require('./app')

// This config should be ahead of app.js. Otherwise it will not work in other files
dotenv.config({
    path: './config.env',
})

mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successful!'))

// This env is set by express
// console.log(app.get('env'))

// Everything has nothing to do with express should be done outside app.js
// console.log(process.env)
// this process is set by node.js

// const testTour = new tourSchema({
//     name: 'The Forest Hiker',
//     rating: 4.7,
//     price: 497,
// })

const port = 3000

const server = app.listen(port, () => {
    console.log('Server is running on port 3000...')
})

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message)
    console.log('UNHANDLED REJECTION! 💥 Shutting down...')
    server.close(() => {
        process.exit(1)
    })
})
