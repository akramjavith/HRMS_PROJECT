const ShiftAllot = require('../../model/modules/shiftallot');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

//get All Shiftallots =>/api/shiftallots
exports.getAllShiftAllot = catchAsyncErrors(async (req, res, next) => {
    let shiftallots;
    try {
        shiftallots = await ShiftAllot.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!shiftallots) {
        return next(new ErrorHandler('ShiftAllot not found!', 404));
    }
    return res.status(200).json({
        shiftallots
    });
})

//create new shiftallot => /api/shiftallot/new
exports.addShiftAllot = catchAsyncErrors(async (req, res, next) => {
    let ashiftallot = await ShiftAllot.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single shiftallot=> /api/shiftallot/:id
exports.getSingleShiftAllot = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sshiftallot = await ShiftAllot.findById(id);
    if (!sshiftallot) {
        return next(new ErrorHandler('ShiftAllot not found', 404));
    }
    return res.status(200).json({
        sshiftallot
    })
})

//update shiftallot by id => /api/shiftallot/:id
exports.updateShiftAllot = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ushiftallot = await ShiftAllot.findByIdAndUpdate(id, req.body);
    if (!ushiftallot) {
        return next(new ErrorHandler('ShiftAllot not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete shiftallot by id => /api/shiftallot/:id
exports.deleteShiftAllot = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dshiftallot = await ShiftAllot.findByIdAndRemove(id);
    if (!dshiftallot) {
        return next(new ErrorHandler('ShiftAllot not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})