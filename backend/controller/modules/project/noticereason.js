const Noticereason = require('../../../model/modules/project/noticereason');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Noticereason =>/api/Noticereason
exports.getAllNoticereason = catchAsyncErrors(async (req, res, next) => {
    let noticereasons;
    try {
        noticereasons = await Noticereason.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!noticereasons) {
        return next(new ErrorHandler('Noticereason not found!', 404));
    }
    return res.status(200).json({
        noticereasons
    });
})



//create new Noticereason => /api/Noticereason/new
exports.addNoticereason = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aNoticereason = await Noticereason.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Noticereason => /api/Noticereason/:id
exports.getSingleNoticereason = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let snoticereason= await Noticereason.findById(id);
    if (!snoticereason) {
        return next(new ErrorHandler('Noticereason not found', 404));
    }
    return res.status(200).json({
        snoticereason
    })
})

//update Noticereason by id => /api/Noticereason/:id
exports.updateNoticereason = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let unoticereason = await Noticereason.findByIdAndUpdate(id, req.body);
    if (!unoticereason) {
        return next(new ErrorHandler('Noticereason not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Noticereason by id => /api/Noticereason/:id
exports.deleteNoticereason = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dnoticereason = await Noticereason.findByIdAndRemove(id);
    if (!dnoticereason) {
        return next(new ErrorHandler('Noticereason not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
