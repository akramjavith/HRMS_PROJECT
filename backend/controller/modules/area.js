const Area = require('../../model/modules/area');
const User = require('../../model/login/auth');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');
//get All Area =>/api/areas
exports.getAllArea = catchAsyncErrors(async (req, res, next) => {
    let areas;
    try {
        areas = await Area.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!areas) {
        return next(new ErrorHandler('Area not found!', 404));
    }
    return res.status(200).json({
        areas
    });
})


//create new area => /api/area/new
exports.addArea = catchAsyncErrors(async (req, res, next) => {
    let checkloc = await Area.findOne({ code: req.body.code, });

    if (checkloc) {
        return next(new ErrorHandler('Code already exist!', 400));
    }
    let checklocname = await Area.findOne({ name: req.body.name });

    if (checklocname) {
        return next(new ErrorHandler('Name already exist!', 400));
    }
    let aarea = await Area.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single area => /api/area/:id
exports.getSingleArea = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sarea = await Area.findById(id);
    if (!sarea) {
        return next(new ErrorHandler('Area not found', 404));
    }
    return res.status(200).json({
        sarea
    })
})
//update area by id => /api/area/:id
exports.updateArea = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uarea = await Area.findByIdAndUpdate(id, req.body);
    if (!uarea) {
        return next(new ErrorHandler('Area not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})
//delete area by id => /api/area/:id
exports.deleteArea = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let darea = await Area.findByIdAndRemove(id);
    if (!darea) {
        return next(new ErrorHandler('Area not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})