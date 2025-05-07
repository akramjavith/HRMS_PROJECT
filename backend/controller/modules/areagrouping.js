const Areagrouping = require('../../model/modules/areagrouping');
const User = require('../../model/login/auth');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');
//get All Areagrouping =>/api/Areagrouping
exports.getAllAreagrouping = catchAsyncErrors(async (req, res, next) => {
    let areagroupings;
    try {
        areagroupings = await Areagrouping.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!areagroupings) {
        return next(new ErrorHandler('Areagrouping not found!', 404));
    }
    return res.status(200).json({
        areagroupings
    });
})


//create new Areagrouping => /api/Areagrouping/new
exports.addAreagrouping = catchAsyncErrors(async (req, res, next) => {
    let checkloc = await Areagrouping.findOne({ code: req.body.code, });

    // if (checkloc) {
    //     return next(new ErrorHandler('Code already exist!', 400));
    // }
    // let checklocname = await Areagrouping.findOne({ name: req.body.name });

    // if (checklocname) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aareagrouping = await Areagrouping.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single Areagrouping => /api/Areagrouping/:id
exports.getSingleAreagrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sareagrouping = await Areagrouping.findById(id);
    if (!sareagrouping) {
        return next(new ErrorHandler('Areagrouping not found', 404));
    }
    return res.status(200).json({
        sareagrouping
    })
})
//update Areagrouping by id => /api/Areagrouping/:id
exports.updateAreagrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uareagrouping = await Areagrouping.findByIdAndUpdate(id, req.body);
    if (!uareagrouping) {
        return next(new ErrorHandler('Areagrouping not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})
//delete Areagrouping by id => /api/Areagrouping/:id
exports.deleteAreagrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dareagrouping = await Areagrouping.findByIdAndRemove(id);
    if (!dareagrouping) {
        return next(new ErrorHandler('Areagrouping not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})