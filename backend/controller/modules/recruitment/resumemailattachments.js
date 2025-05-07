const Resumemailattachment = require('../../../model/modules/recruitment/resumemailattachments');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
//get All Resumemailattachment =>/api/areas
exports.getAllResumemailattachment = catchAsyncErrors(async (req, res, next) => {
    let resumemailattachment;
    try {
        resumemailattachment = await Resumemailattachment.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!resumemailattachment) {
        return next(new ErrorHandler('Resumemailattachment not found!', 404));
    }
    return res.status(200).json({
        resumemailattachment
    });
})


//create new Resumemailattachment => /api/Resumemailattachment/new
exports.addResumemailattachment = catchAsyncErrors(async (req, res, next) => {
    // let checkloc = await Resumemailattachment.findOne({ code: req.body.code, });

    // if (checkloc) {
    //     return next(new ErrorHandler('Code already exist!', 400));
    // }
    // let checklocname = await Resumemailattachment.findOne({ name: req.body.name });

    // if (checklocname) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aarea = await Resumemailattachment.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single Resumemailattachment => /api/Resumemailattachment/:id
exports.getSingleResumemailattachment = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sresumemailattachment = await Resumemailattachment.findById(id);
    if (!sresumemailattachment) {
        return next(new ErrorHandler('Resumemailattachment not found', 404));
    }
    return res.status(200).json({
        sresumemailattachment
    })
})
//update Resumemailattachment by id => /api/Resumemailattachment/:id
exports.updateResumemailattachment = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uresumemailattachment = await Resumemailattachment.findByIdAndUpdate(id, req.body);
    if (!uresumemailattachment) {
        return next(new ErrorHandler('Resumemailattachment not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})
//delete Resumemailattachment by id => /api/Resumemailattachment/:id
exports.deleteResumemailattachment = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dresumemailattachment = await Resumemailattachment.findByIdAndRemove(id);
    if (!dresumemailattachment) {
        return next(new ErrorHandler('Resumemailattachment not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})