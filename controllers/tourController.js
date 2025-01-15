const fs = require('fs')

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

// Use middlewares to deal with extra logics, this is also the philosophy of express

exports.checkID = (req, res, next, val) => {
    console.log(`Tour ID is: ${val}`)

    if (req.params.id * 1 >= tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }
    next()
}

exports.checkBody = (req, res, next) => {
    console.log(req.body)

    if (!req.body.name || !req.body.price) {
        // 400: bad request
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price',
        })
    }
    // Never miss the next() function
    next()
}

// Keep the handlers function pure

exports.getAllTours = (req, res) => {
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

exports.getTour = (req, res) => {
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

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>',
        },
    })
}

exports.deleteTour = (req, res) => {
    // 204: no content
    res.status(204).json({
        status: 'success',
        data: null,
    })
}
