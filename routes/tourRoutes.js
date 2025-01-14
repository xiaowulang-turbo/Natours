const express = require('express')
const fs = require('fs')

const tourRouter = express.Router()

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// )
// console.log(tours);

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

tourRouter.route('/').get(getAllTours).post(createTour)

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = tourRouter
