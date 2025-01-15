const dotenv = require('dotenv')

// This config should be ahead of app.js. Otherwise it will not work in other files
dotenv.config({
    path: './config.env',
})

const app = require('./app')

// This env is set by express
console.log(app.get('env'))

// Everything has nothing to do with express should be done outside app.js
// console.log(process.env)
// this process is set by node.js

const port = 3000
app.listen(port, () => {
    console.log('Server is running on port 3000...')
})
