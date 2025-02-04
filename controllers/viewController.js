const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(async (req, res) => {
    // 1) Get tour data from collection
    const tours = await Tour.find()

    // 2) Build template
    // const html = pug.renderFile(`${__dirname}/../views/overview.pug`, {
    //     title: 'All tours',
    //     tours,
    // })

    // 3) Render that template using tour data
    res.status(200).render('overview', {
        title: 'All tours',
        tours,
    })
})

exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker',
    })
}
