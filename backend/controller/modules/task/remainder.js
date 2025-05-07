const Remainder = require('../../../model/modules/task/remainder');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Remainder =>/api/Remainder
exports.getAllRemainder = catchAsyncErrors(async (req, res, next) => {
    let remainders;
    try {
        remainders = await Remainder.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!remainders) {
        return next(new ErrorHandler('Remainder not found!', 404));
    }
    return res.status(200).json({
        remainders
    });
})


//create new Remainder => /api/Remainder/new
exports.addRemainder = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aRemainder = await Remainder.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Remainder => /api/Remainder/:id
exports.getSingleRemainder = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sremainder = await Remainder.findById(id);
    if (!sremainder) {
        return next(new ErrorHandler('Remainder not found', 404));
    }
    return res.status(200).json({
        sremainder
    })
})

//update Remainder by id => /api/Remainder/:id
exports.updateRemainder = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uremainder = await Remainder.findByIdAndUpdate(id, req.body);
    if (!uremainder) {
        return next(new ErrorHandler('Remainder not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Remainder by id => /api/Remainder/:id
exports.deleteRemainder = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dremainder = await Remainder.findByIdAndRemove(id);
    if (!dremainder) {
        return next(new ErrorHandler('Remainder not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
