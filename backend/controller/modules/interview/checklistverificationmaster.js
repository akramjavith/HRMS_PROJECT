const Checklistverificationmaster = require('../../../model/modules/interview/checklistverificationmaster');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Checklistverificationmaster =>/api/Checklistverificationmaster
exports.getAllChecklistverificationmaster = catchAsyncErrors(async (req, res, next) => {
    let checklistverificationmasters;
    try {
        checklistverificationmasters = await Checklistverificationmaster.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!checklistverificationmasters) {
        return next(new ErrorHandler('Checklistverificationmaster not found!', 404));
    }
    return res.status(200).json({
        checklistverificationmasters
    });
})


//create new Checklistverificationmaster => /api/Checklistverificationmaster/new
exports.addChecklistverificationmaster  = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aChecklistverificationmaster = await Checklistverificationmaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Checklistverificationmaster => /api/Checklistverificationmaster/:id
exports.getSingleChecklistverificationmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let schecklistverificationmaster = await Checklistverificationmaster.findById(id);
    if (!schecklistverificationmaster) {
        return next(new ErrorHandler('Checklistverificationmaster not found', 404));
    }
    return res.status(200).json({
        schecklistverificationmaster
    })
})

//update Checklistverificationmaster by id => /api/Checklistverificationmaster/:id
exports.updateChecklistverificationmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uchecklistverificationmaster = await Checklistverificationmaster.findByIdAndUpdate(id, req.body);
    if (!uchecklistverificationmaster) {
        return next(new ErrorHandler('Checklistverificationmaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Checklistverificationmaster by id => /api/Checklistverificationmaster/:id
exports.deleteChecklistverificationmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dchecklistverificationmaster = await Checklistverificationmaster.findByIdAndRemove(id);
    if (!dchecklistverificationmaster) {
        return next(new ErrorHandler('Checklistverificationmaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})