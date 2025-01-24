const dotenv = require('dotenv')
const mongoose = require('mongoose')

// the shutdown of uncaught exception is required, since the state of the server is not clean anymore
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
    console.log(err.name, err.message)
    process.exit(1)
})
// Handler above must be ahead of app.js
// Handler above is for syncronas errors which have nothing to do with server

const app = require('./app')

// console.log(x) // test for uncaughtException

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

// In real production app, we must have a tool to restart the server when it crashes

// The shutdown of unhandled rejection is optional
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})
