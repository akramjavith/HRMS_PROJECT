const Pagetype = require('../../../model/modules/project/pagetype');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


// get All Pagetype => /api/Pagetype
exports.getAllPagetype = catchAsyncErrors(async (req, res, next) => {
    let pagetypes;
    try {
        pagetypes = await Pagetype.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!pagetypes) {
        return next(new ErrorHandler('Pagetypes not found!', 404));
    }
    return res.status(200).json({
        pagetypes
    });
})


// Create new Pagetype=> /api/projectmaster/new
exports.addPagetype = catchAsyncErrors(async (req, res, next) => {

    let aproduct = await Pagetype.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'

    });
})

// get Signle Pagetype => /api/projectmaster/:id
exports.getSinglePagetype = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spagetype = await Pagetype.findById(id);

    if (!spagetype) {
        return next(new ErrorHandler('Pagetype not found!', 404));
    }
    return res.status(200).json({
        spagetype
    })
})

// update Pagetype by id => /api/projmaster/:id
exports.updatePagetype = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upagetype = await Pagetype.findByIdAndUpdate(id, req.body);

    if (!upagetype) {
        return next(new ErrorHandler('Pagetype not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// delete Pagetype by id => /api/projectmaster/:id
exports.deletePagetype = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dpagetype = await Pagetype.findByIdAndRemove(id);

    if (!dpagetype) {
        return next(new ErrorHandler('Pagetype not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})