const express = require('express')
const fs = require('fs')
const morgan = require('morgan')

const app = express()

// 1) MIDDLEWARE

app.use(morgan('dev'))

// Middleware: function in the middle of request and response, can modify request and response
app.use(express.json())

app.use((req, res, next) => {
    console.log('Hello from the middleware 😀')
    //console.log(req.headers);
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)
// console.log(tours);

// 2) ROUTE HANDLERS

const getAllTours = (req, res) => {
    console.log(req.requestTime)

    res.status(200).json({
        status: 'success',
        // only count when we have an array
        requestedAt: req.requestTime,
        results: tours?.length || 1,
        data: {
            tours,
        },
    })
}

const getTour = (req, res) => {
    console.log(req.params)

    // a nice trick to convert string to number
    const id = req.params.id * 1
    const tour = tours.find((el) => el.id === id)

    // variables made by const and let cannot be accessed before where they are declared
    // if (id > tours.length) {
    if (!tour) {
        // use return to stop the function immediately
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    })
}

const createTour = (req, res) => {
    //console.log(req.body);
    const id = tours[tours.length - 1].id + 1

    const newTour = Object.assign({ id }, req.body)
    tours.push(newTour)

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            })
        }
    )
}

const updateTour = (req, res) => {
    if (req.params.id * 1 >= tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>',
        },
    })
}

const deleteTour = (req, res) => {
    if (req.params.id * 1 >= tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }

    // 204: no content
    res.status(204).json({
        status: 'success',
        data: null,
    })
}

//

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

const getUser = (req, res) => {
    // 500: server error
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

/*
// Only the callback function is running in event loop
app.get('/api/v1/tours', getAllTours);
// The route should be matched exactly, use ? to make some params optional
app.get('/api/v1/tours/:id/:x/:y?', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
*/

// 3) ROUTES

app.route('/api/v1/tours').get(getAllTours).post(createTour)

app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)

app.route('/api/v1/users').get(getAllUsers).post(createUser)

app.route('/api/v1/users').get(getUser).patch(updateUser).delete(deleteUser)

// 4) START SERVER

const port = 3000
app.listen(port, () => {
    console.log('Server is running on port 3000...')
})
