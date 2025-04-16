
const PenaltyErrorType = require('../../../model/modules/penalty/errortype');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");


exports.getAllPenaltyErrorUploadInvalidEntry = catchAsyncErrors(async (req, res, next) => {
    let penaltyerrorupload;
    try {
        let query = {
            projectvendor: req.body.projectvendor,
            process: req.body.process,
            ismoving: req.body.ismoving,
            status: req.body.status,
            errortype: req.body.errortype
        }

        penaltyerrorupload = await PenaltyErrorType.countDocuments(query);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        // count: products.length,
        penaltyerrorupload,
    });
});

// get All PenaltyErrorUpload => /api/penaltyerrorupload
exports.getAllPenaltyErrorUpload = catchAsyncErrors(async (req, res, next) => {
    let penaltyerrorupload;
    try {
        penaltyerrorupload = await PenaltyErrorType.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltyerrorupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        penaltyerrorupload,
    });
});


// Create new PenaltyErrorUpload=> /api/penaltyerrorupload/new
exports.addPenaltyErrorUpload = catchAsyncErrors(async (req, res, next) => {

    const { projectvendor, process, errortype } = req.body;

    let filteredData = await PenaltyErrorType.findOne({ projectvendor, process, errortype: { $regex: `\\b${errortype}\\b`, $options: 'i' } });



    if (!filteredData) {
        let apenaltyerrorupload = await PenaltyErrorType.create(req.body);

        return res.status(200).json({
            message: "Successfully added!",
        });
    }

    return next(new ErrorHandler("Data Already Exists!", 404));

});

// get Signle PenaltyErrorUpload => /api/penaltyerrorupload/:id
exports.getSinglePenaltyErrorUpload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spenaltyerrorupload = await PenaltyErrorType.findById(id);

    if (!spenaltyerrorupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        spenaltyerrorupload,
    });
});

// update PenaltyErrorUpload by id => /api/penaltyerrorupload/:id
exports.updatePenaltyErrorUpload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const { projectvendor, process, errortype } = req.body;

    let filteredData = await PenaltyErrorType.findOne({ _id: { $ne: id }, projectvendor, process, errortype: { $regex: `\\b${errortype}\\b`, $options: 'i' } });

    if (!filteredData) {
        let upenaltyerrorupload = await PenaltyErrorType.findByIdAndUpdate(id, req.body);
        if (!upenaltyerrorupload) {
            return next(new ErrorHandler("Data not found!", 404));
        }
        return res.status(200).json({ message: "Updated successfully" });
    }
    return next(new ErrorHandler("Data Already Exisits!", 404));

});

// delete PenaltyErrorUpload by id => /api/penaltyerrorupload/:id
exports.deletePenaltyErrorUpload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dpenaltyerrorupload = await PenaltyErrorType.findByIdAndRemove(id);

    if (!dpenaltyerrorupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllPenaltyErrorUploadFilter = catchAsyncErrors(async (req, res, next) => {
    let penaltyerrorupload;
    try {
        penaltyerrorupload = await PenaltyErrorType.find({ projectvendor: req.body.projectvendor, process: req.body.process }, { errortype: 1, status: 1 });
        // console.log(penaltyerrorupload, "lol")
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltyerrorupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        penaltyerrorupload,
    });
});



exports.getAllPenaltyErrorUploadFilterStatus = catchAsyncErrors(async (req, res, next) => {
    let penaltyerrorupload;
    try {
        penaltyerrorupload = await PenaltyErrorType.find({
            projectvendor: req.body.projectvendor, process: req.body.process,
            errortype: req.body.errortype
        }, { status: 1 });


        console.log(penaltyerrorupload, "status")
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltyerrorupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        penaltyerrorupload,
    });
});
