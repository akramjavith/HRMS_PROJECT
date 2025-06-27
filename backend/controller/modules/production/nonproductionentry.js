const Nonproductionentry = require("../../../model/modules/production/nonproductionentry");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");

// get All Nonproductionentry => /api/Nonproductionentry
exports.getAllNonproductionentry = catchAsyncErrors(async (req, res, next) => {
    let nonproductionentrys;
    try {
        nonproductionentrys = await Nonproductionentry.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!nonproductionentrys) {
        return next(new ErrorHandler("Nonproductionentry not found!", 404));
    }
    return res.status(200).json({
        nonproductionentrys,
    });
});

// Create new Nonproductionentry=> /api/Nonproductionentry/new
exports.addNonproductionentry = catchAsyncErrors(async (req, res, next) => {

    let aNonproductionentry = await Nonproductionentry.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle Nonproductionentry => /api/Nonproductionentry/:id
exports.getSingleNonproductionentry = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let snonproductionentry = await Nonproductionentry.findById(id);

    if (!snonproductionentry) {
        return next(new ErrorHandler("Nonproductionentry not found!", 404));
    }
    return res.status(200).json({
        snonproductionentry,
    });
});

// update Nonproductionentry by id => /api/Nonproductionentry/:id
exports.updateNonproductionentry = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let unonproductionentry = await Nonproductionentry.findByIdAndUpdate(id, req.body);

    if (!unonproductionentry) {
        return next(new ErrorHandler("Nonproductionentry not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete Nonproductionentry by id => /api/Nonproductionentry/:id
exports.deleteNonproductionentry = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dnonproductionentry = await Nonproductionentry.findByIdAndRemove(id);

    if (!dnonproductionentry) {
        return next(new ErrorHandler("Nonproductionentry Name not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});


