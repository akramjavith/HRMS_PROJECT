const Locationgrouping = require('../../model/modules/locationgrouping');
const User = require('../../model/login/auth');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');
//get All Locationgrouping =>/api/Locationgrouping
exports.getAllLocationgrouping = catchAsyncErrors(async (req, res, next) => {
    let locationgroupings;
    try {
        locationgroupings = await Locationgrouping.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!locationgroupings) {
        return next(new ErrorHandler('Locationgrouping not found!', 404));
    }
    return res.status(200).json({
        locationgroupings
    });
})


//create new Locationgrouping => /api/Locationgrouping/new
exports.addLocationgrouping = catchAsyncErrors(async (req, res, next) => {
    let checkloc = await Locationgrouping.findOne({ code: req.body.code, });

    // if (checkloc) {
    //     return next(new ErrorHandler('Code already exist!', 400));
    // }
    // let checklocname = await Locationgrouping.findOne({ name: req.body.name });

    // if (checklocname) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let alocationgrouping = await Locationgrouping.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single Locationgrouping => /api/Locationgrouping/:id
exports.getSingleLocationgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let slocationgrouping = await Locationgrouping.findById(id);
    if (!slocationgrouping) {
        return next(new ErrorHandler('Locationgrouping not found', 404));
    }
    return res.status(200).json({
        slocationgrouping
    })
})
//update Locationgrouping by id => /api/Locationgrouping/:id
exports.updateLocationgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ulocationgrouping = await Locationgrouping.findByIdAndUpdate(id, req.body);
    if (!ulocationgrouping) {
        return next(new ErrorHandler('Locationgrouping not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})
//delete Locationgrouping by id => /api/Locationgrouping/:id
exports.deleteLocationgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dlocationgrouping = await Locationgrouping.findByIdAndRemove(id);
    if (!dlocationgrouping) {
        return next(new ErrorHandler('Locationgrouping not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})