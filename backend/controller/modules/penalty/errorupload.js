
const PenaltyErrorUpload = require('../../../model/modules/penalty/errorupload');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");



// get All PenaltyErrorUpload => /api/penaltyerrorupload
exports.getAllPenaltyErrorUpload = catchAsyncErrors(async (req, res, next) => {
    let penaltyerrorupload;
    try {
        penaltyerrorupload = await PenaltyErrorUpload.find();
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

    const { projectvendor, process, errortype, ismoving, penaltycalculation, status, rate } = req.body;

    let filteredData = await PenaltyErrorUpload.findOne({ projectvendor, process, errortype: { $regex: `\\b${errortype}\\b`, $options: 'i' }, ismoving, penaltycalculation, status, rate });



    if (!filteredData) {
        let apenaltyerrorupload = await PenaltyErrorUpload.create(req.body);

        return res.status(200).json({
            message: "Successfully added!",
        });
    }

    return next(new ErrorHandler("Data Already Exists!", 404));

});

// get Signle PenaltyErrorUpload => /api/penaltyerrorupload/:id
exports.getSinglePenaltyErrorUpload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spenaltyerrorupload = await PenaltyErrorUpload.findById(id);

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

    const { projectvendor, process, errortype, ismoving, penaltycalculation, status, rate } = req.body;

    let filteredData = await PenaltyErrorUpload.findOne({ _id: { $ne: id }, projectvendor, process, errortype: { $regex: `\\b${errortype}\\b`, $options: 'i' }, ismoving, penaltycalculation, status, rate });

    if (!filteredData) {
        let upenaltyerrorupload = await PenaltyErrorUpload.findByIdAndUpdate(id, req.body);
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

    let dpenaltyerrorupload = await PenaltyErrorUpload.findByIdAndRemove(id);

    if (!dpenaltyerrorupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});


exports.getAllPenaltyErrorUploadFilter = catchAsyncErrors(async (req, res, next) => {
    let penaltyerrorupload;
    try {
        penaltyerrorupload = await PenaltyErrorUpload.find({ projectvendor: req.body.projectvendor, process: req.body.process }, { errortype: 1, status: 1 });
        console.log(penaltyerrorupload, "lol")
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
        penaltyerrorupload = await PenaltyErrorUpload.find({
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