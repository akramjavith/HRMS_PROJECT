
const PenaltyErrorControl = require('../../../model/modules/production/errorcontrol');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All PenaltyErrorControl => /api/penaltyerrorcontrol
exports.getAllPenaltyErrorControl = catchAsyncErrors(async (req, res, next) => {
    let penaltyerrorcontrol;
    try {
        penaltyerrorcontrol = await PenaltyErrorControl.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltyerrorcontrol) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        penaltyerrorcontrol,
    });
});


// Create new penaltyerrorreason=> /api/penaltyerrorcontrol/new
exports.addPenaltyErrorControl = catchAsyncErrors(async (req, res, next) => {

    const { projectvendor, process, mode, rate , islock  } = req.body;

    let filteredData = await PenaltyErrorControl.findOne({ projectvendor,process ,mode: { $regex: `\\b${mode}\\b`, $options: 'i' } , rate: rate , islock: { $regex: `\\b${islock}\\b`, $options: 'i' } });



    if (!filteredData) {
        let apenaltyerrorcontrol = await PenaltyErrorControl.create(req.body);

        return res.status(200).json({
            message: "Successfully added!",
        });
    }

    return next(new ErrorHandler("Data Already Exist!", 404));

});

// get Signle PenaltyErrorControl => /api/penaltyerrorcontrol/:id
exports.getSinglePenaltyErrorControl = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spenaltyerrorcontrol = await PenaltyErrorControl.findById(id);

    if (!spenaltyerrorcontrol) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        spenaltyerrorcontrol,
    });
});

// update PenaltyErrorControl by id => /api/penaltyerrorcontrol/:id
exports.updatePenaltyErrorControl = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const { projectvendor, process, mode, rate , islock  } = req.body;

    let filteredData = await PenaltyErrorControl.findOne({ _id: { $ne: id }, projectvendor,process ,mode: { $regex: `\\b${mode}\\b`, $options: 'i' } , rate: rate , islock: { $regex: `\\b${islock}\\b`, $options: 'i' } });

    if (!filteredData) {
        let upenaltyerrorcontrol = await PenaltyErrorControl.findByIdAndUpdate(id, req.body);
        if (!upenaltyerrorcontrol) {
            return next(new ErrorHandler("Data not found!", 404));
        }
        return res.status(200).json({ message: "Updated successfully" });
    }
    return next(new ErrorHandler("Data Already Exist!", 404));

});

// delete PenaltyErrorControl by id => /api/penaltyerrorcontrol/:id
exports.deletePenaltyErrorControl = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dpenaltyerrorcontrol = await PenaltyErrorControl.findByIdAndRemove(id);

    if (!dpenaltyerrorcontrol) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});