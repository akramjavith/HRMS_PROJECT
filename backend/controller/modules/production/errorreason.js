
const PenaltyErrorReason = require('../../../model/modules/production/errorreason');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All PenaltyErrorReason => /api/penaltyerrorreason
exports.getAllPenaltyErrorReason = catchAsyncErrors(async (req, res, next) => {
    let penaltyerrorreason;
    try {
        penaltyerrorreason = await PenaltyErrorReason.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltyerrorreason) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        penaltyerrorreason,
    });
});


// Create new penaltyerrorreason=> /api/penaltyerrorreason/new
exports.addPenaltyErrorReason = catchAsyncErrors(async (req, res, next) => {

    const { projectvendor, process, errortype, reason } = req.body;

    let filteredData = await PenaltyErrorReason.findOne({ projectvendor, process, errortype, reason: { $regex: `\\b${reason}\\b`, $options: 'i' } });



    if (!filteredData) {
        let apenaltyerrorreason = await PenaltyErrorReason.create(req.body);

        return res.status(200).json({
            message: "Successfully added!",
        });
    }

    return next(new ErrorHandler("Data Already Exist!", 404));

});

// get Signle PenaltyErrorReason => /api/penaltyerrorreason/:id
exports.getSinglePenaltyErrorReason = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spenaltyerrorreason = await PenaltyErrorReason.findById(id);

    if (!spenaltyerrorreason) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        spenaltyerrorreason,
    });
});

// update PenaltyErrorReason by id => /api/penaltyerrorreason/:id
exports.updatePenaltyErrorReason = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const { projectvendor, process, errortype, reason } = req.body;

    let filteredData = await PenaltyErrorReason.findOne({ _id: { $ne: id }, projectvendor, process, errortype, reason: { $regex: `\\b${reason}\\b`, $options: 'i' } });

    if (!filteredData) {
        let upenaltyerrorreason = await PenaltyErrorReason.findByIdAndUpdate(id, req.body);
        if (!upenaltyerrorreason) {
            return next(new ErrorHandler("Data not found!", 404));
        }
        return res.status(200).json({ message: "Updated successfully" });
    }
    return next(new ErrorHandler("Data Already Exist!", 404));

});

// delete PenaltyErrorReason by id => /api/penaltyerrorreason/:id
exports.deletePenaltyErrorReason = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dpenaltyerrorreason = await PenaltyErrorReason.findByIdAndRemove(id);

    if (!dpenaltyerrorreason) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllPenaltyErrorReasonFilter = catchAsyncErrors(async (req, res, next) => {
    let penaltyerrorreason;
    try {
        penaltyerrorreason = await PenaltyErrorReason.find({ projectvendor: req.body.projectvendor, process: req.body.process, errortype: req.body.errortype }, { reason: 1 });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltyerrorreason) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        penaltyerrorreason,
    });
});