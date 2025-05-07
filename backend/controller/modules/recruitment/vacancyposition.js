const Approvevacancies = require('../../../model/modules/recruitment/vacancyposition');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
// get All Approvevacancies  Details => /api/queue
exports.getAllApproveVacancies = catchAsyncErrors(async (req, res, next) => {
    let approvevacancies;
    try {
        approvevacancies = await Approvevacancies.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!approvevacancies) {
        return next(new ErrorHandler('Approvevacancies not found', 404));
    }
    return res.status(200).json({
        approvevacancies
    });

})

// Create new Approvevacancies => /api/queue/new
exports.addApproveVacancies = catchAsyncErrors(async (req, res, next) => {
    // let queuegroup = await Approvevacancies.findOne({ name: req.body.name });
    // if (queuegroup) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aapprovevacancies = await Approvevacancies.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Approvevacancies => /api/queue/:id
exports.getSingleApproveVacancies = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sapprovevacancies = await Approvevacancies.findById(id);
    if (!sapprovevacancies) {
        return next(new ErrorHandler('Approvevacancies not found', 404));
    }
    return res.status(200).json({
        sapprovevacancies
    })
})

// update Approvevacancies by id => /api/queue/:id
exports.updateApproveVacancies = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uapprovevacancies = await Approvevacancies.findByIdAndUpdate(id, req.body);
    if (!uapprovevacancies) {
        return next(new ErrorHandler('Approvevacancies Details not found', 404));
    }
    return res.status(200).json({ message: 'Updates successfully' });
})
// delete Approvevacancies by id => /api/queue/:id
exports.deleteApproveVacancies = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dapprovevacancies = await Approvevacancies.findByIdAndRemove(id);
    if (!dapprovevacancies) {
        return next(new ErrorHandler('Approvevacancies Details not found', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})