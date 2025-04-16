const ShiftRoaster = require('../../model/modules/shiftroaster');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

//get All Shiftroasters =>/api/shiftsroasters
exports.getAllShiftRoaster = catchAsyncErrors(async (req, res, next) => {
    let shiftroasters;
    try {
        shiftroasters = await ShiftRoaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!shiftroasters) {
        return next(new ErrorHandler('ShiftRoaster not found!', 404));
    }
    return res.status(200).json({
        shiftroasters
    });
})

//create new shiftroaster => /api/shiftsroaster/new
exports.addShiftRoaster = catchAsyncErrors(async (req, res, next) => {
    let ashiftsroaster = await ShiftRoaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single shiftroaster=> /api/shiftsroaster/:id
exports.getSingleShiftRoaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sshiftroaster = await ShiftRoaster.findById(id);
    if (!sshiftroaster) {
        return next(new ErrorHandler('ShiftRoaster not found', 404));
    }
    return res.status(200).json({
        sshiftroaster
    })
})

//update shiftsroaster by id => /api/shiftsroaster/:id
exports.updateShiftRoaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ushiftroaster = await ShiftRoaster.findByIdAndUpdate(id, req.body);
    if (!ushiftroaster) {
        return next(new ErrorHandler('ShiftRoaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete shiftsroaster by id => /api/shiftsroaster/:id
exports.deleteShiftRoaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dshiftroaster = await ShiftRoaster.findByIdAndRemove(id);
    if (!dshiftroaster) {
        return next(new ErrorHandler('ShiftRoaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})